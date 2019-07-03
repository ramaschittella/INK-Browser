from flask import Flask, render_template, jsonify
from stock_scraper import get_data
import os


app = Flask(__name__)


@app.route("/data")
def data():
    return jsonify(get_data())


@app.route("/")
def index():
    return render_template("index.html")


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='127.0.0.1', port=port)
