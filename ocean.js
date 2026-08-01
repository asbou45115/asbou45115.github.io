/**
 * Odyssey ASCII wallpaper — Odysseus' galley on a live multi-sine sea.
 * Mouse stirs the waves; the ship rides η(x,t). Wave params are editable.
 */

const WATER_SURFACE = "~≈∽-~._·~≈~-";
const WATER_MID = "≈~-≈~.≈~-≈";
const WATER_DEEP = ".:·. :·.";
const FOAM = "*^\"'`°";

const SHIP = [
    "                                                              .",
    "                                                             /|",
    "                                                            //|",
    "                                                           ///|",
    "                              ________________            ////|",
    "                          ___/:::::::::::::::::\\___      /////|",
    "                       __/::::::###########:::::::\\__   //////|",
    "                     _/:::::::###############:::::::\\_ ///////|",
    "                    /::::::::#################::::::::\\///////|",
    "                   |:::::::::######|||######:::::::::////////",
    "                   |:::::::::######|||######:::::::::/  i  /",
    "         /         |__________|____|||____|__________|  / /",
    "        //    .--~~ \\_________/    |||    \\_________/ ~~--./",
    "       ///___/       \\_______ .  i ||| i  . _______/      \\",
    "   ___////__/_________\\______|_____|||_____|______/____/@@@>-",
    "  /__////__/  ~  ~  ~  \\_____|_____|||_____|_____/ ~~  \\@@@@>",
    "  \\_______/ /| /| /| /| /| /| /| /|/|\\|/| /| /| /| /| / \\__/",
    "           / |/ |/ |/ |/ |/ |/ |/ |/ |/ |/ |/ |/ |/ |/",
    "          /  /  /  /  /  /  /  /  /  /  /  /  /  /  /",
    "         V  V  V  V  V  V  V  V  V  V  V  V  V  V  V"
];

const ROCK_LEFT = [
    "      /\\",
    "     /**\\",
    "    /**#*\\",
    "   /#*##**\\",
    "  /**###**|\\",
    " /#*####**/ |",
    "|##*###**/  |",
    "|#######/   |",
    "|######/  _/|",
    " \\####/__/ /",
    "  \\##_/   /",
    "   \\/~~~~'"
];

const ROCK_RIGHT = [
    "           /\\",
    "          /**\\",
    "         /#**#\\",
    "    /\\  /**##*\\",
    "   /**\\/#*###*\\",
    "  /#**|*####**/",
    " |##**|#####*/",
    " |###*|####/",
    " |####|###/",
    "  \\###|_/",
    "   \\#~/"
];

/*
 * Scylla / hydra (Unicode braille) — animated on the right near the whirlpool.
 * Braille blanks (U+2800) are transparent via stamp().
 */
