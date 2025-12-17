// Animation scroll
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