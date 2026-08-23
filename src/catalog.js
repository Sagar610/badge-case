const IMG = (slug, tier = "default") =>
  `https://github.githubassets.com/images/modules/profile/achievements/${slug}-${tier}.png`;

export const ACHIEVEMENTS = [
  {
    slug: "yolo",
    name: "YOLO",
    blurb: "Merged a pull request without a review.",
    status: "earnable",
    difficulty: "easy",
    minutes: 5,
    tiers: null,
    image: IMG("yolo"),
    how: [
      "Open a repository you own (a small personal project is fine).",
      "Create a branch, make a real change, and open a pull request.",
      "Merge it yourself without requesting a review and without waiting for one.",
      "GitHub awards YOLO when that unreviewed merge lands.",
    ],
    note: "The pull request must have no reviews at all — not even your own approval.",
  },
  {
    slug: "quickdraw",
    name: "Quickdraw",
    blurb: "Closed an issue or pull request within 5 minutes of opening it.",
    status: "earnable",
    difficulty: "easy",
    minutes: 5,
    tiers: null,
    image: IMG("quickdraw"),
    how: [
      "In a repository you own, open a new issue (or pull request).",
      "Close it within five minutes of opening.",
      "Refresh your profile after a few minutes — Quickdraw should appear.",
    ],
    note: "Speed is the only requirement. Do it on your own repo so you are not closing someone else's work.",
  },
  {
    slug: "pull-shark",
    name: "Pull Shark",
    blurb: "Opened pull requests that were merged.",
    status: "earnable",
    difficulty: "easy",
    minutes: 15,
    tiers: [
      { label: "Default", count: 2 },
      { label: "Bronze", count: 16 },
      { label: "Silver", count: 128 },
      { label: "Gold", count: 1024 },
    ],
    image: IMG("pull-shark"),
    how: [
      "Open pull requests and get them merged — your own repositories count.",
      "Two merged PRs unlock the base badge. YOLO already counts as one.",
      "Open and merge a second PR (docs, a fix, or a small feature).",
    ],
    note: "Prefer real contributions. Docs and typo fixes in projects you use are a good start.",
  },
  {
    slug: "pair-extraordinaire",
    name: "Pair Extraordinaire",
    blurb: "Co-authored a commit on a merged pull request.",
    status: "earnable",
    difficulty: "easy",
    minutes: 20,
    tiers: [
      { label: "Default", count: 1 },
      { label: "Bronze", count: 10 },
      { label: "Silver", count: 24 },
      { label: "Gold", count: 48 },
    ],
    image: IMG("pair-extraordinaire"),
    how: [
      "Pair with a real collaborator — a friend, classmate, or teammate who has a GitHub account.",
      "On a commit in the pull request, add this trailer (use their GitHub-linked email):",
      "Co-authored-by: Their Name <their-email@example.com>",
      "Merge the pull request. Both of you typically receive the badge.",
    ],
    note: "GitHub's terms do not allow extra accounts just to farm achievements. Use a real person.",
  },
  {
    slug: "public-sponsor",
    name: "Public Sponsor",
    blurb: "Sponsored an open source contributor through GitHub Sponsors.",
    status: "earnable",
    difficulty: "easy",
    minutes: 10,
    cost: true,
    tiers: null,
    image: IMG("public-sponsor"),
    how: [
      "Open github.com/sponsors and pick a maintainer or project you actually use.",
      "Start a public sponsorship (even the lowest monthly tier counts).",
      "The Public Sponsor badge appears on your profile after the sponsorship is public.",
    ],
    note: "This is a paid badge. Skip it if you would rather earn Galaxy Brain instead.",
  },
  {
    slug: "galaxy-brain",
    name: "Galaxy Brain",
    blurb: "Had discussion answers marked as accepted.",
    status: "earnable",
    difficulty: "medium",
    minutes: 60,
    tiers: [
      { label: "Default", count: 2 },
      { label: "Bronze", count: 8 },
      { label: "Silver", count: 16 },
      { label: "Gold", count: 32 },
    ],
    image: IMG("galaxy-brain"),
    how: [
      "Find repositories with Discussions enabled (Q&A category).",
      "Answer two questions clearly — with steps, links, or a short code sample.",
      "The question author must mark your reply as the accepted answer.",
      "Self-answered discussions generally do not count.",
    ],
    note: "Help in projects you already know. Two accepted answers unlock the base badge.",
  },
  {
    slug: "starstruck",
    name: "Starstruck",
    blurb: "Created a repository that attracted a lot of stars.",
    status: "earnable",
    difficulty: "slow",
    minutes: null,
    tiers: [
      { label: "Default", count: 16 },
      { label: "Bronze", count: 128 },
      { label: "Silver", count: 512 },
      { label: "Gold", count: 4096 },
    ],
    image: IMG("starstruck"),
    how: [
      "Create an original repository (forks do not count).",
      "Ship something people want to star: a useful tool, a clear guide, or a polished demo.",
      "The base badge unlocks at 16 stars on a repo you created.",
    ],
    note: "This one is slow on purpose. Do not buy stars or use fake accounts.",
  },
  {
    slug: "arctic-code-vault-contributor",
    name: "Arctic Code Vault Contributor",
    blurb: "Contributed to a repository archived in the 2020 GitHub Archive Program.",
    status: "retired",
    difficulty: "unobtainable",
    minutes: null,
    tiers: null,
    image: IMG("arctic-code-vault-contributor"),
    how: ["This snapshot ran on 2 February 2020. It cannot be earned anymore."],
    note: "Historical only.",
  },
  {
    slug: "mars-2020-contributor",
    name: "Mars 2020 Contributor",
    blurb: "Contributed code used in the Mars 2020 Helicopter Mission.",
    status: "retired",
    difficulty: "unobtainable",
    minutes: null,
    tiers: null,
    image: IMG("mars-2020-contributor"),
    how: ["Awarded to contributors of repositories that flew with Ingenuity. No longer earnable."],
    note: "Historical only.",
  },
  {
    slug: "heart-on-your-sleeve",
    name: "Heart On Your Sleeve",
    blurb: "Reacted to something on GitHub (community-reported, currently dormant).",
    status: "dormant",
    difficulty: "unobtainable",
    minutes: null,
    tiers: [
      { label: "Default", count: null },
      { label: "Bronze", count: null },
      { label: "Silver", count: null },
      { label: "Gold", count: null },
    ],
    image: IMG("heart-on-your-sleeve"),
    how: ["GitHub has not turned this on. The (?) tiers are unknown because it is dormant."],
    note: "Skip this. It does not count toward the 5.",
  },
  {
    slug: "open-sourcerer",
    name: "Open Sourcerer",
    blurb: "Community-reported multi-repo contribution badge. Currently dormant.",
    status: "dormant",
    difficulty: "unobtainable",
    minutes: null,
    tiers: [
      { label: "Default", count: null },
      { label: "Bronze", count: null },
      { label: "Silver", count: null },
      { label: "Gold", count: null },
    ],
    image: IMG("open-sourcerer"),
    how: ["Not awarded right now. The (?) tiers are unknown because it is dormant."],
    note: "Skip this. It does not count toward the 5.",
  },
];

