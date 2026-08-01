/**
 * ASCII ocean wallpaper — animated water + detailed pirate galleon.
 * Mouse stirs the sea; the ship bobs and rolls on the waves.
 */

const WATER_SURFACE = "~≈∽-~._·~≈~-";
const WATER_MID = "≈~-≈~.≈~-≈";
const WATER_DEEP = ".:·. :·.";
const FOAM = "*^\"'`°";

// Detailed side-view pirate galleon (spaces = transparent)
const SHIP = [
    "                              |",
    "                             /|\\",
    "                            / | \\",
    "                           |  |  |",
    "                           | )|( |",
    "                      _____|__|__|_____",
    "               ______/    |  |  |     \\______",
    "         _____/     /|    |  |  |     |\\     \\_____",
    "   _____/          / |   /|  |  |\\    | \\          \\_____",
    "  |  __           |  |  | |  |  | |   |  |           __  |",
    "  | |  |___       |  |  | |  |  | |   |  |       ___|  | |",
    "  | |  |   |__    |  |_/  |  |  |  \\__|  |    __|   |  | |",
    "  | |__|   |  |___|_/     |  |  |     \\__|___|  |   |__| |",
    "  |  ||    |  |   |   .--.|  |  |.--.   |   |  |    ||  |",
    "  |  ||  .-|  |   |  /  []|--|--|[]  \\  |   |  |-.  ||  |",
    "  |__||_/  |__|___|_/   [|  |  | |]   \\_|___|__|  \\_||__|",
    " /   \\/    |  ____   \\   |  |  |   /   ____  |    \\/   \\",
    "/  o  \\____|_/    \\___\\__|__|__|__/___/    \\_|____/  o  \\",
    "|______/   \\____________________/   \\______/   \\________|",
    " \\____/  ~~  \\__________________/  ~~  \\____/  ~~  \\____/",
    "    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
];

function hash(n) {
    const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
}

function waveHeight(col, time, pointer) {
    const mousePull = (pointer.x - 0.5) * 3.2;
    const chop = 0.85 + pointer.y * 1.4;

    return (
        Math.sin(col * 0.14 + time * 2.4 + mousePull * 2.0) * 1.0 +
        Math.sin(col * 0.33 - time * 3.1 + pointer.x * 5.0) * 0.55 +
        Math.sin(col * 0.07 + time * 1.2) * 0.7 +
        Math.sin(time * 0.9 + pointer.x * 3.0) * 0.45
    ) * chop;
}

function shipColor(ch, row, shipH) {
    if (ch === "~") {
        return "#9ad4ec";
    }
    if (ch === "o" || ch === "O") {
        return "#5eb0ff";
    }
    if (ch === "[" || ch === "]") {
        return "#ffd27a";
    }
    if (ch === ")" || ch === "(") {
        return "#c4a574";
    }
    if ("/\\|".includes(ch)) {
        return row < shipH * 0.45 ? "#f3e0b0" : "#d2b48c";
    }
    if (ch === "_" || ch === "-" || ch === "=") {
        return "#c9a66b";
    }
    if (ch === "." || ch === "'") {
        return "#efe6d5";
    }
    if (row >= shipH - 2) {
        return "#b8895a";
    }
    return "#e8e2d6";
}

