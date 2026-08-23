import "./style.css";
import {
  STARTER_ALT,
  STARTER_ORDER,
  TRACK_STATUS,
  USER_LIST,
  bySlug,
  neededLabel,
} from "./catalog.js";
import progress from "../progress.json";

const form = document.querySelector("#lookup");
const input = document.querySelector("#profile");
const go = document.querySelector("#go");
const statusEl = document.querySelector("#status");
const results = document.querySelector("#results");

const LAST_KEY = "badge-case:last-user";

document.querySelectorAll("[data-user]").forEach((button) => {
  button.addEventListener("click", () => {
    input.value = button.dataset.user;
    form.requestSubmit();
  });
});

const tracksEl = document.querySelector("#tracks");
const roster = document.querySelector("#roster");
renderTracks(new Map());
renderRoster(new Map());

const saved = localStorage.getItem(LAST_KEY);
if (saved) input.value = saved;

const params = new URLSearchParams(location.search);
if (params.get("user")) {
  input.value = params.get("user");
  lookup(input.value);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  lookup(input.value);
});

function showStatus(message) {
  statusEl.hidden = !message;
  statusEl.textContent = message || "";
}

async function lookup(raw) {
  const user = String(raw || "").trim();
  if (!user) {
    showStatus("Paste a GitHub username or profile URL.");
    return;
  }

  go.disabled = true;
  go.textContent = "Opening…";
  showStatus("");
  results.hidden = true;
  results.innerHTML = "";

  try {
    const response = await fetch(`/api/profile?user=${encodeURIComponent(user)}`);
    const data = await response.json();

    if (!response.ok || data.found === false) {
      showStatus(data.error || "That GitHub profile was not found, or the achievements page is hidden.");
      return;
    }

    localStorage.setItem(LAST_KEY, data.user.login);
    const next = new URL(location.href);
    next.searchParams.set("user", data.user.login);
    history.replaceState(null, "", next);

    const earnedMap = new Map(data.achievements.map((item) => [item.slug, item]));
    renderTracks(earnedMap);
    renderRoster(earnedMap);
    render(data);
  } catch {
    showStatus("Could not reach the lookup server. Run npm run dev and try again.");
  } finally {
    go.disabled = false;
    go.textContent = "Check my badges";
  }
}

function render(data) {
  const earnedMap = new Map(data.achievements.map((item) => [item.slug, item]));
  const listed = USER_LIST.map(bySlug);
  const earnableList = listed.filter((item) => item.status === "earnable");
  const earnedEarnable = earnableList.filter((item) => earnedMap.has(item.slug));
  const plan = starterPlan(earnedMap);
  const remaining = Math.max(0, 5 - earnedEarnable.length);

  results.innerHTML = `
    ${profileBlock(data, earnedEarnable.length, earnableList.length, remaining)}
    ${data.hidden ? `<p class="status info">GitHub is not listing achievements on this public tab yet. That can mean zero badges, or the tab is still catching up after you turned visibility on.</p>` : ""}
    ${planBlock(plan, earnedEarnable.length, data.achievements, data.user.login)}
    ${badgeSection("How to earn each one", howCards(earnedMap))}
  `;
  results.hidden = false;
  results.scrollIntoView({ behavior: "smooth", block: "start" });

  results.querySelector("#copy-readme")?.addEventListener("click", async (event) => {
    const text = results.querySelector("#readme-md")?.textContent || "";
    await navigator.clipboard.writeText(text);
    event.currentTarget.textContent = "Copied";
    setTimeout(() => {
      event.currentTarget.textContent = "Copy markdown";
    }, 1600);
  });
}

