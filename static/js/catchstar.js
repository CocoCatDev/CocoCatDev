const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let countdown = 3;
let etat = "count"; // "count" | "play"
let lastCountdownTime = performance.now();

let jeuLance = false;
let jeuFacile = false;

let chat = {
    x : 100,
    y : 350,
    width : 40,
    height : 40
};

let ana = {
    x : Math.random() * 360,
    y : 0,
    width : 50,
    height : 50
};

let fake_ana = {
    x : Math.random() * 360,
    y : 0,
    width : 50,
    height : 50
};

let vies_faciles = 10;
let nv_facile = 1;
let vitesse_facile = 1.5;
let score_facile = 0;

let dureeTotale = 5 * 60;
let tempsRestant = dureeTotale;
let lastTime = performance.now();

let score = 0;
let vies = 5;
let vitesse = 2;

let gameOver = false;
let nv = 1;
let victoire = false;

let invincible = false;
let invincibleTime = 0;
const INVINCIBLE_DUREE = 5;

let lastNv = 1;
let lastVies = vies;

let dureeGo = 3;
let tempsQuiReste = dureeGo;
let dernierTemps = performance.now();

document.getElementById("gauche").addEventListener("click",() => { chat.x -= 40; });
document.getElementById("droite").addEventListener("click",() => { chat.x += 40; });

function drawChat() {
    if (invincible && Math.floor(performance.now() / 100) % 2 === 0) return;
    ctx.fillStyle = invincible ? "cyan" : "grey";
    ctx.fillRect(chat.x, chat.y, chat.width, chat.height);
}

function drawAna() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(ana.x,ana.y,ana.width,ana.height);
}

function drawFakeAna() {
    ctx.fillStyle = "red";
    ctx.fillRect(fake_ana.x,fake_ana.y,fake_ana.width,fake_ana.height);
}

function resetAnas() {
    ana.x = Math.random() * 360;
    ana.y = 0;
    fake_ana.x = Math.random() * 360;
    fake_ana.y = 0;
}

function collisionFaciles() {
    if (ana.x < fake_ana.x + fake_ana.width &&
        ana.x + ana.width > fake_ana.x &&
        ana.y < fake_ana.y + fake_ana.height &&
        ana.y + ana.height > fake_ana.y ) {
        resetAnas();
    }
    if (ana.x < chat.x + chat.width &&
        ana.x + ana.width > chat.x &&
        ana.y < chat.y + chat.height &&
        ana.y + ana.height > chat.y ) {
        score_facile++;
        resetAnas();
        vitesse_facile = Math.min(vitesse_facile + 0.1, 6);
    }
    if (fake_ana.x < chat.x + chat.width &&
        fake_ana.x + fake_ana.width > chat.x &&
        fake_ana.y < chat.y + chat.height &&
        fake_ana.y + fake_ana.height > chat.y ) {
        score_facile = Math.max(0, score_facile - 1);
        score = 0;
        resetAnas();
        vitesse_facile = 1.5;
    }
    if (ana.y >= canvas.height) {
        resetAnas();
    }
}

function collision() {
    if (ana.x < fake_ana.x + fake_ana.width &&
        ana.x + ana.width > fake_ana.x &&
        ana.y < fake_ana.y + fake_ana.height &&
        ana.y + ana.height > fake_ana.y ) {
        resetAnas();
    }
    if (ana.x < chat.x + chat.width &&
        ana.x + ana.width > chat.x &&
        ana.y < chat.y + chat.height &&
        ana.y + ana.height > chat.y ){
        score++;
        resetAnas();
        vitesse = Math.min(vitesse + 0.3, 6);
    }
    if (fake_ana.x < chat.x + chat.width &&
        fake_ana.x + fake_ana.width > chat.x &&
        fake_ana.y < chat.y + chat.height &&
        fake_ana.y + fake_ana.height > chat.y ) {
        if (invincible) {
            resetAnas();
            return;
        }
        score = 0;
        vies -= 1;
        vitesse = 2;
        resetAnas();
    }
    if (ana.y >= canvas.height) {
        if (invincible) {
            ana.y = 0;
            ana.x = Math.random() * 360;
            return;
        }
        score = 0;
        vies -= 1;
        vitesse = 2;
        resetAnas();
    }
}

function formatTemps(t) {
    const min = Math.floor(t / 60);
    const sec = Math.floor(t % 60);
    return `${min}:${sec.toString().padStart(2,"0")}`;
}

function updateCountdown(timestamp) {
    if (timestamp - lastCountdownTime >= 1000) {
        countdown--;
        lastCountdownTime = timestamp;
        if (countdown < 0) etat = "play";
    }
}

function drawCountdown() {
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "bold 60px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    let text = countdown > 0 ? countdown : "PARTEZ !";
    ctx.fillText(text, canvas.width/2, canvas.height/2);
    ctx.restore();
}