const SCYLLA = [
    "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⠀⠀⠀⠀⢠",
    "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣦⡀⠀⢸⣆",
    "⠀⠀⠀⠀⣠⣦⣤⣀⣀⣤⣤⣀⡀⠀⣀⣠⡆⠀⠀⠀⠀⠀⠀⠤⠒⠛⣛⣛⣻⣿⣶⣾⣿⣦⣄⢿⣆",
    "⠀⠀⠀⠸⠿⢿⣿⣿⣿⣯⣭⣿⣿⣿⣿⣋⣀⠀⠀⠀⠀⠀⠀⣠⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣤⡀",
    "⠀⠀⠀⠀⠀⠀⠀⠙⢿⣿⣿⡿⢿⣿⣿⣿⣿⣿⣓⠢⠄⢠⡾⢻⣿⣿⣿⣿⡟⠁⠀⠀⠈⠙⢿⣿⣿⣯⡻⣿⡄",
    "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠀⠀⠀⠙⢿⣿⣿⣿⣷⣄⠁⠀⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣷⣄⡀",
    "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⣿⣿⣷⣌⢧⠀⣿⣿⣿⣿⣿⣿⣄⠀⠀⠀⠀⢀⠉⠙⠛⠛⠿⣿⣿⣿⡆",
    "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⡀⠠⢻⡟⢿⣿⣿⣿⣿⣧⣄⣀⠀⠘⢶⣄⣀⠀⠀⠈⢻⠿⠁",
    "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⣿⣿⣿⣿⣾⠀⠀⠀⠻⣈⣙⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣷⣦⡀",
    "⠀⠀⠀⠈⠲⣄⠀⠀⣀⡤⠤⠀⠀⠀⢠⣿⣿⣿⡿⣿⠇⠀⠀⠐⠺⢉⣡⣴⣿⣿⣿⣿⣿⣿⣿⡿⢿⣿⣿⣿⣶⣿⣿⣿⣶⣶⡀",
    "⠀⠀⠀⠀⢠⣿⣴⣿⣷⣶⣦⣤⡀⠀⢸⣿⣿⣿⠇⠏⠀⠀⠀⢀⣴⣿⣿⣿⣿⣿⠟⢿⣿⣿⣿⣷⠀⠹⣿⣿⠿⠿⠛⠻⠿⣿⠇",
    "⠀⠀⠀⣠⣿⣿⣿⣿⣿⣿⣿⣷⣯⡂⢸⣿⣿⣿⠀⠀⠀⠀⢀⠾⣻⣿⣿⣿⠟⠀⠀⠈⣿⣿⣿⣿⡇⠀⠀⣀⣀⡀⠀⢠⡞⠉",
    "⠀⠀⢸⣟⣽⣿⣯⠀⠀⢹⣿⣿⣿⡟⠼⣿⣿⣿⣇⠀⠀⠀⠠⢰⣿⣿⣿⣿⡄⠀⠀⠀⣸⣿⣿⣿⡇⠀⢀⣤⣼⣿⣷⣾⣷⡀",
    "⠀⢀⣾⣿⡿⠟⠋⠀⠀⢸⣿⣿⣿⣿⡀⢿⣿⣿⣿⣦⠀⠀⠀⢺⣿⣿⣿⣿⣿⣄⠀⠀⣿⣿⣿⣿⡇⠐⣿⣿⣿⣿⠿⣿⣿⡿⣦",
    "⠀⢻⣿⠏⠀⠀⠀⠀⢠⣿⣿⣿⡟⡿⠀⠀⢻⣿⣿⣿⣷⣤⡀⠘⣷⠻⣿⣿⣿⣿⣷⣼⣿⣿⣿⣿⣇⣾⣿⣿⣿⠁⠀⢼⣿⣿⣿⣆",
    "⠀⠀⠈⠀⠀⠀⠀⠀⢸⣿⣿⣿⡗⠁⠀⠀⠀⠙⢿⣿⣿⣿⣿⣷⣾⣆⡙⣿⣿⣿⣿⣿⣿⣿⣿⣿⠌⣾⣿⣿⣿⣆⠀⠀⠀⠉⠻⣿⡷",
    "⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣷⣄⠀⠀⠀⠀⠀⠈⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡏⠀⠘⣟⣿⣿⣿⡆⠀⠀⠀⠀⠙⠁",
    "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠻⣿⣿⣿⣿⣿⣶⣤⣤⣤⣀⣠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠀⠀⠀⢈⣿⣿⣿⡇",
    "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣟⣠⣤⣤⣶⣿⣿⣿⠟",
    "⠀⠀⠀⠀⠀⠀⢀⣠⣤⣄⠀⠠⢶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣟⡁",
    "⢀⣀⠀⣠⣀⡠⠞⣿⣿⣿⣿⣶⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣴⣿⣷⣦⣄⣀⢿⡽⢻⣦",
    "⠻⠶⠾⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠋"
];

const SCYLLA_W = Math.max(...SCYLLA.map((r) => r.length));
const SCYLLA_H = SCYLLA.length;

/* Larger whirlpool — two spin frames */
const WHIRLPOOL_A = [
    "      .~~-~~-~~.",
    "    ~(  @@ @@@  )~",
    "   ~( @@(@ @)@@ )~",
    "  ~( @(@(@(@)@)@ )~",
    "   ~( @@(@ @)@@ )~",
    "    ~(  @@@ @@  )~",
    "      '~~-~~-~~'"
];

const WHIRLPOOL_B = [
    "      .-~~-~~-~~.",
    "    ~(  @@@ @@  )~",
    "   ~( @@( @ @)@@ )~",
    "  ~( @(@@(@)@@)@ )~",
    "   ~( @@( @ @)@@ )~",
    "    ~(  @@ @@@  )~",
    "      '~~-~~-~~'"
];

