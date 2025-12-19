const can = document.getElementById("game");
const ctx = can.getContext("2d");

let x_chat = 50;
let y_chat = 400;
const v = 50;
const gravity = 2;

const tuyeau = {
    x: 800,
    width: 80,
    gap: 180,
    top: 100,
    speed: 3
};

let animationId;
const p_score = document.createElement("p");
p_score.textContent = "Score 0";
document.body.appendChild(p_score);

can.addEventListener("click", () => {
    y_chat -= v;
});

function drawTuyeau() {
    ctx.fillStyle = "green";
    ctx.fillRect(tuyeau.x, 0, tuyeau.width, tuyeau.top);
    ctx.fillRect(tuyeau.x, tuyeau.top + tuyeau.gap, tuyeau.width, can.height - (tuyeau.top + tuyeau.gap));
}

function draw() {
    ctx.fillStyle = "grey";
    ctx.fillRect(x_chat, y_chat, 50, 25);
}

function collision() {
    // Tuyau du haut
    if (x_chat + 50 > tuyeau.x &&
        x_chat < tuyeau.x + tuyeau.width &&
        y_chat < tuyeau.top
    ) return true;

    // Tuyau du bas
    if (x_chat + 50 > tuyeau.x &&
        x_chat < tuyeau.x + tuyeau.width &&
        y_chat + 25 > tuyeau.top + tuyeau.gap
    ) return true;
   
    return false;
}

let score = 0;


function boucleJeu() {
   
    // Mise à jour positions
    y_chat += gravity;
    if (y_chat + 25 > can.height) y_chat = can.height - 25;
    if (y_chat < 0) y_chat = 0;

    tuyeau.x -= tuyeau.speed;
    if (tuyeau.x + tuyeau.width < 0) {
        tuyeau.x = can.width;
        tuyeau.top = Math.random() * (can.height - tuyeau.gap - 50) + 25;
        score++;
        p_score.textContent = "Score : " + score;
    }

    // Dessin
    ctx.clearRect(0, 0, can.width, can.height);
    drawTuyeau();
    draw();

    // Collision
    if (collision()) {
        const gameOver = document.createElement("p");
        gameOver.textContent = "Game Over... Il a perdu !!!";
        document.body.appendChild(gameOver);
        return; // stoppe la boucle
    }
   
 


    // Prochaine frame
    animationId = requestAnimationFrame(boucleJeu);
}

boucleJeu();
