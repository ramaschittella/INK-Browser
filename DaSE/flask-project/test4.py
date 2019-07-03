from flask import Flask, render_template, request,jsonify
from SPARQLWrapper import SPARQLWrapper, JSON
import json
import os

app = Flask(__name__, template_folder='templates')


@app.route('/')
def index():
    sparql = SPARQLWrapper("http://localhost:3030/DataChess/query")
    sparql.setQuery("""
	PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
	SELECT DISTINCT ?s
	WHERE{ ?s ?p ?o; }
	""")
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()
    for result in results["results"]["bindings"]:
        print (result["s"]["value"])
    return render_template('index.html', subjects=results["results"]["bindings"])

@app.route('/update', methods=['POST'])
def home():
    subject = request.form['action']
    pred ="http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
    obj = ""
    #print(subject)

    sparql = SPARQLWrapper("http://localhost:3030/DataChess/query")

    #Updated the subject query to extract subjects based on predicate type below.
    '''6666
    sparql.setQuery("""
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    SELECT DISTINCT ?s
    WHERE{ ?s ?p ?o;}
    """)
    sparql.setReturnFormat(JSON)
    results2 = sparql.query().convert()
    '''



    sparql.setQuery('''
            	PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            	SELECT DISTINCT ?p ?o
            	WHERE{ <''' + subject + '''> ?p ?o }
            	''')
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()

    #Collecting type object to filter out the subjects
    for item in results["results"]["bindings"]:
        if item['p']['value'] == pred:
            obj = item['o']['value']

    sparql.setQuery('''
        PREFIX rdf: <http://www.w3.org/199902/22-rdf-syntax-ns#>
        SELECT DISTINCT ?s
        WHERE{  ?s <''' + pred + '''> <''' + obj + '''> }
        ''')
    sparql.setReturnFormat(JSON)
    results2 = sparql.query().convert()

    return render_template('index.html', predicates=results["results"]["bindings"], subjects=results2["results"]["bindings"], test_subjects=subject.split('/')[-1])

@app.route('/update2', methods=['POST'])
def home2():
    subject = request.form['action']
    pred = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
    obj = ""
    #print(subject)
    sparql = SPARQLWrapper("http://localhost:3030/DataChess/query")
    sparql.setQuery('''
        PREFIX rdf: <http://www.w3.org/199902/22-rdf-syntax-ns#>
        SELECT DISTINCT ?p ?o
        WHERE{ <''' + subject + '''> ?p ?o }
        ''')
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()

    for item in results["results"]["bindings"]:
        if item['p']['value'] == pred:
            obj = item['o']['value']

    sparql.setQuery('''
            PREFIX rdf: <http://www.w3.org/199902/22-rdf-syntax-ns#>
            SELECT DISTINCT ?s
            WHERE{  ?s <''' + pred + '''> <''' + obj + '''> }
            ''')
    sparql.setReturnFormat(JSON)
    results2 = sparql.query().convert()


    #test_subject = '[{"p":{"type":"uri", "value":""}, "s":{"type":"uri", "value":"' + subject.split('/')[-1] + '"}}]'
    #print(test_subject)
    #test_result = json.loads(test_subject)
    return render_template('index.html', predicates=results["results"]["bindings"], subjects=results2["results"]["bindings"],test_subjects=subject.split('/')[-1])




@app.route('/subjects', methods=['POST'])
def browser():
        subject = request.form['action']
        print(subject)
        sparql = SPARQLWrapper("http://localhost:3030/DataChess/query")
        sparql.setQuery('''
        	PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        	SELECT DISTINCT ?p ?o
        	WHERE{ <'''+subject+'''> ?p ?o }
        	''')
        sparql.setReturnFormat(JSON)
        results = sparql.query().convert()
        for result in results["results"]["bindings"]:
            print(result)
        return render_template('index9.html', results=results["results"]["bindings"], subject=subject.split('/')[-1])


@app.route('/predicate', methods=['POST'])
def browser2():
        subject = request.form['action']
        print(subject)
        sparql = SPARQLWrapper("http://localhost:3030/DataChess/query")
        sparql.setQuery('''
        	PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        	SELECT DISTINCT ?p ?s
        	WHERE{ ?s ?p <'''+subject+'''> }
        	''')
        sparql.setReturnFormat(JSON)
        results = sparql.query().convert()
        text = open("results.json","w+")
        text.write(str(results))
        for result in results["results"]["bindings"]:
            print(result)
        return render_template('index10.html', results=results["results"]["bindings"], subject=subject.split('/')[-1])


if __name__ == '__main__':
    app.run(debug=True)
