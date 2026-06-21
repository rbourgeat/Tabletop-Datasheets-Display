function extractUnits(doc) {
  const g = getGame();
  const entries = doc.querySelectorAll("selectionEntry");
  const units = [];
  const nameSet = new Set();
  const isAos = currentGame === "aos";

  entries.forEach((entry) => {
    const type = entry.getAttribute("type");
    if (type !== "model" && type !== "unit") return;
    if (entry.closest("selectionEntryGroup")) return;

    const name = entry.getAttribute("name");
    if (!name || nameSet.has(name)) return;
    nameSet.add(name);

    const profiles = entry.querySelectorAll("profiles > profile");
    let unitProfile = null;
    const abilities = [];
    const ranged = [];
    const melee = [];
    let transportCap = null;

    profiles.forEach((prof) => {
      const typeId = prof.getAttribute("typeId");
      const pName = prof.getAttribute("name");
      const chars = prof.querySelectorAll("characteristics > characteristic");
      const get = (id) => {
        for (const c of chars) {
          if (c.getAttribute("typeId") === id) return c.textContent.trim();
        }
        return "—";
      };

      if (typeId === g.types.UNIT) {
        if (isAos) {
          unitProfile = {
            Move: get(g.unitCharIds.Move),
            Health: get(g.unitCharIds.Health),
            Save: get(g.unitCharIds.Save),
            Control: get(g.unitCharIds.Control),
          };
        } else {
          unitProfile = {
            M: get(g.unitCharIds.M),
            T: get(g.unitCharIds.T),
            SV: get(g.unitCharIds.SV),
            W: get(g.unitCharIds.W),
            LD: get(g.unitCharIds.LD),
            OC: get(g.unitCharIds.OC),
          };
        }
      } else if (isAos && typeId === g.types.ABILITY_PASSIVE) {
        abilities.push({
          name: pName,
          type: "passive",
          Timing: "—",
          Declare: "—",
          Effect: get(g.abilityPassiveCharIds.Effect),
          Keywords: get(g.abilityPassiveCharIds.Keywords),
        });
      } else if (isAos && typeId === g.types.ABILITY_ACTIVATED) {
        abilities.push({
          name: pName,
          type: "activated",
          Timing: get(g.abilityActivatedCharIds.Timing),
          Declare: get(g.abilityActivatedCharIds.Declare),
          Effect: get(g.abilityActivatedCharIds.Effect),
          Keywords: get(g.abilityActivatedCharIds.Keywords),
        });
      } else if (!isAos && typeId === g.types.ABILITY) {
        abilities.push({ name: pName, desc: get("9b8f-694b-e5e-b573") });
      } else if (typeId === g.types.RANGED) {
        if (isAos) {
          ranged.push({
            name: pName,
            Rng: get(g.rangedCharIds.Rng),
            Atk: get(g.rangedCharIds.Atk),
            Hit: get(g.rangedCharIds.Hit),
            Wnd: get(g.rangedCharIds.Wnd),
            Rnd: get(g.rangedCharIds.Rnd),
            Dmg: get(g.rangedCharIds.Dmg),
            Ability: get(g.rangedCharIds.Ability),
          });
        } else {
          ranged.push({
            name: pName,
            Range: get(g.rangedCharIds.Range),
            A: get(g.rangedCharIds.A),
            BS: get(g.rangedCharIds.BS),
            S: get(g.rangedCharIds.S),
            AP: get(g.rangedCharIds.AP),
            D: get(g.rangedCharIds.D),
            Keywords: get(g.rangedCharIds.Keywords),
          });
        }
      } else if (typeId === g.types.MELEE) {
        if (isAos) {
          melee.push({
            name: pName,
            Atk: get(g.meleeCharIds.Atk),
            Hit: get(g.meleeCharIds.Hit),
            Wnd: get(g.meleeCharIds.Wnd),
            Rnd: get(g.meleeCharIds.Rnd),
            Dmg: get(g.meleeCharIds.Dmg),
            Ability: get(g.meleeCharIds.Ability),
          });
        } else {
          melee.push({
            name: pName,
            Range: "Melee",
            A: get(g.meleeCharIds.A),
            WS: get(g.meleeCharIds.WS),
            S: get(g.meleeCharIds.S),
            AP: get(g.meleeCharIds.AP),
            D: get(g.meleeCharIds.D),
            Keywords: get(g.meleeCharIds.Keywords),
          });
        }
      } else if (!isAos && typeId === g.types.TRANSPORT) {
        transportCap = get(g.transportCharId);
      }
    });

    let pts = 0;
    const costEl = entry.querySelector("costs > cost");
    if (costEl) pts = parseInt(costEl.getAttribute("value"), 10) || 0;

    const kw = [];
    entry.querySelectorAll("categoryLinks > categoryLink").forEach((cl) => {
      const n = cl.getAttribute("name");
      if (n) kw.push(n);
    });

    units.push({ name, unitProfile, abilities, ranged, melee, transportCap, pts, keywords: kw });
  });

  return units;
}

