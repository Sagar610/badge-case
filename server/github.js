import { ACHIEVEMENTS, HIGHLIGHTS } from "../src/catalog.js";

const USER_RE = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,38})$/;
const RESERVED = new Set([
  "orgs",
  "settings",
  "login",
  "signup",
  "marketplace",
  "explore",
  "topics",
  "collections",
  "events",
  "sponsors",
  "about",
  "features",
  "enterprise",
  "pricing",
  "security",
  "notifications",
  "apps",
  "codespaces",
  "copilot",
]);

const UA = "github-badge-case/1.0 (+https://github.com)";

export function parseUsername(input) {
  const raw = String(input || "").trim();
  if (!raw) return null;

  const asUrl = raw.includes("://")
    ? raw
    : /^github\.com\//i.test(raw)
      ? `https://${raw}`
      : null;

  if (asUrl) {
    try {
      const url = new URL(asUrl);
      if (!/(^|\.)github\.com$/i.test(url.hostname)) return null;
      const part = url.pathname.split("/").filter(Boolean)[0];
      return validUsername(part);
    } catch {
      return null;
    }
  }

  return validUsername(raw.replace(/^@/, ""));
}

function validUsername(value) {
  if (!value || !USER_RE.test(value)) return null;
  if (RESERVED.has(value.toLowerCase())) return null;
  return value;
}

export function parseAchievements(html) {
  const earned = [];
  const seen = new Set();
  const chunks = html.split("js-achievement-card-details").slice(1);

  for (const chunk of chunks) {
    const slug = chunk.match(/data-achievement-slug="([^"]+)"/)?.[1];
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);

    const image =
      chunk.match(/<img[^>]*class="[^"]*achievement-badge-card[^"]*"[^>]*src="([^"]+)"/)?.[1] ||
      chunk.match(/<img[^>]*src="([^"]+)"[^>]*class="[^"]*achievement-badge-card[^"]*"/)?.[1] ||
      chunk.match(/src="(https:\/\/github\.githubassets\.com\/[^"]+)"/)?.[1] ||
      null;

    const name = chunk.match(/alt="Achievement:\s*([^"]+)"/)?.[1] || slug;
    const tierMatch = chunk.match(/achievement-tier-label--(\w+)[^>]*>\s*x(\d+)/i);

    earned.push({
      slug,
      name: name.replace(/\s+x\d+$/i, "").trim(),
      image,
      tier: tierMatch?.[1]?.toLowerCase() || "default",
      count: tierMatch ? Number(tierMatch[2]) : 1,
    });
  }

  if (earned.length === 0) {
    for (const match of html.matchAll(/Achievement:\s*([^"<\n]+)/g)) {
      const label = match[1].replace(/\s+x\d+$/i, "").trim();
      const catalog = ACHIEVEMENTS.find(
        (item) => item.name.toLowerCase() === label.toLowerCase(),
      );
      const slug = catalog?.slug;
      if (!slug || seen.has(slug)) continue;
      seen.add(slug);
      earned.push({
        slug,
        name: catalog.name,
        image: catalog.image,
        tier: "default",
        count: 1,
      });
    }
  }

  return earned;
}

export function parseHighlights(html) {
  const found = [];
  const tests = [
    { id: "pro", re: /class="[^"]*Label--purple[^"]*"[^>]*>\s*PRO\s*</i },
    { id: "developer-program", re: /Developer Program Member/i },
    { id: "campus-expert", re: /GitHub Campus Expert/i },
    { id: "security-bug-bounty", re: /Security Bug Bounty Hunter/i },
    { id: "security-advisory", re: /Security advisory credit/i },
    { id: "github-star", re: /(?:aria-label|title)="GitHub Star"/i },
  ];

  for (const test of tests) {
    if (test.re.test(html)) {
      const meta = HIGHLIGHTS.find((item) => item.id === test.id);
      if (meta) found.push(meta);
    }
  }
  return found;
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": UA,
      Accept: "text/html,application/json",
    },
  });
  return response;
}

export async function loadProfile(username) {
  const [userRes, htmlRes] = await Promise.all([
    fetchText(`https://api.github.com/users/${username}`),
    fetchText(`https://github.com/${encodeURIComponent(username)}?tab=achievements`),
  ]);

  let apiUser = null;
  if (userRes.ok) {
    apiUser = await userRes.json();
    if (apiUser?.message === "Not Found") return { found: false, username };
  } else if (userRes.status === 404) {
    return { found: false, username };
  }

  const hidden = htmlRes.status === 404;
  if (!htmlRes.ok && !hidden) {
    throw new Error(`GitHub profile returned ${htmlRes.status}`);
  }

  const html = hidden ? "" : await htmlRes.text();

  const user = {
    login: apiUser?.login || username,
    name: apiUser?.name || match(html, /itemprop="name">([^<]+)/),
    bio: apiUser?.bio || match(html, /class="[^"]*user-profile-bio[^"]*"[^>]*>([^<]+)/),
    avatar:
      apiUser?.avatar_url ||
      match(html, /property="og:image" content="([^"]+)"/) ||
      `https://github.com/${username}.png`,
    url: apiUser?.html_url || `https://github.com/${username}`,
    repos: apiUser?.public_repos ?? null,
    followers: apiUser?.followers ?? null,
    following: apiUser?.following ?? null,
    created: apiUser?.created_at || null,
  };

  return {
    found: true,
    hidden,
    user,
    achievements: hidden ? [] : parseAchievements(html),
    highlights: hidden ? [] : parseHighlights(html),
  };
}

function match(html, regex) {
  const value = html.match(regex)?.[1]?.trim();
  return value || null;
}
