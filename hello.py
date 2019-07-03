from flask import Flask, render_template

app = Flask(__name__, template_folder='Template')


@app.route('/')
def index():
    # list_example = [1, 1, 2, 3, 5, 8, 13, 21]
    list_example = ['a', 'b', 'c']

    return render_template('hello.html', list_example=list_example)


if __name__ == '__main__':
    app.run(debug=True)