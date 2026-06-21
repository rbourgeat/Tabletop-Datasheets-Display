function readUrlState() {
  const params = new URLSearchParams(window.location.search);
  return {
    game: params.get("game") || null,
    version: params.get("ver") || null,
    catalog: params.get("cat") || null,
  };
}

function writeUrlState(game, version, catalog) {
  const params = new URLSearchParams();
  if (game && game !== "wh40k") params.set("game", game);
  if (version && version !== GAMES[game]?.defaultVersion) params.set("ver", version);
  if (catalog) params.set("cat", catalog);
  const qs = params.toString();
  const url = qs ? "?" + qs : window.location.pathname;
  history.pushState({ game, version, catalog }, "", url);
}

const GAMES = {
  wh40k: {
    label: "40K",
    defaultVersion: "v10",
    versions: {
      v10: {
        label: "v10",
        repo: "BSData/wh40k-10e",
        branch: "main",
        title: "--- 40K v10 ARCHIVES ---",
        subtitle: "// DATASTREAM //",
        types: {
          UNIT: "c547-1836-d8a-ff4f",
          RANGED: "f77d-b953-8fa4-b762",
          MELEE: "8a40-4aaa-c780-9046",
          ABILITY: "9cc3-6d83-4dd3-9b64",
          TRANSPORT: "74f8-5443-9d6d-1f1e",
        },
        unitCharIds: {
          M: "e703-ecb6-5ce7-aec1",
          T: "d29d-cf75-fc2d-34a4",
          SV: "450-a17e-9d5e-29da",
          W: "750a-a2ec-90d3-21fe",
          LD: "58d2-b879-49c7-43bc",
          OC: "bef7-942a-1a23-59f8",
        },
        abilityCharId: "9b8f-694b-e5e-b573",
        rangedCharIds: {
          Range: "9896-9419-16a1-92fc",
          A: "3bb-c35f-f54-fb08",
          BS: "94d-8a98-cf90-183e",
          S: "2229-f494-25db-c5d3",
          AP: "9ead-8a10-520-de15",
          D: "a354-c1c8-a745-f9e3",
          Keywords: "7f1b-8591-2fcf-d01c",
        },
        meleeCharIds: {
          A: "2337-daa1-6682-b110",
          WS: "95d1-95f-45b4-11d6",
          S: "ab33-d393-96ce-ccba",
          AP: "41a0-1301-112a-e2f2",
          D: "3254-9fe6-d824-513e",
          Keywords: "893f-9000-ccf7-648e",
        },
        transportCharId: "30f2-be70-861d-1b84",
        unitStatLabels: ["M", "T", "SV", "W", "LD", "OC"],
        unitStatKeys: ["M", "T", "SV", "W", "LD", "OC"],
        weaponFieldsRanged: ["NAME", "Range", "A", "BS", "S", "AP", "D", "Keywords"],
        weaponFieldsMelee: ["NAME", "Range", "A", "WS", "S", "AP", "D", "Keywords"],
      },
      v9: {
        label: "v9",
        repo: "BSData/wh40k-9e",
        branch: "master",
        title: "--- 40K v9 ARCHIVES ---",
        subtitle: "// DATASTREAM //",
        types: {
          UNIT: "800f-21d0-4387-c943",
          RANGED: "d5f97c0b-9fc9-478d-aa34-a7c414d3ea48",
          MELEE: "d5f97c0b-9fc9-478d-aa34-a7c414d3ea48",
          ABILITY: "72c5eafc-75bf-4ed9-b425-78009f1efe82",
          TRANSPORT: "b3a8-0452-7436-44d1",
        },
        unitCharIds: {
          M: "00ca-f8b8-876d-b705",
          T: "0bdf-a96e-9e38-7779",
          SV: "13fc-b29b-31f2-ab9f",
          W: "2218-aa3c-265f-2939",
          LD: "381b-eb28-74c3-df5f",
          OC: "9c9f-9774-a358-3a39",
        },
        abilityCharId: "21befb24-fc85-4f52-a745-64b2e48f8228",
        rangedCharIds: {
          Range: "6fa97fa8-ea74-4a27-a0fb-bc4e5f367464",
          A: "59b1-319e-ec13-d466",
          BS: "077c342f-d7b9-45c6-b8af-88e97cafd3a2",
          S: "75aa-a838-b675-6484",
          AP: "837d-5e63-aeb7-1410",
          D: "ae8a-3137-d65b-4ca7",
          Keywords: "6fa97fa8-ea74-4a27-a0fb-bc4e5f367464",
        },
        meleeCharIds: {
          A: "59b1-319e-ec13-d466",
          WS: "077c342f-d7b9-45c6-b8af-88e97cafd3a2",
          S: "75aa-a838-b675-6484",
          AP: "837d-5e63-aeb7-1410",
          D: "ae8a-3137-d65b-4ca7",
          Keywords: "6fa97fa8-ea74-4a27-a0fb-bc4e5f367464",
        },
        transportCharId: "15aa-1916-a38b-d223",
        unitStatLabels: ["M", "T", "SV", "W", "LD", "OC"],
        unitStatKeys: ["M", "T", "SV", "W", "LD", "OC"],
        weaponFieldsRanged: ["NAME", "Range", "A", "BS", "S", "AP", "D", "Keywords"],
        weaponFieldsMelee: ["NAME", "Range", "A", "WS", "S", "AP", "D", "Keywords"],
      },
    },
  },
  aos: {
    label: "AoS",
    defaultVersion: "4th",
    versions: {
      "4th": {
        label: "4th",
        repo: "BSData/age-of-sigmar-4th",
        branch: "main",
        title: "~~~ AOS 4th SCROLLS ~~~",
        subtitle: "// BESTIARY //",
        types: {
          UNIT: "ff03-376e-972f-8ab2",
          RANGED: "1fd-a42f-41d3-fe05",
          MELEE: "9074-76b6-9e2f-81e3",
          ABILITY_PASSIVE: "907f-a48-6a04-f788",
          ABILITY_ACTIVATED: "59b6-d47a-a68a-5dcc",
        },
        unitCharIds: {
          Move: "fed0-d1b3-1bb8-c501",
          Health: "96be-54ae-ce7b-10b7",
          Save: "1981-ef09-96f6-7aa9",
          Control: "6c6f-8510-9ce1-fc6e",
        },
        abilityPassiveCharIds: {
          Keywords: "b977-7c5e-33b2-428e",
          Effect: "fd7f-888d-3257-a12b",
        },
        abilityActivatedCharIds: {
          Timing: "652c-3d84-4e7-14f4",
          Declare: "bad3-f9c5-ba46-18cb",
          Effect: "b6f1-ba36-6cd-3b03",
          Keywords: "12e8-3214-7d8f-1d0f",
        },
        rangedCharIds: {
          Rng: "c6b5-908c-a604-1a98",
          Atk: "aa17-4296-2887-e05d",
          Hit: "194d-aeb6-5ba7-83b4",
          Wnd: "d3d5-9dc6-13de-8d1",
          Rnd: "d03f-a9ae-3eec-755",
          Dmg: "96c2-d0a5-ea1e-653b",
          Ability: "d793-3dd7-9c13-741e",
        },
        meleeCharIds: {
          Atk: "60e-35aa-31ed-e488",
          Hit: "26dc-168-b2fd-cb93",
          Wnd: "61c1-22cc-40af-2847",
          Rnd: "eccc-10fa-6958-fb73",
          Dmg: "e948-9c71-12a6-6be4",
          Ability: "eda3-7332-5db1-4159",
        },
        unitStatLabels: ["Move", "Health", "Save", "Control"],
        unitStatKeys: ["Move", "Health", "Save", "Control"],
        weaponFieldsRanged: ["NAME", "Rng", "Atk", "Hit", "Wnd", "Rnd", "Dmg", "Ability"],
        weaponFieldsMelee: ["NAME", "Atk", "Hit", "Wnd", "Rnd", "Dmg", "Ability"],
      },
    },
  },
};

const parser = new DOMParser();
const CACHE_PREFIX = "wh40k_viz_3_";

const _urlState = readUrlState();
let currentGame = _urlState.game || "wh40k";
let currentVersion = _urlState.version || GAMES[currentGame].defaultVersion;
let selectedValue = "";
let files = [];

function getGame() {
  return GAMES[currentGame]?.versions[currentVersion];
}

function getGameInfo() {
  return GAMES[currentGame];
}

function apiUrl() {
  const g = getGame();
  return `https://api.github.com/repos/${g.repo}/contents`;
}

function rawUrl(fileName) {
  const g = getGame();
  return `https://raw.githubusercontent.com/${g.repo}/${g.branch}/${encodeURIComponent(fileName)}`;
}
