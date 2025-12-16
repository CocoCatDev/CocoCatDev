from flask import Flask, render_template, url_for, request, redirect, jsonify
import sqlite3
import requests

app = Flask(__name__)

DATABASE = 'test.db'


def init_db():
    conn = sqlite3.connect('test.db')
    cur = conn.cursor()

    cur.execute("""CREATE TABLE IF NOT EXISTS contenu (id INTEGER PRIMARY KEY AUTOINCREMENT, contenu TEXT NOT NULL)""")
    
    conn.commit()
    conn.close()

init_db()

GITHUB_USER = "CocoCatDev"

@app.route('/')
def index():
    conn = sqlite3.connect(DATABASE)
    cur = conn.cursor()
    cur.execute("SELECT contenu FROM contenu")

    contenus = cur.fetchall()

    return render_template('index.html',contenus=contenus)

@app.route('/contact',methods=['POST','GET'])
def contact():
    if request.method == 'GET':
        return render_template('contact.html')
    elif request.method == 'POST':
        contenu = request.form['contenu']
        conn = sqlite3.connect(DATABASE)
        cur = conn.cursor()
        cur.execute("INSERT INTO contenu (contenu) VALUES (?)",(contenu,))
        conn.commit()
        conn.close()
        

        return redirect(url_for('index'))



@app.route("/api/repos")  # ← exactement ce chemin
def repos():
    url = "https://api.github.com/users/CocoCatDev/repos"
    headers = {"Accept": "application/vnd.github+json"}

    try:
        response = requests.get(url, headers=headers, timeout=5)
    except requests.RequestException as e:
        return jsonify({"error": str(e)}), 500

    if response.status_code != 200:
        return jsonify({"error": "Impossible de récupérer les repos"}), 500

    repos = response.json()
    filtered_repos = [r for r in repos if not r["fork"]]

    result = [
        {
            "name": r["name"],
            "html_url": r["html_url"],
            "stargazers_count": r["stargazers_count"],
            "description": r.get("description", ""),
            "language": r.get("language", "")
        }
        for r in filtered_repos
    ]

    return jsonify(result)

@app.route("/repos")
def redirige():
    return redirect(url_for('repos.html'))






if __name__ == '__main__':
    app.run()