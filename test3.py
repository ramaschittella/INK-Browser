from flask import Flask, render_template, request
from SPARQLWrapper import SPARQLWrapper, JSON
import os

app = Flask(__name__, template_folder='Template')


@app.route('/')
def index():
    sparql = SPARQLWrapper("http://dbpedia.org/sparql")
    sparql.setQuery("""
    	PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX dbp: <http://dbpedia.org/property/>
        PREFIX dbr: <http://dbpedia.org/resource/>
	SELECT DISTINCT ?s
	WHERE{ ?s ?p ?o }
	limit 10""")
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()
    for result in results["results"]["bindings"]:
        print (result["s"]["value"])
    return render_template('index7.html', results=results["results"]["bindings"])


@app.route('/subjects', methods=['POST'])
def browser():
        subject = request.form['action']
        print(subject)
        sparql = SPARQLWrapper("http://dbpedia.org/sparql")
        sparql.setQuery('''
        	PREFIX dbo: <http://dbpedia.org/ontology/>
            PREFIX dbp: <http://dbpedia.org/property/>
            PREFIX dbr: <http://dbpedia.org/resource/>
        	SELECT DISTINCT ?p ?o
        	WHERE{ <'''+subject+'''> ?p ?o }
        	limit 10''')
        sparql.setReturnFormat(JSON)
        results = sparql.query().convert()
        for result in results["results"]["bindings"]:
            print(result)
        return render_template('index9.html', results=results["results"]["bindings"], subject=subject.split('/')[-1])


@app.route('/predicate', methods=['POST'])
def browser2():
        subject = request.form['action']
        print(subject)
        sparql = SPARQLWrapper("http://dbpedia.org/sparql")
        sparql.setQuery('''
                	PREFIX dbo: <http://dbpedia.org/ontology/>
                    PREFIX dbp: <http://dbpedia.org/property/>
                    PREFIX dbr: <http://dbpedia.org/resource/>
        	SELECT DISTINCT ?p ?s
        	WHERE{ ?s ?p <'''+subject+'''> }
        	limit 10''')
        sparql.setReturnFormat(JSON)
        results = sparql.query().convert()
        text = open("results.json","w+")
        text.write(str(results))
        for result in results["results"]["bindings"]:
            print(result)
        return render_template('index10.html', results=results["results"]["bindings"], subject=subject.split('/')[-1])


if __name__ == '__main__':
    app.run(debug=True)