function renderCard(u) {
  const card = document.createElement("div");
  card.className = "card";

  const hdr = document.createElement("div");
  hdr.className = "card-header";
  hdr.innerHTML = `<h2>${esc(u.name)}</h2>`;
  if (u.keywords.length) {
    const kw = document.createElement("div");
    kw.className = "keywords";
    kw.innerHTML = u.keywords.map((k) => `<span>${esc(k)}</span>`).join("");
    hdr.appendChild(kw);
  }
  card.appendChild(hdr);

  if (u.unitProfile) {
    const sb = document.createElement("div");
    sb.className = "stat-bar";
    const g = getGame();
    g.unitStatLabels.forEach((label, i) => {
      const key = g.unitStatKeys[i];
      const s = document.createElement("div");
      s.className = "stat";
      s.innerHTML = `<div class="label">${label}</div><div class="value">${esc(u.unitProfile[key] || "—")}</div>`;
      sb.appendChild(s);
    });
    if (g.unitStatKeys.length < g.unitStatLabels.length) {
      for (let i = g.unitStatKeys.length; i < g.unitStatLabels.length; i++) {
        const label = g.unitStatLabels[i];
        const key = g.unitStatKeys.length > 0 ? g.unitStatKeys[0] : null;
        const s = document.createElement("div");
        s.className = "stat";
        const val = u.unitProfile[label] || u.unitProfile[key] || "—";
        s.innerHTML = `<div class="label">${label}</div><div class="value">${esc(val)}</div>`;
        sb.appendChild(s);
      }
    }
    card.appendChild(sb);
  }

  const body = document.createElement("div");
  body.className = "card-body";

  if (u.ranged.length) body.appendChild(section("RANGED WEAPONS", weaponTable(u.ranged, true)));
  if (u.melee.length) body.appendChild(section("MELEE WEAPONS", weaponTable(u.melee, false)));

  if (u.abilities.length) {
    const ul = document.createElement("ul");
    ul.className = "abilities-list";
    u.abilities.forEach((a) => {
      const li = document.createElement("li");
      if (currentGame === "aos") {
        let html = `<strong>${esc(a.name)}</strong>`;
        if (a.type === "activated") {
          html += `<p><em>${esc(a.Timing)}</em></p>`;
          if (a.Declare && a.Declare !== "—") html += formatDesc(a.Declare);
          html += formatDesc(a.Effect);
        } else {
          html += formatDesc(a.Effect);
        }
        if (a.type === "activated") li.dataset.type = "activated";
        li.innerHTML = html;
      } else {
        li.innerHTML = `<strong>${esc(a.name)}</strong>${formatDesc(a.desc)}`;
      }
      ul.appendChild(li);
    });
    body.appendChild(section("ABILITIES", ul));
  }

  if (u.transportCap) {
    const p = document.createElement("p");
    p.innerHTML = `<strong>TRANSPORT:</strong> ${esc(u.transportCap)} MODELS`;
    body.appendChild(p);
  }

  if (u.pts > 0) {
    const p = document.createElement("div");
    p.className = "pts";
    p.textContent = u.pts + " PTS";
    body.appendChild(p);
  }

  card.appendChild(body);
  return card;
}

function section(title, content) {
  const div = document.createElement("div");
  const h3 = document.createElement("h3");
  h3.textContent = title;
  div.appendChild(h3);
  if (typeof content === "string") div.insertAdjacentHTML("beforeend", content);
  else div.appendChild(content);
  return div;
}

function weaponTable(weapons, isRanged) {
  const g = getGame();
  const fields = isRanged ? g.weaponFieldsRanged : g.weaponFieldsMelee;

  let html = '<table class="weapon-table"><thead><tr>';
  fields.forEach((f) => { html += `<th>${f.toUpperCase()}</th>`; });
  html += "</tr></thead><tbody>";

  weapons.forEach((w) => {
    html += "<tr>";
    html += `<td class="name">${esc(w.name)}</td>`;
    fields.forEach((f) => {
      if (f === "NAME") return;
      html += `<td>${formatInline(w[f] || "") || "—"}</td>`;
    });
    html += "</tr>";
  });

  html += "</tbody></table>";
  return html;
}

function formatInline(text) {
  if (!text) return "";
  let t = esc(text);
  t = t.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  t = t.replace(/\^\^(.+?)\^\^/g, "<em>$1</em>");
  return t;
}

function formatDesc(text) {
  if (!text || text === "—") return "";
  return "<p>" + formatInline(text).replace(/\n\n/g, "</p><p>") + "</p>";
}

function esc(s) {
  if (!s) return "";
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}
