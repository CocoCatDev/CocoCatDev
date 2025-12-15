from flask import Flask, render_template, url_for, request, redirect
import sqlite3

app = Flask(__name__)

DATABASE = 'test.db'

def init_db():
    conn = sqlite3.connect('test.db')
    cur = conn.cursor()

    cur.execute("""CREATE TABLE IF NOT EXISTS contenu (id INTEGER PRIMARY KEY AUTOINCREMENT, contenu TEXT NOT NULL)""")
    
    conn.commit()
    conn.close()

init_db()

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
    
    







if __name__ == '__main__':
    app.run()