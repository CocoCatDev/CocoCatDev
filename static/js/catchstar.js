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

let vies_set = {
    x : Math.random() * 360,
    y : 0,
    width : 35,
    height : 35
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

function drawVies()
{
    ctx.fillStyle = "green";
    ctx.fillRect(vies_set.x,vies_set.y,vies_set.width,vies_set.height);
}

function boucle()
{
    ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    
    
    chat.x = Math.max(0, Math.min(chat.x,canvas.width - chat.width));
    drawAna();
    drawFakeAna();
    drawVies();
    drawChat();

    ana.y += vitesse;
    fake_ana.y += vitesse;
    vies_set.y += vitesse;
    if (ana.x < fake_ana.x + fake_ana.width &&
        ana.x + ana.width > fake_ana.x &&
        ana.y < fake_ana.y + fake_ana.height &&
        ana.y + ana.height > fake_ana.y
    ) {
        ana.x = Math.random() * 360;
        ana.y = 0;
        fake_ana.x = Math.random() * 360;
        fake_ana.y = 0;
        }
    if (ana.x < vies_set.x + vies_set.width &&
        ana.x + ana.width > vies_set.x &&
        ana.y < vies_set.y + vies_set.height &&
        ana.y + ana.height > vies_set.height &&
        fake_ana.x < vies_set.x + vies_set.width &&
        fake_ana.x + fake_ana.width > vies_set.width &&
        fake_ana.y < vies_set.y + vies_set.height &&
        fake_ana.y + fake_ana.height > vies_set.y
    )
    {
        ana.x = Math.random() * 360;
        ana.y = 0;
        fake_ana.x = Math.random() * 360;
        fake_ana.y = 0;
        vies_set.x = Math.random() * 360;
        vies_set.y = 0;
    }
    if (ana.x < chat.x + chat.width &&
        ana.x + ana.width > chat.x &&
        ana.y < chat.y + chat.height &&
        ana.y + ana.height > chat.y 
    ){
    score++;
    if (score % 5 === 0)
    {
        vies++;
         if (vies % 5 === 0)
    {
        nv++;
    }
    }
    ana.x = Math.random() * 360;
    ana.y = 0;
    fake_ana.x = Math.random() * 360;
    fake_ana.y = 0;
    vitesse += 0.3;
    }
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
        vitesse = 2;
        ana.x = Math.random() * 360;
        ana.y = 0;
        fake_ana.x = Math.random() * 360;
        fake_ana.y = 0;
    }
    if (vies_set.x < chat.x + chat.width &&
        vies_set.x + vies_set.width > chat.x &&
        vies_set.y < chat.y + chat.height &&
        vies_set.y + vies_set.height > chat.y
    )
    {
        vies++;
        vitesse -= 0.1;
        vies_set.x = Math.random() * 360;
        vies_set.y = 0;
    }
    if (ana.y >= canvas.height)
    {
        score = 0;
        if (score === 0){
            vies -= 1;
            
        }
        vitesse = 2;
        ana.x = Math.random() * 360;
        ana.y = 0;
        fake_ana.x = Math.random() * 360;
        fake_ana.y = 0;

    }
    if (vies_set.y > canvas.height) {
    vies_set.x = Math.random() * (canvas.width - vies_set.width);
    vies_set.y = 0;
}

   
    if (vies === 0)
    {
        gameOver = true;
        ctx.fillStyle = "white";
        ctx.font = "bold 28px Arial";
        ctx.fillText("💔 Game Over",10,200);
        return;

    }
    if (vies < 5){
        nv = 1;
    }

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


