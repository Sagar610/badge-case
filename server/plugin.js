import { loadProfile, parseUsername } from "./github.js";

function send(res, status, body) {
  const json = JSON.stringify(body);
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(json);
}

async function handle(req, res, next) {
  const rawUrl = req.url || "";
  if (!rawUrl.startsWith("/api/profile")) return next();

  const url = new URL(rawUrl, "http://localhost");
  const username = parseUsername(url.searchParams.get("user") || "");

  if (!username) {
    send(res, 400, { error: "Paste a GitHub username or profile URL." });
    return;
  }

  try {
    const data = await loadProfile(username);
    send(res, data.found ? 200 : 404, data);
  } catch (error) {
    send(res, 502, { error: error.message || "Could not read that GitHub profile." });
  }
}

export function achievementsApi() {
  return {
    name: "achievements-api",
    configureServer(server) {
      server.middlewares.use(handle);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handle);
    },
  };
}
