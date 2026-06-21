const loadingBar = document.getElementById("loadingBar");
const cacheBadge = document.getElementById("cacheBadge");
const fileSelect = document.getElementById("fileSelect");
const fileDropdown = document.getElementById("fileDropdown");
const dropLabel = fileSelect.querySelector(".label");
const statusEl = document.getElementById("status");
const grid = document.getElementById("grid");
const mainTitle = document.getElementById("mainTitle");
const mainSubtitle = document.getElementById("mainSubtitle");
const versionSwitch = document.getElementById("versionSwitch");

function showLoading(show) { loadingBar.classList.toggle("active", show); }

function libDisplay(name) {
  let d = name.replace(/\.cat$/, "");
  if (currentGame === "aos") d = d.replace(/\s*-\s*Library$/, "");
  return d;
}

function showCacheBadge(fromCache) {
  // cache transparent pour l'utilisateur
}

function applyTheme(gameKey) {
  document.body.classList.toggle("theme-aos", gameKey === "aos");
  document.querySelectorAll(".game-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.game === gameKey);
  });
  const info = getGameInfo();
  const g = getGame();
  mainTitle.innerHTML = g.title;
  mainSubtitle.textContent = g.subtitle;

  versionSwitch.innerHTML = "";
  Object.entries(info.versions).forEach(([key, ver]) => {
    const btn = document.createElement("button");
    btn.className = "version-btn" + (key === currentVersion ? " active" : "");
    btn.dataset.version = key;
    btn.textContent = ver.label;
    btn.addEventListener("click", async () => {
      if (key === currentVersion) return;
      currentVersion = key;
      applyTheme(currentGame);
      fileDropdown.innerHTML = "";
      dropLabel.textContent = "— SELECT CATALOG —";
      grid.innerHTML = "";
      statusEl.textContent = "";
      showCacheBadge(false);
      files = [];
      selectedValue = "";
      await loadListing();
    });
    versionSwitch.appendChild(btn);
  });
}

function closeDrop() { fileSelect.classList.remove("open"); fileDropdown.classList.remove("open"); }

function toggleDrop(e) {
  e.stopPropagation();
  const isOpen = fileSelect.classList.contains("open");
  document.querySelectorAll(".crt-select.open, .crt-drop.open").forEach((el) => el.classList.remove("open"));
  if (!isOpen) { fileSelect.classList.add("open"); fileDropdown.classList.add("open"); }
}

function pick(value, text) {
  selectedValue = value;
  dropLabel.textContent = text;
  closeDrop();
  writeUrlState(currentGame, currentVersion, value);
  if (value) loadCatalogue(value);
}

async function loadListing() {
  showLoading(true);
  let fromCache = false;
  const cacheKey = "listing_" + currentGame + "_" + currentVersion;

  try {
    const cached = Cache.get(cacheKey);
    if (cached) {
      files = cached;
      fromCache = true;
    } else {
      const resp = await fetch(apiUrl(), { headers: { Accept: "application/vnd.github.v3+json" } });
      if (!resp.ok) {
        if (resp.status === 403) throw new Error("GitHub API rate limit reached");
        throw new Error("HTTP " + resp.status);
      }
      const data = await resp.json();
      files = data.filter((item) => item.name.endsWith(".cat") && item.type === "file").map((item) => item.name).sort();
      if (currentGame === "aos") files = files.filter((n) => n.includes(" - Library"));
      Cache.set(cacheKey, files, 30);
    }

    fileDropdown.innerHTML = "";
    files.forEach((f) => {
      const div = document.createElement("div");
      div.className = "crt-select-opt";
      div.dataset.value = f;
      const display = libDisplay(f);
      div.textContent = display;
      div.addEventListener("click", () => pick(f, display));
      fileDropdown.appendChild(div);
    });
    statusEl.textContent = files.length + " CATALOGS";
    showCacheBadge(fromCache);
  } catch (e) {
    statusEl.textContent = "⚠ API RETRIEVAL ERROR";
    console.warn(e);
    grid.innerHTML = `<p class="error">Could not reach the GitHub API (rate limit reached?). Details: ${e.message}</p>`;
  }

  showLoading(false);

  if (files.length) {
    const urlState = readUrlState();
    const urlGame = urlState.game || "wh40k";
    if (urlGame === currentGame && urlState.catalog && files.includes(urlState.catalog)) {
      pick(urlState.catalog, libDisplay(urlState.catalog));
    } else {
      pick(files[0], libDisplay(files[0]));
    }
  }
}

async function loadCatalogue(fileName) {
  grid.innerHTML = "";
  showLoading(true);
  statusEl.textContent = fileName;

  try {
    let xml;
    let fromCache = false;
    const cacheKey = "file_" + currentGame + "_" + currentVersion + "_" + fileName;

    const cached = Cache.get(cacheKey);
    if (cached) {
      xml = cached;
      fromCache = true;
    } else {
      const resp = await fetch(rawUrl(fileName));
      if (!resp.ok) throw new Error("HTTP " + resp.status);
      xml = await resp.text();
      Cache.set(cacheKey, xml, 60);
    }

    const doc = parser.parseFromString(xml, "text/xml");
    const units = extractUnits(doc);
    if (units.length === 0) {
      const baseName = fileName.replace(/\.cat$/, "");
      const faction = baseName.includes(" - ") ? baseName.split(" - ")[0] : baseName;
      const libName = faction + " - Library.cat";
      if (libName !== fileName && files.includes(libName)) {
        pick(libName, libDisplay(libName));
        return;
      }
      grid.innerHTML = '<p class="error">NO UNIT ENTRIES FOUND</p>';
      return;
    }
    units.forEach((u) => grid.appendChild(renderCard(u)));
    statusEl.textContent = libDisplay(fileName) + " // " + units.length + " UNITS";
    showCacheBadge(fromCache);
  } catch (e) {
    grid.innerHTML = '<p class="error">ERROR: ' + e.message + "</p>";
    statusEl.textContent = "ERROR";
  }

  showLoading(false);
}

// === BOOT ===
applyTheme(currentGame);

fileSelect.addEventListener("click", toggleDrop);
document.addEventListener("click", (e) => { if (!e.target.closest(".crt-select-wrap")) closeDrop(); });
fileSelect.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleDrop(e); }
  if (e.key === "Escape") closeDrop();
});

document.getElementById("gameSwitch").addEventListener("click", async (e) => {
  const btn = e.target.closest(".game-btn");
  if (!btn || btn.dataset.game === currentGame) return;
  currentGame = btn.dataset.game;
  currentVersion = GAMES[currentGame].defaultVersion;
  applyTheme(currentGame);
  fileDropdown.innerHTML = "";
  dropLabel.textContent = "— SELECT CATALOG —";
  grid.innerHTML = "";
  statusEl.textContent = "";
  showCacheBadge(false);
  files = [];
  selectedValue = "";
  await loadListing();
});

window.addEventListener("popstate", () => {
  location.reload();
});

loadListing();
