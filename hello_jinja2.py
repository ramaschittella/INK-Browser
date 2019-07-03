from flask import Flask, render_template

app = Flask(__name__, template_folder='Template')

@app.route('/')
def index():
    username = "rama"
    username1 = "john"
    usernames = [username, username1]
    return render_template('index.html', username=usernames)



if __name__ == '__main__':
    app.run(debug=True)