/* Bottom-left siren rocks — larger static shore */
const SIREN_ROCKS = [
    "                /\\              /\\",
    "               /**\\          /#**\\",
    "              /#**#\\   /\\   /#*##*\\",
    "             /**###\\ /#**\\ /#*####*\\",
    "            /#*####\\/#*##\\/#*#####*#\\",
    "           |##*####||####||########**|",
    "           |#####*/  \\##/  \\#######**|",
    "          /#####/  ..      .. \\#####*\\",
    "         /#####/  .##.    .##. \\#####\\",
    "        /#####|  .####.  .####. |#####\\",
    "       /######| .##()()##()()##.|######\\",
    "      |#######\\_/##____####____##_/#####|",
    "      |#######|  o oo o  oo o o  |######|",
    "      |#######|                  |######|",
    "       \\######\\_________________/######/",
    "        \\#####~~~~~~~~~~~~~~~~~~~#####/",
    "         \\####~~~~~~~~~~~~~~~~~~~####/",
    "          \\_________________________/"
];

/*
 * Siren figure (Unicode braille) — single detailed figure on the rocks.
 * Braille blanks (U+2800) are treated as transparent.
 */
const SIREN = [
    "⠀⠀⠀⣠⣄⣀",
    "⢀⡖⠋⠁⠀⠉⠙⢦",
    "⣾⣠⣤⣤⠀⠀⠀⠈⡇",
    "⠙⠁⣼⠀⡇⠀⢀⣼⣁⣀⣀",
    "⣀⡤⠖⠁⠀⠀⣀⡾⠋⠁⠀⢈⡱⠦⢤⡀",
    "⢰⡏⣁⠀⠀⠀⠀⠀⢹⠿⣤⠄⠀⣀⣤⣦⡤⠹⡄",
    "⠀⠙⢻⡀⠀⠀⠑⠦⠞⣠⣿⠋⣿⡏⣹⡿⠓⠚⠁",
    "⠀⠀⠈⣇⠀⠈⠁⠒⢺⣧⣈⡷⣀⣴⣿⠇",
    "⠀⠀⠀⠈⠉⠉⠉⠉⡟⠀⡉⠀⠸⠿⡄⠀⠀⠀⢰⡿⢳⡀",
    "⠀⠀⠀⠀⠀⠀⠀⢸⠁⢰⣿⣶⣦⣤⣷⡀⠀⣠⣾⣿⡿⠟⠃",
    "⠀⠀⠀⠀⠀⠀⢀⠎⢠⠿⡙⠛⠛⢿⡏⡵⠋⡰⠃",
    "⠀⠀⠀⠀⠀⠀⡌⢀⡎⢠⢷⠀⠀⢺⠙⡦⠞",
    "⠀⠀⠀⠀⠀⢰⣃⠞⠀⢸⣘⠧⣀⣀⣷⠳⢄⡀",
    "⠀⠀⠀⢀⣴⣿⠋⠀⠀⠀⢻⡉⠉⠙⠋⠀⠀⠙⢦⡀",
    "⠀⠀⠀⠛⠉⠀⠀⠀⠀⠀⠀⠻⣄⡀⠀⠀⠀⠀⠀⢳⡄",
    "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠒⠢⢄⡀⠀⠀⣧",
    "⠀⠀⠀⠀⣀⣤⡤⠶⢦⡤⢄⡀⠀⠀⠀⠀⠀⢹⠀⠀⡞",
    "⠀⢀⡴⠾⠧⠯⠍⣑⠢⠌⣑⠪⠳⣦⣀⣀⣠⠞⢀⡾⠁",
    "⠰⠛⠋⠉⠉⠒⠲⠄⣉⣒⣢⣬⣿⣿⢿⡿⠖⠊⠁",
    "⠀⠀⠀⠀⠀⠀⠀⠀⢀⣽⣿⠟⡺⠋⡝⠁",
    "⠀⠀⠀⠀⠀⠀⠀⣰⢟⡵⢁⠔⢁⡼⠁",
    "⠀⠀⠀⠀⠀⠀⣰⢃⠎⡠⢊⣠⠞⠁",
    "⠀⠀⠀⠀⠀⠀⣿⢃⣾⠴⠋",
    "⠀⠀⠀⠀⠀⠈⣷⣿⠏",
    "⠀⠀⠀⠀⠀⠀⢙⡟"
];