export function createOceanWallpaper(canvas) {
    // Always animate — this wallpaper is the spectacle.
    // (Reduced-motion users get a slower chop, not a freeze.)
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

    // Trim trailing spaces for width calc but keep art aligned
    const shipW = Math.max(...SHIP.map((r) => r.length));
    const shipH = SHIP.length;

    // Reused buffers
    let chars;
    let colors;

    function measure() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const dpr = Math.min(window.devicePixelRatio || 1, 1.75);

        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        // Slightly larger cells = fewer glyphs = smoother animation
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
            shipCol = cols * 0.35;
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

    function clearBuffers() {
        chars.fill(null);
        colors.fill(null);
    }

    function drawFrame(now) {
        if (!running) {
            return;
        }

        const speed = preferLess ? 0.55 : 1;
        const time = ((now - start) * 0.001) * speed;
        const w = window.innerWidth;
        const h = window.innerHeight;
        const horizon = Math.floor(rows * 0.38);
        // Big enough amplitude that bobbing is obvious (several rows)
        const amp = Math.max(4, Math.floor(rows * 0.09));
        const scroll = time * 14;

        const bg = ctx.createLinearGradient(0, 0, 0, h);
        bg.addColorStop(0, "#050d16");
        bg.addColorStop(0.36, "#0a1a2a");
        bg.addColorStop(1, "#02060c");
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, w, h);

        ctx.font = `${fontSize}px "IBM Plex Mono", ui-monospace, monospace`;
        ctx.textBaseline = "top";

        clearBuffers();

        for (let c = 0; c < cols; c++) {
            surfaces[c] = horizon + waveHeight(c, time, pointer) * amp * 0.55;
        }

        // Ship tracks mouse horizontally; rides sampled surface
        const targetCol = cols * (0.12 + pointer.x * 0.62);
        shipCol += (targetCol - shipCol) * 0.08;

        const clampC = (c) => Math.max(0, Math.min(cols - 1, c | 0));
        const sample = (c) => surfaces[clampC(c)];
        const yL = sample(shipCol + shipW * 0.2);
        const yR = sample(shipCol + shipW * 0.8);
        const yM = sample(shipCol + shipW * 0.5);
        const surfaceY = yL * 0.25 + yM * 0.5 + yR * 0.25;

        // Snappier bob so wave motion reads clearly
        shipBob += (surfaceY - shipBob) * 0.28;
        shipRoll += ((yR - yL) * 0.65 - shipRoll) * 0.22;

        const shipRowBase = Math.round(shipBob) - shipH + 4;
        const shipColRound = Math.round(shipCol);
        const roll = Math.round(shipRoll);

        // Sky stars (static-ish)
        for (let r = 0; r < horizon - 2; r++) {
            for (let c = 0; c < cols; c++) {
                const star = hash(c * 17 + r * 91);
                if (star > 0.994) {
                    write(c, r, star > 0.998 ? "+" : ".", "rgba(190, 215, 245, 0.5)");
                }
            }
        }

        // Water — every frame scrolls characters with time
        const waterTop = Math.max(0, horizon - amp - 2);
        for (let r = waterTop; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const surface = surfaces[c];
                const depth = r - surface;
                if (depth < -1.5) {
                    continue;
                }

                const wh = waveHeight(c, time, pointer);
                const dx = c - (shipColRound + shipW * 0.55);
                const wake = Math.exp(-(dx * dx) * 0.012) * Math.exp(Math.max(depth, 0) * -0.35);

                if (depth < 0) {
                    // Spray / mist above crest
                    if (wh > 0.9 && hash(c + time * 8) > 0.6) {
                        write(c, r, "·", "rgba(160, 205, 230, 0.35)");
                    }
                    continue;
                }

                if (wake > 0.28 && depth < 4) {
                    write(c, r, wake > 0.55 ? FOAM[(c + (scroll | 0)) % FOAM.length] : "~", "rgba(200, 235, 255, 0.85)");
                } else if (depth < 1.1) {
                    const foam = wh > 0.85;
                    const idx = Math.floor(c + scroll + wh * 4);
                    if (foam) {
                        write(c, r, FOAM[((idx % FOAM.length) + FOAM.length) % FOAM.length], "rgba(230, 245, 255, 0.95)");
                    } else {
                        write(c, r, WATER_SURFACE[((idx % WATER_SURFACE.length) + WATER_SURFACE.length) % WATER_SURFACE.length], "rgba(140, 210, 235, 0.9)");
                    }
                } else if (depth < 3.5) {
                    const idx = Math.floor(c * 0.9 + scroll * 0.85 + r);
                    write(c, r, WATER_MID[((idx % WATER_MID.length) + WATER_MID.length) % WATER_MID.length], "rgba(70, 155, 185, 0.78)");
                } else if (depth < 9) {
                    const idx = Math.floor(c + scroll * 0.45 + r * 0.5);
                    write(c, r, WATER_MID[((idx % WATER_MID.length) + WATER_MID.length) % WATER_MID.length], `rgba(30, 100, 135, ${0.45 + Math.min(depth / 20, 0.3)})`);
                } else {
                    const idx = Math.floor(c * 0.5 + scroll * 0.25 + r);
                    if ((c + r) % 3 === 0) {
                        write(c, r, WATER_DEEP[((idx % WATER_DEEP.length) + WATER_DEEP.length) % WATER_DEEP.length], "rgba(15, 60, 90, 0.45)");
                    }
                }
            }
        }

        // Ship (skip waterline ~ so real water shows through)
        for (let r = 0; r < shipH; r++) {
            const line = SHIP[r];
            const isWakeRow = r === shipH - 1;
            const rowShift = isWakeRow ? 0 : Math.round((r / Math.max(shipH - 1, 1)) * roll);
            for (let c = 0; c < line.length; c++) {
                const ch = line[c];
                if (ch === " ") {
                    continue;
                }
                if (isWakeRow) {
                    // Animated waterline under hull
                    const wc = WATER_SURFACE[Math.floor(c + scroll + time * 3) % WATER_SURFACE.length];
                    write(shipColRound + c, shipRowBase + r, wc, "#9ad4ec");
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

        // Blit glyphs
        const total = cols * rows;
        for (let i = 0; i < total; i++) {
            const ch = chars[i];
            if (!ch) {
                continue;
            }
            ctx.fillStyle = colors[i];
            ctx.fillText(ch, (i % cols) * cellW, ((i / cols) | 0) * cellH);
        }

        const vig = ctx.createRadialGradient(w * 0.5, h * 0.4, h * 0.12, w * 0.5, h * 0.5, h * 0.92);
        vig.addColorStop(0, "rgba(0,0,0,0)");
        vig.addColorStop(1, "rgba(0,0,0,0.42)");
        ctx.fillStyle = vig;
        ctx.fillRect(0, 0, w, h);

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

    function onResize() {
        measure();
    }

    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    measure();
    shipBob = Math.floor(rows * 0.38);
    raf = requestAnimationFrame(drawFrame);

    return {
        destroy() {
            running = false;
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", onResize);
            window.removeEventListener("pointermove", onPointer);
            document.removeEventListener("visibilitychange", onVisibility);
        }
    };
}
