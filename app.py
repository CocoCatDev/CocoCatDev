from flask import Flask, render_template, request, redirect, url_for, jsonify
import sqlite3
import requests
import os

app = Flask(__name__)

# ---------- CONFIG ----------
DATABASE = "test.db"
GITHUB_USER = "CocoCatDev"
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")  # ✅ Token sécurisé via variable d'environnement

# ---------- DATABASE ----------
def init_db():
    """Initialise la base de données si elle n'existe pas"""
    with sqlite3.connect(DATABASE) as conn:
        cur = conn.cursor()
        cur.execute("""
            CREATE TABLE IF NOT EXISTS contenu (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                contenu TEXT NOT NULL
            )
        """)
        conn.commit()

init_db()

# ---------- ROUTES ----------
@app.route("/")
def index():
    """Page d'accueil affichant le contenu de la base"""
    with sqlite3.connect(DATABASE) as conn:
        cur = conn.cursor()
        cur.execute("SELECT contenu FROM contenu")
        contenus = [row[0] for row in cur.fetchall()]
    return render_template("index.html", contenus=contenus)

@app.route("/contact", methods=["GET", "POST"])
def contact():
    """Page contact avec formulaire d'ajout de contenu"""
    if request.method == "POST":
        contenu = request.form.get("contenu")
        if contenu:
            with sqlite3.connect(DATABASE) as conn:
                cur = conn.cursor()
                cur.execute("INSERT INTO contenu (contenu) VALUES (?)", (contenu,))
                conn.commit()
        return redirect(url_for("index"))
    return render_template("contact.html")

@app.route("/api/repos")
def api_repos():
    """API pour récupérer les repos GitHub non-fork"""
    # 🔒 Sécurité : retour vide si le token n'existe pas
    if not GITHUB_TOKEN:
        return jsonify([])

    url = f"https://api.github.com/users/{GITHUB_USER}/repos"
    headers = {
        "Accept": "application/vnd.github+json",
        "Authorization": f"token {GITHUB_TOKEN}"
    }

    try:
        response = requests.get(url, headers=headers, timeout=5)
        response.raise_for_status()
        repos = response.json()

        if not isinstance(repos, list):
            return jsonify([])

    except requests.RequestException:
        return jsonify([])

    # Filtrer les forks
    filtered_repos = [r for r in repos if not r.get("fork")]

    # Préparer le JSON à renvoyer
    result = [
        {
            "name": r.get("name"),
            "html_url": r.get("html_url"),
            "stargazers_count": r.get("stargazers_count", 0),
            "description": r.get("description") or "",
            "language": r.get("language") or ""
        }
        for r in filtered_repos
    ]

    return jsonify(result)

# ---------- RUN ----------
if __name__ == "__main__":
    # ⚠️ En prod, mettre debug=False et utiliser un serveur type Gunicorn
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)), debug=False)