/* Mouth roughly here within SIREN (row, col offsets) for music notes */
const SIREN_MOUTH = { r: 6, c: 10 };

/* Polyphemus the cyclops */
const CYCLOPS = [
    "   .----.",
    "  / .||. \\",
    " |  (••)  |",
    "  \\  \\/  /",
    "   '----'"
];

const ITHACA = [
    "   _.--._",
    "  /######\\",
    " /###/\\###\\",
    "|####  ####|"
];

function hash(n) {
    const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
}

function shipColor(ch, row, shipH) {
    if (ch === "@" || ch === ">") {
        return "#d4b06a";
    }
    if (ch === "#") {
        return "#c5b56a";
    }
    if (ch === ":") {
        return "#8f9260";
    }
    if (ch === "i") {
        return "#1e1810";
    }
    if (ch === "V") {
        return "#6a8fa8";
    }
    if (ch === "/") {
        return row > shipH * 0.72 ? "#7aa0b8" : "#9a7048";
    }
    if (ch === "_" || ch === "-" || ch === "=") {
        return "#a65a32";
    }
    if (ch === "|" || ch === "\\" || ch === ".") {
        return row < shipH * 0.55 ? "#d8c48a" : "#8b4e2a";
    }
    if (ch === "~") {
        return "#8ec8e0";
    }
    if (ch === "(" || ch === ")" || ch === "'") {
        return "#b8895a";
    }
    return "#e6d2b0";
}

function rockColor(ch) {
    if (ch === "*" || ch === "#") {
        return "#3a3a42";
    }
    if (ch === "~" || ch === "'") {
        return "#9ec8dc";
    }
    if (ch === "/" || ch === "\\" || ch === "|" || ch === "_") {
        return "#2c2c34";
    }
    return "#454550";
}

function mythColor(ch) {
    if (ch === "@" || ch === "o" || ch === "•") {
        return "rgba(255, 120, 90, 0.85)";
    }
    if (ch === "♪" || ch === "~") {
        return "rgba(255, 210, 130, 0.7)";
    }
    if (ch === "#" || ch === "<" || ch === ">") {
        return "rgba(90, 70, 90, 0.75)";
    }
    return "rgba(210, 190, 170, 0.7)";
}

function stamp(write, art, originC, originR, colorFn) {
    for (let r = 0; r < art.length; r++) {
        const line = art[r];
        for (let c = 0; c < line.length; c++) {
            const ch = line[c];
            // Skip ASCII space and braille blank
            if (ch === " " || ch === "\u2800") {
                continue;
            }
            write(originC + c, originR + r, ch, colorFn(ch, r, art.length));
        }
    }
}

