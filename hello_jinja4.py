from flask import Flask, render_template
from SPARQLWrapper import SPARQLWrapper, JSON

app = Flask(__name__, template_folder='Template')


@app.route('/')
def index():
    sparql = SPARQLWrapper("http://localhost:3030/AmsterdamMuseum/query")
    sparql.setQuery("""
	PREFIX owl: <http://www.w3.org/2002/07/owl#>v
	SELECT DISTINCT ?p ?o
	WHERE{ ?s a owl:Ontology . ?s ?p ?o . }
	limit 10""")
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()
    for result in results["results"]["bindings"]:
        print (result["label"]["value"])
    return render_template('index3.html', results=results["results"]["bindings"])


if __name__ == '__main__':
    app.run(debug=True)