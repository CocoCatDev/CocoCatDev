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

function boucle()
{
    ctx.clearRect(0,0, canvas.width,canvas.height);
    chat.x = Math.max(0, Math.min(chat.x,canvas.width - chat.width));
    drawAna();
    drawFakeAna();
    drawChat();

    ana.y += vitesse;
    fake_ana.y += vitesse;
    if (ana.x < fake_ana.x + fake_ana.width &&
        ana.x + ana.width > fake_ana.x &&
        ana.y < fake_ana.y + fake_ana.height &&
        ana.y + ana.height > fake_ana.y
    ) {
        ana.x = Math.random() * 360;
        ana.y = 0;
        fake_ana.x = Math.random * 360;
        fake_ana.y = 0;
        }
    if (ana.x < chat.x + chat.width &&
        ana.x + ana.width > chat.x &&
        ana.y < chat.y + chat.height &&
        ana.y + ana.height > chat.y
    ){
    score++;
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
        vitesse = 2;
        ana.x = Math.random() * 360;
        ana.y = 0;
        fake_ana.x = Math.random() * 360;
        fake_ana.y = 0;
    }
    if (ana.y >= canvas.height)
    {
        ctx.fillText(`GameOver ! Score : ${score}`, 10, 30);
        score = 0;
        vitesse = 2;
        ana.x = Math.random() * 360;
        ana.y = 0;
        fake_ana.x = Math.random() * 360;
        fake_ana.y = 0;

    }
    ctx.fillText(`Score : ${score}`, 10, 30);
    ctx.fillStyle = "red";
    ctx.font = "bold 28px Arial";
    requestAnimationFrame(boucle);

}

boucle();


