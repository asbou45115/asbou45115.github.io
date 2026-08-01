import { createOceanWallpaper } from "./ocean.js";

const GITHUB = "https://github.com/asbou45115";

const apps = {
    black_hole: {
        id: "black_hole",
        title: "Black Hole",
        kicker: "WebGL · GLSL",
        desc: "Interactive Schwarzschild black hole with gravitational lensing, a relativistically beamed accretion disk, and a procedural starfield.",
        live: "https://asbou45115.github.io/black_hole/",
        repo: "https://github.com/asbou45115/black_hole",
        aliases: ["black_hole", "blackhole", "bh"]
    },
    particles: {
        id: "particles",
        title: "Particles",
        kicker: "Simulation",
        desc: "Particle dispersion in the browser — motion, density, and patterns from simple rules.",
        live: "https://asbou45115.github.io/particle-dispersion-simulation/",
        repo: "https://github.com/asbou45115/particle-dispersion-simulation",
        aliases: ["particles", "particle", "dispersion"]
    },
    plinko: {
        id: "plinko",
        title: "Plinko",
        kicker: "Interactive",
        desc: "Drop chips through pegs and watch probability stack into multipliers.",
        live: "https://asbou45115.github.io/plinko-game/",
        repo: "https://github.com/asbou45115/plinko-game",
        aliases: ["plinko"]
    },
    ascii: {
        id: "ascii",
        title: "ASCII Renderer",
        kicker: "Python · Pages",
        desc: "Turn images into dense ASCII compositions — save as text or an image.",
        live: "https://asbou45115.github.io/ascii_renderer/",
        repo: "https://github.com/asbou45115/ascii_renderer",
        aliases: ["ascii", "ascii_renderer"]
    }
};

const windowsRoot = document.getElementById("windows");
const dockTasks = document.getElementById("dockTasks");
const dockClock = document.getElementById("dockClock");
const tplFolder = document.getElementById("tpl-folder");
const tplProject = document.getElementById("tpl-project");
const tplTerminal = document.getElementById("tpl-terminal");
const tplAbout = document.getElementById("tpl-about");

let zCounter = 10;
const openWindows = new Map();

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
    const app = apps[appKey];
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
        return openWindows.get(id);
    }

    const node = tplFolder.content.firstElementChild.cloneNode(true);
    node.dataset.title = "Projects";
    const list = node.querySelector(".folder-list");

    Object.values(apps).forEach((app) => {
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
    });

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

let terminalReady = false;
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
    return Object.values(apps).find((app) => app.aliases.includes(key) || app.id === key);
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
            appendTerminal(
                Object.values(apps)
                    .map((a) => `${a.id.padEnd(14)} ${a.title}`)
                    .join("\n")
            );
            break;
        case "projects":
            openProjectsFolder();
            appendTerminal("opened Projects/", "term-line--ok");
            break;
        case "open": {
            if (!arg) {
                appendTerminal("usage: open <black_hole|particles|plinko|ascii>", "term-line--err");
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
            appendTerminal("opening github.com/asbou45115 …", "term-line--ok");
            break;
        case "whoami":
            appendTerminal("guest");
            break;
        case "neofetch":
            appendTerminal(
                [
                    "asif@desktop",
                    "------------",
                    "OS:     Browser Linux (fake)",
                    "Shell:  asifsh 0.1",
                    "WM:     odysseywm",
                    "Theme:  wine-dark sea",
                    "Host:   github.com/asbou45115",
                    "Ship:   πολύτροπος bound for Ίθάκη"
                ].join("\n")
            );
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

function initTerminal(win) {
    if (terminalReady) {
        return;
    }
    terminalReady = true;

    appendTerminal("Welcome aboard asif@desktop. Type 'help' to begin.");
    appendTerminal("Wallpaper: Odyssey galley — mouse stirs η(x,t).");

    const form = win.querySelector("#terminalForm");
    const input = win.querySelector("#terminalInput");

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
    initTerminal(node);
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
    if (apps[appId]) {
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
    document.getElementById("waveEquation")
);
bindLaunchers();
updateClock();
setInterval(updateClock, 15_000);