function profileBlock(data, have, total, remaining) {
  const { user } = data;
  const joined = user.created
    ? new Date(user.created).toLocaleDateString(undefined, { year: "numeric", month: "short" })
    : "";

  return `
    <article class="profile">
      <img src="${escapeAttr(user.avatar)}" alt="" />
      <div>
        <h2>${escapeHtml(user.name || user.login)}</h2>
        <a href="${escapeAttr(user.url)}" target="_blank" rel="noreferrer">@${escapeHtml(user.login)}</a>
        ${user.bio ? `<p class="muted">${escapeHtml(user.bio)}</p>` : ""}
        <div class="stats">
          <span class="pill good">${have} of ${total} earnable</span>
          <span class="pill">${data.achievements.length} shown on profile</span>
          <span class="pill">${remaining === 0 ? "Starter pack complete" : `${remaining} more to reach 5`}</span>
          <span class="pill">${user.repos ?? "—"} repos · ${user.followers ?? "—"} followers${joined ? ` · joined ${joined}` : ""}</span>
        </div>
      </div>
    </article>
  `;
}

function starterPlan(earnedMap) {
  const missing = STARTER_ORDER.map(bySlug).filter((item) => item && !earnedMap.has(item.slug));
  if (!earnedMap.has(STARTER_ALT) && !missing.some((item) => item.slug === "public-sponsor")) {
    missing.push(bySlug(STARTER_ALT));
  }
  if (earnedMap.has("public-sponsor") && !earnedMap.has(STARTER_ALT)) {
    missing.push(bySlug(STARTER_ALT));
  }
  return missing.filter(Boolean).slice(0, 5);
}

function renderTracks(earnedMap) {
  const cards = progress.tracks
    .map((track) => {
      const badges = track.badges
        .map((slug) => {
          const item = bySlug(slug);
          const earned = earnedMap.has(slug) || progress.proof?.[slug];
          const proof = progress.proof?.[slug];
          return `<li class="${earned ? "done" : ""}">
            <img src="${escapeAttr(item.image)}" alt="" />
            <span>${escapeHtml(item.name)}</span>
            ${earned ? `<em>done</em>` : `<em>${escapeHtml(neededLabel(item))}</em>`}
            ${proof ? `<a href="${escapeAttr(proof)}" target="_blank" rel="noreferrer">proof</a>` : ""}
          </li>`;
        })
        .join("");
      return `
        <article class="track ${track.status}">
          <p class="eyebrow">${escapeHtml(TRACK_STATUS[track.status] || track.status)}</p>
          <h3>${escapeHtml(track.title)}</h3>
          <p class="muted">${escapeHtml(track.notes)}</p>
          <ul class="track-badges">${badges}</ul>
        </article>
      `;
    })
    .join("");

  tracksEl.innerHTML = `
    <div class="section-head">
      <div>
        <h3>Sagar610 plan tracks</h3>
        <p class="muted">Goal: ${progress.goal} badges. Pull Shark bronze needs 16 merged PRs.</p>
      </div>
    </div>
    <div class="track-grid">${cards}</div>
  `;
}