export const HIGHLIGHTS = [
  {
    id: "pro",
    name: "Pro",
    blurb: "Shown while the account has GitHub Pro (students can get Pro via GitHub Education).",
    href: "https://docs.github.com/en/get-started/learning-about-github/githubs-plans#github-pro",
  },
  {
    id: "developer-program",
    name: "Developer Program Member",
    blurb: "Join the free GitHub Developer Program and build something with the API.",
    href: "https://github.com/settings/apps",
  },
  {
    id: "campus-expert",
    name: "GitHub Campus Expert",
    blurb: "Awarded to accepted GitHub Campus Experts.",
    href: "https://education.github.com/experts",
  },
  {
    id: "security-bug-bounty",
    name: "Security Bug Bounty Hunter",
    blurb: "Helped GitHub through its security bounty program.",
    href: "https://bounty.github.com/",
  },
  {
    id: "security-advisory",
    name: "Security advisory credit",
    blurb: "Has an accepted advisory in the GitHub Advisory Database.",
    href: "https://github.com/advisories",
  },
  {
    id: "github-star",
    name: "GitHub Star",
    blurb: "Recognized through the GitHub Stars program.",
    href: "https://stars.github.com/",
  },
];

/** Exact list the user asked for, in that order. */
export const USER_LIST = [
  "heart-on-your-sleeve",
  "open-sourcerer",
  "starstruck",
  "quickdraw",
  "pair-extraordinaire",
  "pull-shark",
  "galaxy-brain",
  "yolo",
  "public-sponsor",
];

/** Five you can actually finish. Galaxy Brain is the free stand-in for Public Sponsor. */
export const STARTER_ORDER = [
  "quickdraw",
  "yolo",
  "pull-shark",
  "pair-extraordinaire",
  "public-sponsor",
];

export const STARTER_ALT = "galaxy-brain";

export function bySlug(slug) {
  return ACHIEVEMENTS.find((item) => item.slug === slug);
}

export function earnable() {
  return ACHIEVEMENTS.filter((item) => item.status === "earnable");
}

export function neededLabel(item) {
  if (!item.tiers) return "1";
  if (item.tiers.every((tier) => tier.count == null)) return "(?)  (?)  (?)  (?)";
  return item.tiers.map((tier) => `${tier.label} ${tier.count}`).join(" · ");
}

export const TRACK_STATUS = {
  in_progress: "Doing now",
  done: "Done",
  blocked: "Needs a person",
  choose_one: "Pick one",
  later: "Later",
  unavailable: "Cannot earn",
};
