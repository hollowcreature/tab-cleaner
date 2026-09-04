const group_panel = document.getElementById("group-panel");
const stale_panel = document.getElementById("stale-panel");

const group_div = document.getElementById("tab-list");
const group_clean_button = document.getElementById("clean-btn");

const stale_div = document.getElementById("stale-list");
const stale_clean_button = document.getElementById("clean-btn-stale");

const group_panel_button = document.getElementById("nav-groups");
const stale_panel_button = document.getElementById("nav-stale");

function showPanel(hide_group) {
  group_panel.hidden = hide_group;
  stale_panel.hidden = !hide_group;
}

group_panel_button.addEventListener("click", () => showPanel(false));
stale_panel_button.addEventListener("click", () => showPanel(true));

function groupTabsByUrl(tabs) {
  const groups = new Map();

  for (const tab of tabs) {
    if (groups.has(tab.url)) {
      const prev = groups.get(tab.url);
      prev.push(tab);
    } else {
      groups.set(tab.url, [tab]);
    }
  }

  return groups;
}

function renderGroups(groups) {
  group_div.innerHTML = "";
  for (const [url, tabsArray] of groups) {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.dataset.tabIds = tabsArray.map((t) => t.id).join(",");

    const title = tabsArray[0].title;
    const count = tabsArray.length;

    const label = document.createElement("label");
    label.appendChild(checkbox);

    const text = document.createTextNode(
      count > 1 ? `${title} (x${count})` : title,
    );
    label.appendChild(text);

    const row = document.createElement("div");
    row.className = "tab-row";
    row.appendChild(label);
    group_div.appendChild(row);
  }
}

async function handleClean(stale) {
  const div = stale ? stale_div : group_div;
  const checkboxes = Array.from(div.querySelectorAll("input[type=checkbox]"));
  const checked = checkboxes.filter((checkbox) => checkbox.checked);
  const ids = stale
    ? checked.map((c) => Number(c.dataset.tabId))
    : checked.flatMap((checkbox) =>
        checkbox.dataset.tabIds.split(",").map(Number),
      );

  await browser.tabs.remove(ids);
  loadAndRender();
}

function formatStaleness(timestamp) {
  let res = "";

  const elapsed = Date.now() - timestamp;
  const mins = 60 * 1000;
  const hours = 60 * mins;
  const days = 24 * hours;

  if (elapsed <= mins) {
    res += `${Math.floor(elapsed / 1000)} seconds ago`;
  } else if (elapsed <= hours) {
    res += `${Math.floor(elapsed / mins)}min ago`;
  } else if (elapsed <= days) {
    res += `${Math.floor(elapsed / hours)}h ago`;
  } else {
    res += `${Math.floor(elapsed / days)}d ago`;
  }

  return res;
}

function renderStaleList(tabs) {
  stale_div.innerHTML = "";
  tabs.sort((a, b) => a.lastAccessed - b.lastAccessed);

  for (const tab of tabs) {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.dataset.tabId = tab.id;

    const label = document.createElement("label");
    label.appendChild(checkbox);

    const text = document.createTextNode(
      `${tab.title}: last accessed ${formatStaleness(tab.lastAccessed)}`,
    );
    label.appendChild(text);

    const row = document.createElement("div");
    row.className = "tab-row";
    row.appendChild(label);
    stale_div.appendChild(row);
  }
}

async function loadAndRender() {
  const tabs = await browser.tabs.query({});
  const groups = groupTabsByUrl(tabs);
  renderGroups(groups);
  renderStaleList(tabs);
}

group_clean_button.addEventListener("click", () => handleClean(false));
stale_clean_button.addEventListener("click", () => handleClean(true));
loadAndRender();
