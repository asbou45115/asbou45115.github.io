import { createOceanWallpaper } from "./ocean.js";

const GITHUB_USER = "asbou45115";
const GITHUB = `https://github.com/${GITHUB_USER}`;

/** Optional richer blurbs for known repos; everything else comes from the API */
const curated = {
    black_hole: {
        title: "Black Hole",
        kicker: "WebGL · GLSL",
        desc: "Interactive Schwarzschild black hole with gravitational lensing, a relativistically beamed accretion disk, and a procedural starfield."
    },
    "particle-dispersion-simulation": {
        title: "Particles",
        kicker: "Simulation",
        desc: "Particle dispersion in the browser — motion, density, and patterns from simple rules."
    },
    "plinko-game": {
        title: "Plinko",
        kicker: "Interactive",
        desc: "Drop chips through pegs and watch probability stack into multipliers."
    },
    ascii_renderer: {
        title: "ASCII Renderer",
        kicker: "Python · Pages",
        desc: "Turn images into dense ASCII compositions — save as text or an image."
    }
};

/** @type {Map<string, object>} */
const apps = new Map();
let projectsLoadState = "idle"; // idle | loading | ready | error
let projectsError = "";

const windowsRoot = document.getElementById("windows");
const dockTasks = document.getElementById("dockTasks");
const dockClock = document.getElementById("dockClock");
const tplFolder = document.getElementById("tpl-folder");
const tplProject = document.getElementById("tpl-project");
const tplTerminal = document.getElementById("tpl-terminal");
const tplAbout = document.getElementById("tpl-about");

let zCounter = 10;
const openWindows = new Map();

function buildPagesUrl(repoName) {
    if (repoName.toLowerCase() === `${GITHUB_USER}.github.io`) {
        return `https://${GITHUB_USER}.github.io/`;
    }
    return `https://${GITHUB_USER}.github.io/${repoName}/`;
}

function prettyTitle(name) {
    return name
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

async function fetchAllPublicRepos() {
    let page = 1;
    const all = [];
    while (true) {
        const response = await fetch(
            `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated&page=${page}`
        );
        if (!response.ok) {
            throw new Error(`GitHub API error (${response.status})`);
        }
        const batch = await response.json();
        all.push(...batch);
        if (batch.length < 100) {
            break;
        }
        page += 1;
    }
    return all;
}

async function loadPublishedProjects() {
    if (projectsLoadState === "loading" || projectsLoadState === "ready") {
        return;
    }
    projectsLoadState = "loading";
    try {
        const repos = await fetchAllPublicRepos();
        const pages = repos
            .filter((repo) => !repo.fork && repo.has_pages)
            .filter((repo) => repo.name.toLowerCase() !== `${GITHUB_USER}.github.io`)
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

        apps.clear();
        for (const repo of pages) {
            const meta = curated[repo.name] || {};
            const app = {
                id: repo.name,
                title: meta.title || prettyTitle(repo.name),
                kicker: meta.kicker || repo.language || "Pages",
                desc: meta.desc || repo.description || "Published GitHub Pages project.",
                live: buildPagesUrl(repo.name),
                repo: repo.html_url,
                aliases: [repo.name.toLowerCase(), repo.name.toLowerCase().replace(/-/g, "_")]
            };
            apps.set(app.id, app);
        }
        projectsLoadState = "ready";
        projectsError = "";
        refreshOpenFolderLists();
    } catch (err) {
        projectsLoadState = "error";
        projectsError = err.message || "Failed to load projects";
        refreshOpenFolderLists();
    }
}

function refreshOpenFolderLists() {
    const folder = openWindows.get("projects");
    if (!folder) {
        return;
    }
    populateFolderList(folder.querySelector(".folder-list"), folder.querySelector(".folder-hint"));
}

function populateFolderList(list, hint) {
    list.innerHTML = "";
    if (projectsLoadState === "loading" || projectsLoadState === "idle") {
        if (hint) {
            hint.textContent = "Fetching published Pages…";
        }
        const li = document.createElement("li");
        li.className = "folder-status";
        li.textContent = "Loading…";
        list.appendChild(li);
        return;
    }
    if (projectsLoadState === "error") {
        if (hint) {
            hint.textContent = "Could not reach GitHub API";
        }
        const li = document.createElement("li");
        li.className = "folder-status";
        li.textContent = projectsError;
        list.appendChild(li);
        const retry = document.createElement("li");
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "folder-item";
        btn.innerHTML = `<span class="folder-item-name">Retry</span>`;
        btn.addEventListener("click", () => {
            projectsLoadState = "idle";
            loadPublishedProjects();
            populateFolderList(list, hint);
        });
        retry.appendChild(btn);
        list.appendChild(retry);
        return;
    }

    if (hint) {
        hint.textContent = `${apps.size} published endpoint${apps.size === 1 ? "" : "s"}`;
    }

    if (apps.size === 0) {
        const li = document.createElement("li");
        li.className = "folder-status";
        li.textContent = "No public repos with GitHub Pages enabled.";
        list.appendChild(li);
        return;
    }

    for (const app of apps.values()) {
        const li = document.createElement("li");
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "folder-item";
        btn.innerHTML = `
            <span class="folder-item-name">${app.title}</span>
            <span class="folder-item-meta">${app.kicker}</span>
        `;
        btn.addEventListener("click", () => openProject(app.id));
        li.appendChild(btn);
        list.appendChild(li);
    }
}

function updateClock() {
    const now = new Date();
    dockClock.textContent = now.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit"
    });
    dockClock.dateTime = now.toISOString();
}

