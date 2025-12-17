document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("repo-list");
  const input = document.getElementById("recherche");
  if (!container) return;

  fetch("/api/repos")
    .then(res => res.json())
    .then(repos => {
      // Vérification que l'API renvoie bien un tableau
      if (!Array.isArray(repos)) {
        console.error("Erreur API :", repos.error || repos);
        return;
      }

      repos.forEach(repo => {
        const div = document.createElement("div"); // crée d'abord la div
        div.className = "repo-card";

        div.innerHTML = `
          <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
          <p>${repo.description || "Pas de description"}</p>
          <p>⭐ ${repo.stargazers_count} | 🧠 ${repo.language || "N/A"}</p>
        `;

        // Bouton like
        const btnJaime = document.createElement("button");
        btnJaime.textContent = `❤️ 0`;

        const divMessage = document.createElement("div");
        divMessage.className = "merki";

        const merci = document.createElement("p");
        divMessage.appendChild(merci);

        let likes = 0;
        btnJaime.addEventListener('click', () => {
          likes++;
          btnJaime.textContent = `❤️ ${likes}`;
          merci.textContent = "Merci à vous ! Tant d'amour";
        });

        div.appendChild(btnJaime);
        div.appendChild(divMessage);

        container.appendChild(div);
      });

      // Filtre par recherche
      input.addEventListener("input", () => {
        const value = input.value.toLowerCase();

        document.querySelectorAll(".repo-card").forEach(card => {
          const title = card.querySelector("h3 a").textContent;
          const desc = card.querySelector("p").textContent;

          const match = title.toLowerCase().includes(value) || desc.toLowerCase().includes(value);
          card.style.display = match ? "" : "none";
        });
      });
    })
    .catch(err => console.error("Erreur fetch repos :", err));
});

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
