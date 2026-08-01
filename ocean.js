/**
 * Odyssey ASCII wallpaper — Odysseus' galley on a live multi-sine sea.
 * Mouse stirs the waves; the ship rides η(x,t).
 */

const WATER_SURFACE = "~≈∽-~._·~≈~-";
const WATER_MID = "≈~-≈~.≈~-≈";
const WATER_DEEP = ".:·. :·.";
const FOAM = "*^\"'`°";

const WAVE_TERMS = [
    { A: 1.00, k: 0.14, w: 2.40 },
    { A: 0.55, k: 0.33, w: 3.10 },
    { A: 0.70, k: 0.07, w: 1.20 },
    { A: 0.45, k: 0.00, w: 0.90 }
];

/*
 * Odysseus' ship — after the stormy galley painting:
 * high aphlaston stern (left), olive sail, bronze boar prow (right), bank of oars.
 */
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

const SIRENS = [
    "  ~♪~",
    " (@@)",
    "~/||\\~"
];

const CYCLOPS = [
    " .--.",
    "( o  )",
    " '--'"
];

const MYTH_LABELS = [
    { text: "Μοῦσα, ἔννεπε", dx: 0.06, dy: 0.06 },
    { text: "πολύτροπος Ὀδυσσεύς", dx: 0.38, dy: 0.04 },
    { text: "Ίθάκη →", dx: 0.82, dy: 0.1 },
    { text: "ΟΥΤΙΣ", dx: 0.14, dy: 0.18 },
    { text: "Σκύλλα", dx: 0.02, dy: 0.34 },
    { text: "Χάρυβδις", dx: 0.88, dy: 0.36 },
    { text: "Σειρῆνες", dx: 0.7, dy: 0.16 },
    { text: "sing of the man of twists & turns", dx: 0.28, dy: 0.14 }
];

function hash(n) {
    const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
}