function refreshDockTasks() {
    dockTasks.innerHTML = "";
    for (const [id, win] of openWindows) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "dock-task" + (win.classList.contains("is-focused") ? " is-active" : "");
        btn.textContent = win.dataset.title || id;
        btn.addEventListener("click", () => focusWindow(win));
        dockTasks.appendChild(btn);
    }
}

function focusWindow(win) {
    windowsRoot.querySelectorAll(".window").forEach((el) => el.classList.remove("is-focused"));
    win.classList.add("is-focused");
    win.style.zIndex = String(++zCounter);
    refreshDockTasks();

    if (win.dataset.kind === "terminal") {
        win.querySelector("#terminalInput")?.focus();
    }
}

function closeWindow(id) {
    const win = openWindows.get(id);
    if (!win) {
        return;
    }
    win.remove();
    openWindows.delete(id);
    refreshDockTasks();
}

function placeWindow(win, offsetIndex) {
    const isMobile = window.matchMedia("(max-width: 700px)").matches;
    if (isMobile) {
        win.style.top = "8vh";
        win.style.left = "0.75rem";
        return;
    }
    const cascade = (offsetIndex % 6) * 28;
    win.style.top = `${12 + cascade / 8}vh`;
    win.style.left = `calc(22vw + ${cascade}px)`;
}

function enableDrag(win) {
    const bar = win.querySelector(".window-titlebar");
    if (!bar) {
        return;
    }

    let dragging = false;
    let startX = 0;
    let startY = 0;
    let origLeft = 0;
    let origTop = 0;

    bar.addEventListener("pointerdown", (e) => {
        if (e.target.closest(".window-close")) {
            return;
        }
        if (window.matchMedia("(max-width: 700px)").matches) {
            focusWindow(win);
            return;
        }
        dragging = true;
        focusWindow(win);
        startX = e.clientX;
        startY = e.clientY;
        origLeft = win.offsetLeft;
        origTop = win.offsetTop;
        bar.setPointerCapture(e.pointerId);
    });

    bar.addEventListener("pointermove", (e) => {
        if (!dragging) {
            return;
        }
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        const maxLeft = window.innerWidth - 80;
        const maxTop = window.innerHeight - 100;
        win.style.left = `${Math.min(Math.max(8, origLeft + dx), maxLeft)}px`;
        win.style.top = `${Math.min(Math.max(8, origTop + dy), maxTop)}px`;
    });

    bar.addEventListener("pointerup", () => {
        dragging = false;
    });
}

function wireWindowChrome(win, id) {
    win.dataset.windowId = id;
    win.addEventListener("mousedown", () => focusWindow(win));
    win.querySelector(".window-close")?.addEventListener("click", () => closeWindow(id));
    enableDrag(win);
}

