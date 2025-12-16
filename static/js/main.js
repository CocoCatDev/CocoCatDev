fetch("/api/repos")
  .then(response => response.json())
  .then(repos => {
    const container = document.getElementById("repo-list");
    if (!container) return;

    // Trier par étoiles (optionnel)
    repos.sort((a, b) => b.stargazers_count - a.stargazers_count);

    repos.forEach(repo => {
      const div = document.createElement("div");
      div.className = "repo-card";

      div.innerHTML = `
        <h3>
          <a href="${repo.html_url}" target="_blank" rel="noopener">
            ${repo.name}
          </a>
        </h3>
        <p>${repo.description ?? "Pas de description"}</p>
        <p>
          🧠 ${repo.language ?? "N/A"} |
          ⭐ ${repo.stargazers_count}
        </p>
      `;

      container.appendChild(div);
    });
  })
  .catch(error => console.error("Erreur API:", error));