function waveHeight(col, time, pointer) {
    const mousePull = (pointer.x - 0.5) * 3.2;
    const chop = 0.85 + pointer.y * 1.4;
    let h = 0;
    for (const term of WAVE_TERMS) {
        const phase = term.k * col - term.w * time + mousePull * (0.4 + term.k * 2);
        h += term.A * Math.sin(phase);
    }
    h += 0.35 * Math.sin(col * 0.22 + time * 2.0 + pointer.x * 5);
    return h * chop;
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

function formatEquation(pointer, time) {
    const chop = (0.85 + pointer.y * 1.4).toFixed(2);
    const phi = ((pointer.x - 0.5) * 3.2).toFixed(2);
    const t = time.toFixed(1);
    return [
        "η(x,t) = Σᵢ Aᵢ · χ · sin(kᵢ x − ωᵢ t + φ)",
        `χ = ${chop}   φ = ${phi}   t = ${t}s`,
        "A = [1.00, 0.55, 0.70, 0.45]",
        "k = [0.14, 0.33, 0.07, 0]",
        "ω = [2.40, 3.10, 1.20, 0.90]"
    ];
}

function stamp(write, art, originC, originR, colorFn) {
    for (let r = 0; r < art.length; r++) {
        const line = art[r];
        for (let c = 0; c < line.length; c++) {
            const ch = line[c];
            if (ch === " ") {
                continue;
            }
            write(originC + c, originR + r, ch, colorFn(ch, r, art.length));
        }
    }
}

export function createOceanWallpaper(canvas, equationEl) {
    const preferLess = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = canvas.getContext("2d", { alpha: false });

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

    function drawFrame(now) {
        if (!running) {
            return;
        }

        const speed = preferLess ? 0.55 : 1;
        const time = ((now - start) * 0.001) * speed;
        const w = window.innerWidth;
        const h = window.innerHeight;
        const horizon = Math.floor(rows * 0.42);
        const amp = Math.max(4, Math.floor(rows * 0.09));
        const scroll = time * 14;

        // Stormy wine-dark sea sky
        const bg = ctx.createLinearGradient(0, 0, 0, h);
        bg.addColorStop(0, "#1a1528");
        bg.addColorStop(0.28, "#2a2438");
        bg.addColorStop(0.45, "#1a3040");
        bg.addColorStop(1, "#061018");
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, w, h);

        // Warm break in the clouds
        const glow = ctx.createRadialGradient(w * 0.55, h * 0.18, 0, w * 0.55, h * 0.22, h * 0.35);
        glow.addColorStop(0, "rgba(200, 160, 90, 0.18)");
        glow.addColorStop(1, "rgba(200, 160, 90, 0)");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, w, h);

        ctx.font = `${fontSize}px "IBM Plex Mono", ui-monospace, monospace`;
        ctx.textBaseline = "top";

        chars.fill(null);
        colors.fill(null);

        for (let c = 0; c < cols; c++) {
            surfaces[c] = horizon + waveHeight(c, time, pointer) * amp * 0.55;
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

        // Cloud texture hints
        for (let r = 0; r < horizon - 4; r++) {
            for (let c = 0; c < cols; c++) {
                const n = hash(c * 0.15 + r * 3.1 + Math.floor(time * 0.05));
                if (n > 0.82 && r < horizon * 0.55) {
                    write(c, r, n > 0.93 ? "~" : "-", `rgba(160, 150, 170, ${0.08 + n * 0.12})`);
                }
                const star = hash(c * 17 + r * 91);
                if (star > 0.996) {
                    write(c, r, ".", "rgba(220, 200, 150, 0.4)");
                }
            }
        }

        // Mythology labels in the sky / margins
        for (const g of MYTH_LABELS) {
            const baseC = Math.floor(cols * g.dx);
            const baseR = Math.floor(rows * g.dy);
            for (let i = 0; i < g.text.length; i++) {
                write(baseC + i, baseR, g.text[i], "rgba(220, 195, 140, 0.38)");
            }
        }

        // Ithaca on the far horizon
        const isleC = Math.floor(cols * 0.8);
        const isleR = horizon - 3;
        stamp(write, ["  _.--._", " /######\\", "/###/\\###\\"], isleC, isleR - 2, () => "rgba(70, 90, 70, 0.55)");

        // Sea first
        const waterTop = Math.max(0, horizon - amp - 2);
        for (let r = waterTop; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const surface = surfaces[c];
                const depth = r - surface;
                if (depth < -1.4) {
                    continue;
                }
                if (depth < 0) {
                    if (waveHeight(c, time, pointer) > 0.95 && hash(c + time * 8) > 0.55) {
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

        // Clashing rocks / Scylla (left) with spray
        const leftRockR = Math.round(sample(6)) - ROCK_LEFT.length + 3;
        stamp(write, ROCK_LEFT, 1, leftRockR, (ch) => rockColor(ch));
        for (let s = 0; s < 10; s++) {
            const sc = 2 + (s % 5);
            const sr = leftRockR + 2 + ((s * 3 + (time * 4 | 0)) % 6);
            write(sc, sr, FOAM[s % FOAM.length], "rgba(220, 240, 255, 0.75)");
        }

        // Far rocks / Charybdis side (right)
        const rightRockC = cols - ROCK_RIGHT[0].length - 2;
        const rightRockR = Math.round(sample(rightRockC + 4)) - ROCK_RIGHT.length + 2;
        stamp(write, ROCK_RIGHT, rightRockC, rightRockR, (ch) => rockColor(ch));

        // Birds near right cliffs
        write(rightRockC - 2, rightRockR - 1, "v", "rgba(40, 40, 45, 0.7)");
        write(rightRockC + 3, rightRockR - 2, "v", "rgba(40, 40, 45, 0.55)");
        write(rightRockC + 6, rightRockR - 1, "^", "rgba(40, 40, 45, 0.5)");

        // Sirens on a mid-right rock ledge
        stamp(write, SIRENS, Math.floor(cols * 0.68), Math.max(2, rightRockR - 1), (ch) => {
            if (ch === "@") {
                return "rgba(230, 200, 160, 0.7)";
            }
            if (ch === "♪") {
                return "rgba(255, 210, 120, 0.65)";
            }
            return "rgba(200, 180, 150, 0.55)";
        });

        // Cyclops peeking from left cliff
        stamp(write, CYCLOPS, 3, Math.max(1, leftRockR - 3), (ch) => {
            if (ch === "o") {
                return "rgba(255, 80, 60, 0.85)";
            }
            return "rgba(180, 160, 140, 0.5)";
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
                write(
                    shipColRound + c + rowShift,
                    shipRowBase + r,
                    ch,
                    shipColor(ch, r, shipH)
                );
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

        if (equationEl && (eqTick++ % 6 === 0)) {
            equationEl.textContent = formatEquation(pointer, time).join("\n");
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
    shipBob = Math.floor(rows * 0.42);
    raf = requestAnimationFrame(drawFrame);

    return {
        destroy() {
            running = false;
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", measure);
            window.removeEventListener("pointermove", onPointer);
            document.removeEventListener("visibilitychange", onVisibility);
        }
    };
}
