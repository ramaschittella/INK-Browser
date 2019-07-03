from flask import Flask, render_template
from SPARQLWrapper import SPARQLWrapper, JSON

app = Flask(__name__, template_folder='Template')


@app.route('/')
def index():
    sparql = SPARQLWrapper("http://dbpedia.org/sparql")
    sparql.setQuery("""
	    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
	    SELECT ?e ?label
	    WHERE { <http://dbpedia.org/resource/Asturias> rdfs:label ?label }
	""")
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()
    for result in results["results"]["bindings"]:
        print(result["label"]["value"])
    return render_template('index2.html', results=results["results"]["bindings"])


if __name__ == '__main__':
    app.run(debug=True)
