from flask import Flask, render_template
from SPARQLWrapper import SPARQLWrapper, JSON

app = Flask(__name__, template_folder='Template')


@app.route('/')
def index():
    sparql = SPARQLWrapper("http://localhost:3030/BookMashup/query")
    sparql.setQuery("""
	PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
	SELECT ?e ?label
	WHERE{ ?e rdf:type ?label }
	limit 10""")
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()
    for result in results["results"]["bindings"]:
        print (result["label"]["value"])
    return render_template('index4.html', results=results["results"]["bindings"])


if __name__ == '__main__':
    app.run(debug=True)