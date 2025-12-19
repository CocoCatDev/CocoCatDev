const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

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


let score = 0;

let vies = 5;

let vitesse = 2;

let gameOver = false;

let nv = 1;

let victoire = false;

document.getElementById("gauche").addEventListener("click",() => {
    chat.x -= 40;
});
document.getElementById("droite").addEventListener("click",() => {
    chat.x += 40;
});

function drawChat()
{
    ctx.fillStyle = "grey";
    ctx.fillRect(chat.x,chat.y,chat.width,chat.height);
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
    if (fake_ana.x < chat.x + chat.width &&
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
    if (ana.y >= canvas.height)
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

function boucle()
{
    // canvas peint en noir 
    ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // garder le chat dans le canvas
    chat.x = Math.max(0, Math.min(chat.x,canvas.width - chat.width));

    // si le niveau est un multiple de 5 on incrémente 1
    nv = Math.min(Math.floor(score / 5) + 1, 5);

   
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

boucle();


