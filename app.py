from flask import Flask, render_template, url_for, request, redirect, jsonify
import sqlite3
import requests

app = Flask(__name__)
DATABASE = 'test.db'
GITHUB_USER = "CocoCatDev"


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


@app.route('/')
def index():
    """Page d'accueil affichant le contenu de la base"""
    with sqlite3.connect(DATABASE) as conn:
        cur = conn.cursor()
        cur.execute("SELECT contenu FROM contenu")
        contenus = [row[0] for row in cur.fetchall()]
    return render_template('index.html', contenus=contenus)


@app.route('/contact', methods=['GET', 'POST'])
def contact():
    """Page contact avec formulaire d'ajout de contenu"""
    if request.method == 'POST':
        contenu = request.form.get('contenu')
        if contenu:
            with sqlite3.connect(DATABASE) as conn:
                cur = conn.cursor()
                cur.execute("INSERT INTO contenu (contenu) VALUES (?)", (contenu,))
                conn.commit()
        return redirect(url_for('index'))
    return render_template('contact.html')


@app.route("/api/repos")
def api_repos():
    """API pour récupérer les repos GitHub non-fork"""
    url = f"https://api.github.com/users/{GITHUB_USER}/repos"
    headers = {"Accept": "application/vnd.github+json"}

    try:
        response = requests.get(url, headers=headers, timeout=5)
        response.raise_for_status()
        repos = response.json()
        if not isinstance(repos, list):
            return jsonify([])  # renvoie toujours un tableau
    except requests.RequestException as e:
        return jsonify({"error": str(e)}), 500

    filtered_repos = [r for r in repos if not r.get("fork")]

    result = [
        {
            "name": r.get("name"),
            "html_url": r.get("html_url"),
            "stargazers_count": r.get("stargazers_count", 0),
            "description": r.get("description", ""),
            "language": r.get("language", "")
        }
        for r in filtered_repos
    ]

    return jsonify(result)


if __name__ == '__main__':
    app.run(debug=True)
