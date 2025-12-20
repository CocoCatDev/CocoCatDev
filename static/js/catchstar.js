const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let jeuLance = false;

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

let dureeTotale = 5 * 60; // 5 minutes en secondes (10 * 60 si tu veux)
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

const INVINCIBLE_DUREE = 10;

let lastNv = 1;

document.getElementById("gauche").addEventListener("click",() => {
    chat.x -= 40;
});
document.getElementById("droite").addEventListener("click",() => {
    chat.x += 40;
});

function drawChat() {
    // effet clignotant
    if (invincible && Math.floor(performance.now() / 100) % 2 === 0) {
        return;
    }

    ctx.fillStyle = invincible ? "cyan" : "grey";
    ctx.fillRect(chat.x, chat.y, chat.width, chat.height);
}


function drawAna()
{
    ctx.fillStyle = "yellow";
    ctx.fillRect(ana.x,ana.y,ana.width,ana.height);
}
function drawFakeAna()
{
    ctx.fillStyle = "red";
    ctx.fillRect(fake_ana.x,fake_ana.y,fake_ana.width,fake_ana.height);
}


function collision()
{
    // Si collisions entre ana et fake_ana
      if (ana.x < fake_ana.x + fake_ana.width &&
        ana.x + ana.width > fake_ana.x &&
        ana.y < fake_ana.y + fake_ana.height &&
        ana.y + ana.height > fake_ana.y
    ) {
        // Réinitialiser les valeurs de base en cas de collision entre ana et fake_ana
        ana.x = Math.random() * 360;
        ana.y = 0;
        fake_ana.x = Math.random() * 360;
        fake_ana.y = 0;
        }
            // collision entre ana et chat 
            if (ana.x < chat.x + chat.width &&
        ana.x + ana.width > chat.x &&
        ana.y < chat.y + chat.height &&
        ana.y + ana.height > chat.y 
    ){
        // on gagne un point par ana catchée 
    score++;
    
    
    // on recrée les valeurs de ana et fake ana à celles de départ pour recommencer, on augmente la vitesse
    ana.x = Math.random() * 360;
    ana.y = 0;
    fake_ana.x = Math.random() * 360;
    fake_ana.y = 0;
    vitesse += 0.3;
    }
    // si chat entre en collision avec fake ana le score = 0 et il perd une vie
    if (!invincible &&
        fake_ana.x < chat.x + chat.width &&
        fake_ana.x + fake_ana.width > chat.x &&
        fake_ana.y < chat.y + chat.height &&
        fake_ana.y + fake_ana.height > chat.y
    ) {
        score = 0;
        if (score === 0)
        {
            vies -= 1;
        }
        // vitesse et valeurs initiales 
        vitesse = 2;
        ana.x = Math.random() * 360;
        ana.y = 0;
        fake_ana.x = Math.random() * 360;
        fake_ana.y = 0;
    }
    // si ana tombe, score à zero, moins une vie, ...
    if (!invincible &&
        ana.y >= canvas.height)
    {
        score = 0;
        
        vies -= 1;
            
        vitesse = 2;
        ana.x = Math.random() * 360;
        ana.y = 0;
        fake_ana.x = Math.random() * 360;
        fake_ana.y = 0;

    }
   
}

function formatTemps(t) {
    const min = Math.floor(t / 60);
    const sec = Math.floor(t % 60);
    return `${min}:${sec.toString().padStart(2, "0")}`;
}


function boucle(timestamp)
{
    const delta = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    if (!gameOver && !victoire) {
        tempsRestant -= delta;
        tempsRestant = Math.max(0, tempsRestant);
    }
    if (tempsRestant <= 0) {
    gameOver = true;
}
    if (tempsRestant < 60) {
    vitesse = Math.max(vitesse, 6);
}


    // canvas peint en noir 
    ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

      

    // garder le chat dans le canvas
    chat.x = Math.max(0, Math.min(chat.x,canvas.width - chat.width));

    // si le niveau est un multiple de 5 on incrémente 1
    nv = Math.min(Math.floor(score / 5) + 1, 5);
    if (nv > lastNv)
    {
        invincible = true;
        invincibleTime = INVINCIBLE_DUREE;
    }
    lastNv = nv;

    if (invincible)
    {
        invincibleTime -= delta;
        if (invincibleTime <= 0){
            invincible = false;
        }
    }
   
    // effet pluie et appel des fonctions dessins et collisions 
    ana.y += vitesse;
    fake_ana.y += vitesse;
     collision();

      drawAna();
    drawFakeAna();
    drawChat();
    // affichage du game over si vie est à zero 
    if (vies === 0)
    {
        gameOver = true;
        ctx.fillStyle = "white";
        ctx.font = "bold 28px Arial";
        ctx.fillText("💔 Game Over",10,200);
        return;

    }
   
    // la victoire 
    if (nv == 5)
    {
        victoire = true;
        ctx.fillStyle = "white";
        ctx.font = "bold 28px Arial";
        ctx.fillText(`❤️ Tu as gagné ! : ${nv} : ${score} `,10,200);
        return;
    }
    ctx.fillStyle = tempsRestant < 30 ? "red" : "white";
    ctx.font = "bold 24px Arial";
    ctx.fillText(`⏱ ${formatTemps(tempsRestant)}`, 10, 60);

    ctx.fillStyle = "green";
    ctx.font = "bold 28px Arial";
    ctx.fillText(`❤️ ${vies}`,150,30);
    ctx.fillStyle = "red";
    ctx.font = "bold 28px Arial";
    ctx.fillText(`Score : ${score}`, 10, 30);
    ctx.fillStyle = "yellow";
    ctx.font = "bold 28px Arial";
    ctx.fillText(`Lvl : ${nv}`,220,30);
    
    requestAnimationFrame(boucle);

}

document.getElementById("play").addEventListener("click",() => {
    if (!jeuLance){
        jeuLance =true;
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

    lastTime = performance.now();
    requestAnimationFrame(boucle);
});