function boucle(timestamp) {
    const delta = (timestamp - lastTime)/1000;
    lastTime = timestamp;

    if (!gameOver && !victoire && etat === "play") {
        tempsRestant -= delta;
        tempsRestant = Math.max(0, tempsRestant);
    }

    if (tempsRestant <= 0) gameOver = true;
    if (tempsRestant < 60) vitesse = Math.max(vitesse,6);

    ctx.fillStyle = "rgba(0,0,0,0.85)";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    chat.x = Math.max(0, Math.min(chat.x,canvas.width - chat.width));

    nv = Math.min(Math.floor(score/5)+1,5);
    if (nv > lastNv) {
        invincible = true;
        invincibleTime = INVINCIBLE_DUREE;
    }
    lastNv = nv;

    if (invincible) {
        invincibleTime -= delta;
        if (invincibleTime <= 0) invincible = false;
    }

    drawAna();
    drawFakeAna();
    drawChat();

    if (etat === "count") {
        updateCountdown(timestamp);
        drawCountdown();
    }

    if (etat === "play") {
        ana.y += vitesse;
        fake_ana.y += vitesse;
        collision();
    }

    if (vies === 0) {
        gameOver = true;
        ctx.fillStyle = "white";
        ctx.font = "bold 28px Arial";
        ctx.fillText("💔 Game Over",10,200);
        return;
    }

    if (nv === 8) {
        victoire = true;
        ctx.fillStyle = "white";
        ctx.font = "bold 28px Arial";
        ctx.fillText(`❤️ Tu as gagné ! niveau : ${nv} score : ${score}`,10,200);
        return;
    }

    ctx.fillStyle = tempsRestant < 30 ? "red" : "white";
    ctx.font = "bold 24px Arial";
    ctx.fillText(`⏱ ${formatTemps(tempsRestant)}`,10,60);
    ctx.fillStyle = "green";
    ctx.font = "bold 28px Arial";
    ctx.fillText(`❤️ ${vies}`,150,30);
    ctx.fillStyle = "red";
    ctx.font = "bold 28px Arial";
    ctx.fillText(`Score : ${score}`,10,30);
    ctx.fillStyle = "yellow";
    ctx.font = "bold 28px Arial";
    ctx.fillText(`Lvl : ${nv}`,220,30);

    requestAnimationFrame(boucle);
}

function boucleFacile(timestamp) {
    const delta = (timestamp - lastTime)/1000;
    lastTime = timestamp;

    if (!gameOver && !victoire && etat === "play") {
        tempsQuiReste -= delta;
        tempsQuiReste = Math.max(0, tempsQuiReste);
    }

    if (tempsQuiReste <= 0) gameOver = true;

    vitesse_facile = Math.min(vitesse_facile,6);

    ctx.fillStyle = "rgba(0,0,0,0.85)";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    chat.x = Math.max(0, Math.min(chat.x,canvas.width - chat.width));

    nv_facile = Math.floor(score_facile/5)+1;

    drawAna();
    drawFakeAna();
    drawChat();

    if (etat === "count") {
        updateCountdown(timestamp);
        drawCountdown();
    }

    if (etat === "play") {
        ana.y += vitesse_facile;
        fake_ana.y += vitesse_facile;
        collisionFaciles();
    }

    if (vies_faciles === 0) {
        gameOver = true;
        ctx.fillStyle = "white";
        ctx.font = "bold 28px Arial";
        ctx.fillText("💔 Game Over",10,200);
        return;
    }

    if (nv_facile === 5) {
        victoire = true;
        ctx.fillStyle = "white";
        ctx.font = "bold 28px Arial";
        ctx.fillText(`❤️ Tu as gagné ! niveau : ${nv_facile} score : ${score_facile}`,10,200);
        return;
    }

    ctx.fillStyle = tempsQuiReste < 30 ? "red" : "white";
    ctx.font = "bold 24px Arial";
    ctx.fillText(`⏱ ${formatTemps(tempsQuiReste)}`,10,60);
    ctx.fillStyle = "green";
    ctx.font = "bold 28px Arial";
    ctx.fillText(`❤️ ${vies_faciles}`,150,30);
    ctx.fillStyle = "red";
    ctx.font = "bold 28px Arial";
    ctx.fillText(`Score : ${score_facile}`,10,30);
    ctx.fillStyle = "yellow";
    ctx.font = "bold 28px Arial";
    ctx.fillText(`Lvl : ${nv_facile}`,220,30);

    requestAnimationFrame(boucleFacile);
}

document.getElementById("play").addEventListener("click",() => {
    if (!jeuLance){
        jeuLance = true;
        lastTime = performance.now();
        requestAnimationFrame(boucle);
    }
});

document.getElementById("replay").addEventListener("click", () => {
    score = 0;
    vies = 5;
    vitesse = 2;
    nv = 1;
    lastNv = 1;
    victoire = false;
    gameOver = false;
    invincible = false;
    invincibleTime = 0;
    tempsRestant = dureeTotale;
    ana.y = 0;
    fake_ana.y = 0;
    countdown = 3;
    etat = "count";
    lastCountdownTime = performance.now();
    lastTime = performance.now();
    requestAnimationFrame(boucle);
});

document.getElementById("facile").addEventListener("click", () => {
    if (!jeuLance) {
        jeuLance = true;
        lastTime = performance.now();
        requestAnimationFrame(boucleFacile);
    }
});
document.getElementById("replayfacile").addEventListener("click", () => {
    score_facile = 0;
    vies_faciles = 10;
    vitesse_facile = 1.5;
    nv_facile = 1;
    lastNv = 1;
    victoire = false;
    gameOver = false;
    tempsQuiReste = dureeTotale;
    ana.y = 0;
    fake_ana.y = 0;
    countdown = 3;
    etat = "count";
    lastCountdownTime = performance.now();
    lastTime = performance.now();
    requestAnimationFrame(boucleFacile);
});