export function createOceanWallpaper(canvas, hud) {
    const preferLess = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = canvas.getContext("2d", { alpha: false });

    /** Mutable wave model — drive from the HUD sliders */
    const params = {
        terms: [
            { A: 1.00, k: 0.14, w: 2.40 },
            { A: 0.55, k: 0.33, w: 3.10 },
            { A: 0.70, k: 0.07, w: 1.20 },
            { A: 0.45, k: 0.00, w: 0.90 }
        ],
        ampScale: 0.55,
        mousePhi: 3.2,
        mouseChop: 1.4,
        timeScale: 1
    };

    let cols = 0;
    let rows = 0;
    let cellW = 8;
    let cellH = 14;
    let fontSize = 12;
    let raf = 0;
    let running = true;
    let start = performance.now();
    const pointer = { x: 0.5, y: 0.5 };

    let shipCol = 0;
    let shipBob = 0;
    let shipRoll = 0;
    let surfaces = new Float32Array(0);
    let chars;
    let colors;
    let eqTick = 0;

    const shipW = Math.max(...SHIP.map((r) => r.length));
    const shipH = SHIP.length;

    const eqReadout = hud?.querySelector?.("#waveEquation") || hud;
    const ampOut = hud?.querySelector?.("[data-out=amp]");
    const phiOut = hud?.querySelector?.("[data-out=phi]");
    const tOut = hud?.querySelector?.("[data-out=t]");

    function waveHeight(col, time) {
        const mousePull = (pointer.x - 0.5) * params.mousePhi;
        const chop = 0.85 + pointer.y * params.mouseChop;
        let h = 0;
        for (const term of params.terms) {
            const phase = term.k * col - term.w * time + mousePull * (0.4 + term.k * 2);
            h += term.A * Math.sin(phase);
        }
        h += 0.35 * Math.sin(col * 0.22 + time * 2.0 + pointer.x * 5);
        return h * chop;
    }

    function measure() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const dpr = Math.min(window.devicePixelRatio || 1, 1.75);

        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        fontSize = w < 700 ? 10 : w < 1200 ? 12 : 13;
        ctx.font = `${fontSize}px "IBM Plex Mono", ui-monospace, monospace`;
        cellW = Math.ceil(ctx.measureText("M").width);
        cellH = Math.ceil(fontSize * 1.1);
        cols = Math.ceil(w / cellW) + 1;
        rows = Math.ceil(h / cellH) + 1;
        surfaces = new Float32Array(cols);
        chars = new Array(cols * rows);
        colors = new Array(cols * rows);

        if (!shipCol) {
            shipCol = cols * 0.22;
        }
    }

    function write(c, r, ch, color) {
        if (c < 0 || r < 0 || c >= cols || r >= rows || ch === " ") {
            return;
        }
        const i = r * cols + c;
        chars[i] = ch;
        colors[i] = color;
    }

    function drawScallopWave(c, r, depth, scroll) {
        const phase = (c * 0.55 + scroll * 0.08 + surfaces[c] * 0.3) % (Math.PI * 2);
        const crest = Math.cos(phase);

        if (depth < 0.9) {
            if (crest > 0.35) {
                write(c, r, crest > 0.75 ? ")" : "(", "rgba(210, 235, 250, 0.92)");
            } else {
                const idx = Math.floor(c + scroll + depth);
                write(c, r, WATER_SURFACE[((idx % WATER_SURFACE.length) + WATER_SURFACE.length) % WATER_SURFACE.length], "rgba(120, 175, 200, 0.88)");
            }
            return;
        }
        if (depth < 2.2) {
            write(c, r, crest > 0 ? "=" : "-", "rgba(70, 120, 150, 0.72)");
            return;
        }
        if (depth < 5) {
            const idx = Math.floor(c * 0.9 + scroll * 0.7 + r);
            write(c, r, WATER_MID[((idx % WATER_MID.length) + WATER_MID.length) % WATER_MID.length], "rgba(40, 95, 130, 0.75)");
            return;
        }
        if (depth < 11) {
            const idx = Math.floor(c + scroll * 0.4);
            write(
                c,
                r,
                WATER_MID[((idx % WATER_MID.length) + WATER_MID.length) % WATER_MID.length],
                `rgba(18, 70, 105, ${0.45 + Math.min(depth / 22, 0.3)})`
            );
            return;
        }
        if ((c + r) % 3 === 0) {
            const idx = Math.floor(c * 0.5 + scroll * 0.2);
            write(c, r, WATER_DEEP[((idx % WATER_DEEP.length) + WATER_DEEP.length) % WATER_DEEP.length], "rgba(10, 45, 70, 0.42)");
        }
    }

    function bindControls() {
        if (!hud) {
            return;
        }
        hud.querySelectorAll("[data-wave]").forEach((input) => {
            const key = input.dataset.wave;
            const apply = () => {
                const v = Number(input.value);
                if (key === "ampScale" || key === "mousePhi" || key === "mouseChop" || key === "timeScale") {
                    params[key] = v;
                } else if (key.startsWith("A")) {
                    params.terms[Number(key.slice(1))].A = v;
                } else if (key.startsWith("k")) {
                    params.terms[Number(key.slice(1))].k = v;
                } else if (key.startsWith("w")) {
                    params.terms[Number(key.slice(1))].w = v;
                }
                const out = input.parentElement?.querySelector(".wave-val");
                if (out) {
                    out.textContent = v.toFixed(2);
                }
            };
            input.addEventListener("input", apply);
            apply();
        });
    }

    function drawFrame(now) {
        if (!running) {
            return;
        }

        const speed = (preferLess ? 0.55 : 1) * params.timeScale;
        const time = ((now - start) * 0.001) * speed;
        const w = window.innerWidth;
        const h = window.innerHeight;
        const horizon = Math.floor(rows * 0.48);
        const amp = Math.max(4, Math.floor(rows * 0.1));
        const scroll = time * 14;
        // Keep crests inside the canvas — never slice the top of a wave
        const surfaceMin = Math.floor(rows * 0.22);
        const surfaceMax = Math.floor(rows * 0.72);

        const bg = ctx.createLinearGradient(0, 0, 0, h);
        bg.addColorStop(0, "#1a1528");
        bg.addColorStop(0.28, "#2a2438");
        bg.addColorStop(0.45, "#1a3040");
        bg.addColorStop(1, "#061018");
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, w, h);

        const glow = ctx.createRadialGradient(w * 0.55, h * 0.18, 0, w * 0.55, h * 0.22, h * 0.35);
        glow.addColorStop(0, "rgba(200, 160, 90, 0.18)");
        glow.addColorStop(1, "rgba(200, 160, 90, 0)");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, w, h);

        ctx.font = `${fontSize}px "IBM Plex Mono", ui-monospace, monospace`;
        ctx.textBaseline = "top";

        chars.fill(null);
        colors.fill(null);

        let minSurface = surfaceMax;
        for (let c = 0; c < cols; c++) {
            const raw = horizon + waveHeight(c, time) * amp * params.ampScale;
            surfaces[c] = Math.min(surfaceMax, Math.max(surfaceMin, raw));
            if (surfaces[c] < minSurface) {
                minSurface = surfaces[c];
            }
        }

        const targetCol = cols * (0.08 + pointer.x * 0.5);
        shipCol += (targetCol - shipCol) * 0.08;

        const clampC = (c) => Math.max(0, Math.min(cols - 1, c | 0));
        const sample = (c) => surfaces[clampC(c)];
        const yL = sample(shipCol + shipW * 0.25);
        const yR = sample(shipCol + shipW * 0.8);
        const yM = sample(shipCol + shipW * 0.5);
        const surfaceY = yL * 0.25 + yM * 0.5 + yR * 0.25;

        shipBob += (surfaceY - shipBob) * 0.28;
        shipRoll += ((yR - yL) * 0.5 - shipRoll) * 0.22;

        const shipRowBase = Math.round(shipBob) - shipH + 6;
        const shipColRound = Math.round(shipCol);
        const roll = Math.round(shipRoll);

        // Clouds / stars above the water band
        const skyBottom = Math.floor(minSurface) - 2;
        for (let r = 0; r < skyBottom; r++) {
            for (let c = 0; c < cols; c++) {
                const n = hash(c * 0.15 + r * 3.1 + Math.floor(time * 0.05));
                if (n > 0.82 && r < rows * 0.3) {
                    write(c, r, n > 0.93 ? "~" : "-", `rgba(160, 150, 170, ${0.08 + n * 0.12})`);
                }
                if (hash(c * 17 + r * 91) > 0.996) {
                    write(c, r, ".", "rgba(220, 200, 150, 0.4)");
                }
            }
        }

        // Ithaca on the horizon
        stamp(write, ITHACA, Math.floor(cols * 0.78), Math.max(1, skyBottom - 5), () => "rgba(70, 95, 75, 0.55)");

        // Sea — start from the highest crest so nothing is clipped
        const waterTop = Math.max(0, Math.floor(minSurface) - 2);
        for (let r = waterTop; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const surface = surfaces[c];
                const depth = r - surface;
                if (depth < -1.4) {
                    continue;
                }
                if (depth < 0) {
                    if (waveHeight(c, time) > 0.95 && hash(c + time * 8) > 0.55) {
                        write(c, r, "·", "rgba(170, 210, 230, 0.3)");
                    }
                    continue;
                }

                const dx = c - (shipColRound + shipW * 0.55);
                const wake = Math.exp(-(dx * dx) * 0.01) * Math.exp(Math.max(depth, 0) * -0.32);
                if (wake > 0.3 && depth < 3.5) {
                    write(c, r, wake > 0.55 ? FOAM[(c + (scroll | 0)) % FOAM.length] : "~", "rgba(210, 235, 250, 0.85)");
                } else {
                    drawScallopWave(c, r, depth, scroll);
                }
            }
        }

        // Static bottom-left rocks + detailed braille siren
        const sirenRockC = 0;
        const sirenRockR = rows - SIREN_ROCKS.length - 1;
        stamp(write, SIREN_ROCKS, sirenRockC, sirenRockR, (ch) => {
            if (ch === "o" || ch === "(" || ch === ")") {
                return "rgba(220, 210, 190, 0.8)";
            }
            if (ch === "~") {
                return "rgba(140, 190, 210, 0.55)";
            }
            if (/[a-z]/.test(ch)) {
                return "rgba(50, 52, 58, 0.55)";
            }
            return rockColor(ch);
        });

        const sirenC = sirenRockC + 6;
        const sirenR = Math.max(0, sirenRockR - SIREN.length + 10);
        stamp(write, SIREN, sirenC, sirenR, (ch, r) => {
            if (r < 5) {
                return "rgba(255, 228, 200, 0.95)";
            }
            if (r < 12) {
                return "rgba(240, 200, 175, 0.92)";
            }
            if (r < 18) {
                return "rgba(210, 120, 130, 0.88)";
            }
            return "rgba(190, 160, 145, 0.9)";
        });

        // Music notes from her mouth toward the ship
        const mouthC = sirenC + SIREN_MOUTH.c;
        const mouthR = sirenR + SIREN_MOUTH.r;
        const noteChars = ["♪", "♫", "♩", "♬", "♪", "♫"];
        for (let n = 0; n < 16; n++) {
            const phase = time * (0.75 + (n % 4) * 0.12) + n * 1.55;
            const drift = (phase * 4.2) % 34;
            const bob = Math.sin(phase * 2.4) * 2.2;
            const nc = Math.round(mouthC + 2 + drift);
            const nr = Math.round(mouthR - 1 + bob - drift * 0.08);
            if (nc < cols * 0.62) {
                write(nc, nr, noteChars[n % noteChars.length], `rgba(255, 220, 140, ${0.55 + (n % 3) * 0.12})`);
            }
        }

        // Mid-left cliff + cyclops only (Scylla moved to the right)
        const leftRockR = Math.floor(rows * 0.28);
        stamp(write, ROCK_LEFT, 0, leftRockR, (ch) => rockColor(ch));
        for (let s = 0; s < 8; s++) {
            write(1 + (s % 4), leftRockR + 3 + (s % 5), FOAM[s % FOAM.length], "rgba(220, 240, 255, 0.55)");
        }
        stamp(write, CYCLOPS, 2, Math.max(0, leftRockR - 10), mythColor);

        // Right cliff
        const rightRockC = cols - ROCK_RIGHT[0].length - 2;
        const rightRockR = Math.floor(rows * 0.3);
        stamp(write, ROCK_RIGHT, rightRockC, rightRockR, (ch) => rockColor(ch));
        write(rightRockC - 2, rightRockR - 1, "v", "rgba(40, 40, 45, 0.7)");
        write(rightRockC + 3, rightRockR - 2, "v", "rgba(40, 40, 45, 0.55)");

        // Whirlpool — right side, below the wave surface
        const whirlC = Math.max(cols - 26, Math.floor(cols * 0.72));
        const surfaceAtWhirl = sample(whirlC + 8);
        const whirlR = Math.min(
            rows - WHIRLPOOL_A.length - 2,
            Math.round(surfaceAtWhirl) + 4
        );
        const whirlArt = Math.floor(time * 4) % 2 === 0 ? WHIRLPOOL_A : WHIRLPOOL_B;
        stamp(write, whirlArt, whirlC, whirlR, (ch) => {
            if (ch === "@") {
                return "rgba(15, 55, 85, 0.98)";
            }
            if (ch === "~" || ch === "-" || ch === "." || ch === "'" || ch === "(" || ch === ")") {
                return "rgba(190, 240, 255, 0.98)";
            }
            return "rgba(100, 190, 220, 0.95)";
        });
        for (let a = 0; a < 18; a++) {
            const ang = (a / 18) * Math.PI * 2 + time * 2.8;
            const rr = 4 + (a % 3);
            const fc = Math.round(whirlC + 10 + Math.cos(ang) * rr);
            const fr = Math.round(whirlR + 3 + Math.sin(ang) * (rr * 0.55));
            write(fc, fr, a % 2 ? "*" : "~", "rgba(230, 250, 255, 0.9)");
        }

        // Scylla / hydra — right side, above/beside the whirlpool, gently swaying
        const scyllaSway = Math.round(Math.sin(time * 1.4) * 2);
        const scyllaBob = Math.round(Math.sin(time * 1.9) * 1);
        const scyllaC = Math.max(
            0,
            Math.min(cols - SCYLLA_W - 1, whirlC - Math.floor(SCYLLA_W * 0.35) + scyllaSway)
        );
        const scyllaR = Math.max(
            0,
            Math.min(rows - SCYLLA_H - 1, whirlR - SCYLLA_H + 6 + scyllaBob)
        );
        stamp(write, SCYLLA, scyllaC, scyllaR, (ch, r) => {
            const pulse = 0.85 + 0.1 * Math.sin(time * 3 + r * 0.2);
            if (r < 6) {
                return `rgba(200, 90, 110, ${pulse})`;
            }
            if (r < 14) {
                return `rgba(160, 70, 95, ${pulse})`;
            }
            return `rgba(90, 55, 75, ${Math.min(pulse, 0.95)})`;
        });

        // Ship
        for (let r = 0; r < shipH; r++) {
            const line = SHIP[r];
            const rowShift = Math.round((r / Math.max(shipH - 1, 1)) * roll * 0.85);
            for (let c = 0; c < line.length; c++) {
                const ch = line[c];
                if (ch === " ") {
                    continue;
                }
                write(shipColRound + c + rowShift, shipRowBase + r, ch, shipColor(ch, r, shipH));
            }
        }

        const total = cols * rows;
        for (let i = 0; i < total; i++) {
            const ch = chars[i];
            if (!ch) {
                continue;
            }
            ctx.fillStyle = colors[i];
            ctx.fillText(ch, (i % cols) * cellW, ((i / cols) | 0) * cellH);
        }

        const vig = ctx.createRadialGradient(w * 0.5, h * 0.4, h * 0.12, w * 0.5, h * 0.5, h * 0.95);
        vig.addColorStop(0, "rgba(0,0,0,0)");
        vig.addColorStop(1, "rgba(0,0,0,0.45)");
        ctx.fillStyle = vig;
        ctx.fillRect(0, 0, w, h);

        if (eqTick++ % 6 === 0) {
            const chop = (0.85 + pointer.y * params.mouseChop).toFixed(2);
            const phi = ((pointer.x - 0.5) * params.mousePhi).toFixed(2);
            if (eqReadout && eqReadout.tagName === "PRE") {
                const A = params.terms.map((t) => t.A.toFixed(2)).join(", ");
                const k = params.terms.map((t) => t.k.toFixed(2)).join(", ");
                const om = params.terms.map((t) => t.w.toFixed(2)).join(", ");
                eqReadout.textContent = [
                    "η(x,t) = Σᵢ Aᵢ · χ · sin(kᵢ x − ωᵢ t + φ)",
                    `χ = ${chop}   φ = ${phi}   t = ${time.toFixed(1)}s`,
                    `A = [${A}]`,
                    `k = [${k}]`,
                    `ω = [${om}]`
                ].join("\n");
            }
            if (ampOut) {
                ampOut.textContent = chop;
            }
            if (phiOut) {
                phiOut.textContent = phi;
            }
            if (tOut) {
                tOut.textContent = `${time.toFixed(1)}s`;
            }
        }

        raf = requestAnimationFrame(drawFrame);
    }

    function onPointer(e) {
        pointer.x = e.clientX / Math.max(window.innerWidth, 1);
        pointer.y = e.clientY / Math.max(window.innerHeight, 1);
    }

    function onVisibility() {
        if (document.hidden) {
            running = false;
            cancelAnimationFrame(raf);
        } else {
            running = true;
            raf = requestAnimationFrame(drawFrame);
        }
    }

    window.addEventListener("resize", measure);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    measure();
    bindControls();
    shipBob = Math.floor(rows * 0.48);
    raf = requestAnimationFrame(drawFrame);

    return {
        params,
        destroy() {
            running = false;
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", measure);
            window.removeEventListener("pointermove", onPointer);
            document.removeEventListener("visibilitychange", onVisibility);
        }
    };
}