function openProject(appKey) {
    const app = apps.get(appKey);
    if (!app) {
        return null;
    }

    const id = `project:${app.id}`;
    if (openWindows.has(id)) {
        focusWindow(openWindows.get(id));
        return openWindows.get(id);
    }

    const node = tplProject.content.firstElementChild.cloneNode(true);
    node.dataset.title = app.title;
    node.querySelector(".window-title").textContent = app.title;
    node.querySelector(".project-kicker").textContent = app.kicker;
    node.querySelector(".project-desc").textContent = app.desc;
    const live = node.querySelector(".project-live");
    const repo = node.querySelector(".project-repo");
    live.href = app.live;
    repo.href = app.repo;

    placeWindow(node, openWindows.size);
    wireWindowChrome(node, id);
    windowsRoot.appendChild(node);
    openWindows.set(id, node);
    focusWindow(node);
    return node;
}

function openProjectsFolder() {
    const id = "projects";
    if (openWindows.has(id)) {
        focusWindow(openWindows.get(id));
        loadPublishedProjects();
        return openWindows.get(id);
    }

    const node = tplFolder.content.firstElementChild.cloneNode(true);
    node.dataset.title = "Projects";
    const list = node.querySelector(".folder-list");
    const hint = node.querySelector(".folder-hint");
    populateFolderList(list, hint);
    loadPublishedProjects();

    placeWindow(node, openWindows.size);
    wireWindowChrome(node, id);
    windowsRoot.appendChild(node);
    openWindows.set(id, node);
    focusWindow(node);
    return node;
}

function openAbout() {
    const id = "about";
    if (openWindows.has(id)) {
        focusWindow(openWindows.get(id));
        return openWindows.get(id);
    }

    const node = tplAbout.content.firstElementChild.cloneNode(true);
    node.dataset.title = "About";
    placeWindow(node, openWindows.size);
    wireWindowChrome(node, id);
    windowsRoot.appendChild(node);
    openWindows.set(id, node);
    focusWindow(node);
    return node;
}

const history = [];
let historyIndex = -1;

function appendTerminal(text, className = "") {
    const out = document.getElementById("terminalOutput");
    if (!out) {
        return;
    }
    const line = document.createElement("div");
    line.className = "term-line" + (className ? ` ${className}` : "");
    line.textContent = text;
    out.appendChild(line);
    out.scrollTop = out.scrollHeight;
}

function resolveProjectAlias(name) {
    const key = name.toLowerCase();
    for (const app of apps.values()) {
        if (app.aliases.includes(key) || app.id.toLowerCase() === key) {
            return app;
        }
    }
    return null;
}

function runCommand(raw) {
    const input = raw.trim();
    if (!input) {
        return;
    }

    appendTerminal(`guest@asif:~$ ${input}`, "term-line--cmd");
    history.unshift(input);
    historyIndex = -1;

    const [cmd, ...rest] = input.split(/\s+/);
    const arg = rest.join(" ");

    switch (cmd.toLowerCase()) {
        case "help":
            appendTerminal(
                [
                    "commands:",
                    "  help                 show this list",
                    "  ls | projects        list / open Projects folder",
                    "  open <name>          open a project window",
                    "  github               open GitHub profile",
                    "  whoami | neofetch    identity",
                    "  date                 local time",
                    "  echo <text>          print text",
                    "  clear                clear the screen"
                ].join("\n")
            );
            break;
        case "ls":
            if (projectsLoadState !== "ready") {
                appendTerminal("projects still loading — try `projects`", "term-line--err");
                loadPublishedProjects();
                break;
            }
            appendTerminal(
                [...apps.values()]
                    .map((a) => `${a.id.padEnd(28)} ${a.title}`)
                    .join("\n") || "(empty)"
            );
            break;
        case "projects":
            openProjectsFolder();
            appendTerminal("opened Projects/", "term-line--ok");
            break;
        case "open": {
            if (!arg) {
                appendTerminal("usage: open <repo-name>", "term-line--err");
                break;
            }
            if (projectsLoadState !== "ready") {
                appendTerminal("projects still loading…", "term-line--err");
                loadPublishedProjects();
                break;
            }
            const app = resolveProjectAlias(arg);
            if (!app) {
                appendTerminal(`open: no such project '${arg}'`, "term-line--err");
                break;
            }
            openProject(app.id);
            appendTerminal(`opened ${app.id}`, "term-line--ok");
            break;
        }
        case "github":
            window.open(GITHUB, "_blank", "noopener,noreferrer");
            appendTerminal(`opening github.com/${GITHUB_USER} …`, "term-line--ok");
            break;
        case "whoami":
            appendTerminal("guest");
            break;
        case "neofetch":
            printNeofetch();
            break;
        case "date":
            appendTerminal(new Date().toString());
            break;
        case "echo":
            appendTerminal(arg);
            break;
        case "clear": {
            const out = document.getElementById("terminalOutput");
            if (out) {
                out.innerHTML = "";
            }
            break;
        }
        default:
            appendTerminal(`asifsh: command not found: ${cmd}`, "term-line--err");
            appendTerminal("type 'help' for commands");
    }
}

