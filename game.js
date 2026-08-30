const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let player = {
    x: 800,
    y: 600,
    size: 25,
    speed: 5
};

let treasures = [
    { x: 300, y: 300, found: false },
    { x: 1300, y: 400, found: false },
    { x: 700, y: 1000, found: false },
    { x: 1500, y: 1100, found: false },
    { x: 400, y: 1300, found: false }
];

let keys = {};

let camera = {
    x: 0,
    y: 0
};

let treasureCount = 0;


// -------------------------
// CANVAS
// -------------------------

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();


// -------------------------
// KEYBOARD
// -------------------------

window.addEventListener("keydown", function(event) {
    keys[event.key.toLowerCase()] = true;
});

window.addEventListener("keyup", function(event) {
    keys[event.key.toLowerCase()] = false;
});


// -------------------------
// TOUCH CONTROLS
// -------------------------

function holdButton(id, key) {

    const button = document.getElementById(id);

    button.addEventListener("pointerdown", function(event) {
        event.preventDefault();
        keys[key] = true;
    });

    button.addEventListener("pointerup", function(event) {
        event.preventDefault();
        keys[key] = false;
    });

    button.addEventListener("pointercancel", function() {
        keys[key] = false;
    });

    button.addEventListener("pointerleave", function() {
        keys[key] = false;
    });
}

holdButton("up", "w");
holdButton("down", "s");
holdButton("left", "a");
holdButton("right", "d");


// -------------------------
// PLAYER MOVEMENT
// -------------------------

function updatePlayer() {

    let dx = 0;
    let dy = 0;

    if (keys["w"] || keys["arrowup"]) {
        dy -= 1;
    }

    if (keys["s"] || keys["arrowdown"]) {
        dy += 1;
    }

    if (keys["a"] || keys["arrowleft"]) {
        dx -= 1;
    }

    if (keys["d"] || keys["arrowright"]) {
        dx += 1;
    }

    // Prevent diagonal movement from being faster
    if (dx !== 0 || dy !== 0) {

        const length = Math.sqrt(
            dx * dx + dy * dy
        );

        dx /= length;
        dy /= length;

        player.x += dx * player.speed;
        player.y += dy * player.speed;
    }

    // Island boundaries
    player.x = Math.max(
        50,
        Math.min(1550, player.x)
    );

    player.y = Math.max(
        50,
        Math.min(1450, player.y)
    );
}


// -------------------------
// TREASURE CHECK
// -------------------------

function checkTreasures() {

    for (const treasure of treasures) {

        if (treasure.found) {
            continue;
        }

        const dx =
            player.x - treasure.x;

        const dy =
            player.y - treasure.y;

        const distance =
            Math.sqrt(dx * dx + dy * dy);

        if (distance < 60) {

            treasure.found = true;

            treasureCount++;

            document.getElementById(
                "treasure"
            ).textContent =
                "💎 Treasures: " +
                treasureCount;

            document.getElementById(
                "message"
            ).textContent =
                "🎉 You found a treasure!";
        }
    }

    if (treasureCount === treasures.length) {

        document.getElementById(
            "message"
        ).textContent =
            "🏆 Amazing! You found every treasure!";
    }
}


// -------------------------
// CAMERA
// -------------------------

function updateCamera() {

    camera.x =
        player.x -
        canvas.width / 2;

    camera.y =
        player.y -
        canvas.height / 2;
}


// -------------------------
// DRAW ISLAND
// -------------------------

function drawIsland() {

    // Ocean
    ctx.fillStyle = "#4aa9d8";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // Island
    ctx.fillStyle = "#79c267";

    ctx.beginPath();

    ctx.roundRect(
        -camera.x + 30,
        -camera.y + 30,
        1540,
        1440,
        100
    );

    ctx.fill();


    // Sand border
    ctx.strokeStyle = "#e7d28c";
    ctx.lineWidth = 35;

    ctx.stroke();
}


// -------------------------
// DRAW TREES
// -------------------------

function drawTrees() {

    const trees = [
        { x: 150, y: 180 },
        { x: 500, y: 200 },
        { x: 1000, y: 180 },
        { x: 1400, y: 250 },
        { x: 200, y: 800 },
        { x: 1200, y: 700 },
        { x: 1450, y: 1000 },
        { x: 500, y: 1250 },
        { x: 1100, y: 1300 }
    ];

    for (const tree of trees) {

        const x =
            tree.x - camera.x;

        const y =
            tree.y - camera.y;

        // Trunk
        ctx.fillStyle = "#7b4f2c";

        ctx.fillRect(
            x - 8,
            y,
            16,
            40
        );

        // Leaves
        ctx.fillStyle = "#2f8f46";

        ctx.beginPath();

        ctx.arc(
            x,
            y - 10,
            32,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }
}


// -------------------------
// DRAW TREASURES
// -------------------------

function drawTreasures() {

    for (const treasure of treasures) {

        if (treasure.found) {
            continue;
        }

        const x =
            treasure.x - camera.x;

        const y =
            treasure.y - camera.y;

        ctx.font = "32px Arial";

        ctx.textAlign = "center";

        ctx.textBaseline = "middle";

        ctx.fillText(
            "💎",
            x,
            y
        );
    }
}


// -------------------------
// DRAW PLAYER
// -------------------------

function drawPlayer() {

    const x =
        player.x - camera.x;

    const y =
        player.y - camera.y;

    // Body
    ctx.fillStyle = "#ffcc66";

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        player.size,
        0,
        Math.PI * 2
    );

    ctx.fill();

    // Hat
    ctx.fillStyle = "#8b5a2b";

    ctx.beginPath();

    ctx.arc(
        x,
        y - 18,
        18,
        Math.PI,
        0
    );

    ctx.fill();

    // Face
    ctx.fillStyle = "#222";

    ctx.beginPath();

    ctx.arc(
        x - 8,
        y - 2,
        3,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.beginPath();

    ctx.arc(
        x + 8,
        y - 2,
        3,
        0,
        Math.PI * 2
    );

    ctx.fill();
}


// -------------------------
// DRAW
// -------------------------

function draw() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    drawIsland();

    drawTrees();

    drawTreasures();

    drawPlayer();
}


// -------------------------
// GAME LOOP
// -------------------------

function gameLoop() {

    updatePlayer();

    checkTreasures();

    updateCamera();

    draw();

    requestAnimationFrame(gameLoop);
}

gameLoop();