function renderRoster(earnedMap) {
  const rows = USER_LIST.map((slug) => {
    const item = bySlug(slug);
    const earned = earnedMap.get(slug);
    const pick = STARTER_ORDER.includes(slug);
    const status = earned
      ? `Earned${earned.tier && earned.tier !== "default" ? ` · ${earned.tier} ×${earned.count}` : ""}`
      : item.status === "dormant"
        ? "Cannot earn"
        : pick
          ? "Get this"
          : "Later";
    return `
      <tr class="${earned ? "is-earned" : ""} ${pick ? "is-pick" : ""} ${item.status}">
        <td class="badge-cell"><img src="${escapeAttr(item.image)}" alt="" /> ${escapeHtml(item.name)}</td>
        <td>${escapeHtml(item.blurb)}</td>
        <td>${escapeHtml(neededLabel(item))}</td>
        <td>${status}</td>
      </tr>
    `;
  }).join("");

  roster.innerHTML = `
    <div class="section-head">
      <div>
        <h3>The 9 badges</h3>
        <p class="muted">Need 5. Skip the two with (?). Do the five marked Get this.</p>
      </div>
    </div>
    <div class="table-wrap">
      <table class="roster">
        <thead>
          <tr>
            <th>Badge</th>
            <th>How to get</th>
            <th>Needed amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function planBlock(plan, already, earned, login = "") {
  if (plan.length === 0) {
    return `
      <div class="section-head"><h3>Your 5-badge plan</h3></div>
      <div class="plan">
        <article class="plan-card">
          <p>You already have the starter set. Tier up Pull Shark, Pair Extraordinaire, or Galaxy Brain, or aim for Starstruck at 16 stars on a repo you created.</p>
        </article>
        ${readmeCard(earned)}
      </div>
    `;
  }

  const steps = plan
    .map((item, index) => {
      const first = item.how[0];
      return `<li><strong>${index + 1}. ${escapeHtml(item.name)}</strong> — ${escapeHtml(first)}</li>`;
    })
    .join("");

  return `
    <div class="section-head">
      <div>
        <h3>Your next ${plan.length} badges</h3>
        <p class="muted">You have ${already} earnable badge${already === 1 ? "" : "s"}. Do these on real work — no second accounts.</p>
      </div>
    </div>
    <div class="plan">
      <article class="plan-card">
        <p>Five from your list.${login.toLowerCase() === "sagar610" ? " You already have 1 merged PR — one more unreviewed merge can unlock both YOLO and Pull Shark." : ""}</p>
        <ol>${steps}</ol>
        <p class="note" style="color:#c9bba3">Public Sponsor costs $1+. Use Galaxy Brain instead if you want a free fifth badge (2 accepted Discussion answers).</p>
      </article>
        ${readmeCard(earned)}
      </div>
    `;
}

function readmeCard(earned = []) {
  const lines = earned.length
    ? earned.map((item) => {
        const catalog = bySlug(item.slug);
        const image = item.image || catalog?.image || "";
        return `![${item.name}](${image})`;
      })
    : STARTER_ORDER.map((slug) => {
        const item = bySlug(slug);
        return `![${item.name}](${item.image})`;
      });

  const markdown = `## GitHub Achievements\n\n${lines.join("\n")}`;

  return `
    <article class="readme">
      <h3 style="margin:0 0 8px;font-family:var(--serif)">README snippet</h3>
      <p class="muted" style="color:#c9bba3">${earned.length ? "Earned badges, ready for a profile README." : "Paste this after the starter badges appear on your profile."}</p>
      <pre id="readme-md">${escapeHtml(markdown)}</pre>
      <button class="copy-btn" id="copy-readme" type="button">Copy markdown</button>
    </article>
  `;
}

function badgeSection(title, cards, empty = "") {
  return `
    <div class="section-head"><h3>${title}</h3></div>
    ${empty || `<div class="grid">${cards}</div>`}
  `;
}

function howCards(earnedMap) {
  return USER_LIST.map((slug) => {
    const item = bySlug(slug);
    const earned = earnedMap.get(slug);
    const how = item.how.map((step) => `<li>${escapeHtml(step)}</li>`).join("");
    const pick = STARTER_ORDER.includes(slug);
    return `
      <article class="card ${earned ? "earned" : "locked"} ${item.status}">
        <div class="medal">
          <img src="${escapeAttr(item.image)}" alt="" />
          <div>
            <h4>${escapeHtml(item.name)}</h4>
            <span class="tier ${earned?.tier || "default"}">${earned ? "earned" : pick ? "get this" : item.status}</span>
          </div>
        </div>
        <p class="blurb">${escapeHtml(item.blurb)}</p>
        <p class="note">Needed: ${escapeHtml(neededLabel(item))}</p>
        <ol class="how">${how}</ol>
        ${item.note ? `<p class="note">${escapeHtml(item.note)}</p>` : ""}
      </article>
    `;
  }).join("");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll("'", "&#39;");
}