function printNeofetch() {
    // Compact Odyssean galley (wallpaper ship, small factor)
    const boat = [
        "                        .",
        "           ______      /|",
        "        __/::::::\\___ //|",
        "       |:::####:::\\\\///|",
        "       |___||||___\\\\// ",
        "  .--~~ \\__||||__/ ~~-.",
        " /______\\__||||__/____\\",
        " \\______/@@@>\\________/",
        "   /|/|/|/|/|/|/|/|/",
        "  V V V V V V V V V"
    ];
    const info = [
        "guest@asif",
        "----------",
        "OS:     Browser Linux (fake)",
        "Shell:  asifsh 0.1",
        "WM:     odysseywm",
        "Theme:  wine-dark sea",
        `Host:   github.com/${GITHUB_USER}`,
        "Ship:   Odyssean galley",
        "Sea:    Sirens · Scylla · whirlpool",
        "Tune:   η(x,t) wave panel"
    ];
    const width = Math.max(...boat.map((l) => l.length));
    const rows = Math.max(boat.length, info.length);
    const lines = [];
    for (let i = 0; i < rows; i++) {
        const left = (boat[i] || "").padEnd(width);
        const right = info[i] || "";
        lines.push(`${left}   ${right}`);
    }
    appendTerminal(lines.join("\n"), "term-line--ok");
}

function bindTerminalInput(win) {
    const form = win.querySelector("#terminalForm");
    const input = win.querySelector("#terminalInput");
    if (!form || form.dataset.bound === "1") {
        return;
    }
    form.dataset.bound = "1";

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const value = input.value;
        input.value = "";
        runCommand(value);
    });

    input.addEventListener("keydown", (e) => {
        if (e.key === "ArrowUp") {
            e.preventDefault();
            if (history.length === 0) {
                return;
            }
            historyIndex = Math.min(historyIndex + 1, history.length - 1);
            input.value = history[historyIndex];
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            if (historyIndex <= 0) {
                historyIndex = -1;
                input.value = "";
                return;
            }
            historyIndex -= 1;
            input.value = history[historyIndex];
        }
    });
}

function openTerminal() {
    const id = "terminal";
    if (openWindows.has(id)) {
        focusWindow(openWindows.get(id));
        return openWindows.get(id);
    }

    const node = tplTerminal.content.firstElementChild.cloneNode(true);
    node.dataset.title = "Terminal";
    placeWindow(node, openWindows.size);
    wireWindowChrome(node, id);
    windowsRoot.appendChild(node);
    openWindows.set(id, node);
    bindTerminalInput(node);
    printNeofetch();
    appendTerminal("Type 'help' for commands.");
    focusWindow(node);
    return node;
}

function launch(appId) {
    if (appId === "terminal") {
        return openTerminal();
    }
    if (appId === "about") {
        return openAbout();
    }
    if (appId === "projects") {
        return openProjectsFolder();
    }
    if (apps.has(appId)) {
        return openProject(appId);
    }
    return null;
}

function bindLaunchers() {
    document.querySelectorAll("[data-app]").forEach((el) => {
        if (el.tagName === "A") {
            return;
        }
        el.addEventListener("click", () => launch(el.dataset.app));
    });
}

createOceanWallpaper(
    document.getElementById("wallpaper"),
    document.getElementById("wavePanel")
);
bindLaunchers();
updateClock();
setInterval(updateClock, 15_000);
loadPublishedProjects();
openTerminal();
