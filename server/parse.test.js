import { parseAchievements, parseUsername } from "./github.js";

const sample = `
  <div class="js-achievement-card-details" data-achievement-slug="pull-shark">
    <img src="https://github.githubassets.com/assets/pull-shark-default-498c279a747d.png" alt="Achievement: Pull Shark" class="achievement-badge-card" />
    <span class="Label achievement-tier-label achievement-tier-label--bronze">x2</span>
  </div>
  <div class="js-achievement-card-details" data-achievement-slug="yolo">
    <img src="https://github.githubassets.com/assets/yolo-default.png" alt="Achievement: YOLO" class="achievement-badge-card" />
  </div>
`;

const parsed = parseAchievements(sample);
if (parsed.length !== 2) throw new Error(`expected 2 badges, got ${parsed.length}`);
if (parsed[0].slug !== "pull-shark" || parsed[0].tier !== "bronze" || parsed[0].count !== 2) {
  throw new Error(`pull-shark parse failed: ${JSON.stringify(parsed[0])}`);
}
if (parsed[1].slug !== "yolo" || parsed[1].count !== 1) {
  throw new Error(`yolo parse failed: ${JSON.stringify(parsed[1])}`);
}

const cases = [
  ["torvalds", "torvalds"],
  ["@gaearon", "gaearon"],
  ["https://github.com/octocat", "octocat"],
  ["github.com/octocat/", "octocat"],
  ["https://github.com/octocat?tab=achievements", "octocat"],
  ["https://www.github.com/octocat", "octocat"],
  ["https://gitlab.com/octocat", null],
  ["settings", null],
];

for (const [input, expected] of cases) {
  const got = parseUsername(input);
  if (got !== expected) throw new Error(`parseUsername(${input}) => ${got}, expected ${expected}`);
}

console.log("parse tests passed");
