
document.addEventListener("scroll", () => {
  document.querySelectorAll(".reveal").forEach(element => {
    const haut = element.getBoundingClientRect().top;
    const hauteur_fenetre = window.innerHeight;

    if (haut < hauteur_fenetre - 100) {
      element.classList.add("visible");
    }
  });
}); 


document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("contient");
  container.classList.add("visible");
  const pp = document.getElementById("pp");
  document.getElementById("mini-p").textContent = new Date().getFullYear();

  pp.addEventListener("click", () => {
    const divi = document.createElement("div");
    const coco = document.createElement("p");
    coco.textContent = "Salut petit malin ! Coco, c'était le nom de mon chat.";
    divi.appendChild(coco);
    container.appendChild(divi);
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const divi1 = document.getElementById("l1_id");
const textes_perso = {
  "l1" : "HTML/CSS, les ultra bases ! Bon niveau en HTML, moyen en CSS.",
  "l2": "En cours d'apprentissage, je sais faire quelqies trucs, comme ça !",
  "l3": "Python ! Le langage que je maîtrise bien ! POO, petits jeux ou app graphique avec Tkinter !",
  "l4": "Pygame, quelques petits jeux",
  "l4bis": "Très débutant, pas prêt pour de vrais projets",
  "l5": "Tkinter, je sais faire de petites interface, pas très jolies mais fonctionelles",
  "l6": "Langace C, petites bases"
};

document.querySelectorAll("#skills-list li").forEach(li => {
  li.addEventListener("click",() =>{
    divi1.innerHTML = "";

    const create_divi1 = document.createElement("div");

    const m1 = document.createElement("p");

    const classe = Array.from(li.classList).find(c =>textes_perso[c]);
     m1.textContent = textes_perso[classe];

     create_divi1.appendChild(m1);
     divi1.appendChild(create_divi1);


  });
});
});



