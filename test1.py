from flask import Flask, render_template
from SPARQLWrapper import SPARQLWrapper, JSON

app = Flask(__name__, template_folder='Template')


@app.route('/')
def index():
    sparql = SPARQLWrapper("http://localhost:3030/BookMashup/query")
    sparql.setQuery("""
	PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
	SELECT *
	WHERE{ ?s ?p ?o; }
	limit 10""")
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()
    for result in results["results"]["bindings"]:
        print (result["s"]["value"])
    return render_template('index5.html', results=results["results"]["bindings"])

@app.route('/index10')
def index10():
    sparql = SPARQLWrapper("http://localhost:3030/BookMashup/query")
    sparql.setQuery("""
	PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
	SELECT ?e ?label
	WHERE{<http://dbpedia.org/resource/120_Days_of_Sodom> ?e ?label }
	limit 10""")
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()

    return render_template('index4.html', results=results["results"]["bindings"])


@app.route('/index2')
def index2():
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


@app.route('/index3')
def index3():
    sparql = SPARQLWrapper("http://dbpedia.org/sparql")
    sparql.setQuery("""
	PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX dbp: <http://dbpedia.org/property/>
    PREFIX dbo: <http://dbpedia.org/ontology/>

    SELECT ?e ?label
    WHERE {
                ?e a 	dbo:Country ;
                   dbo:capital  ?label .
      ?label a 		        dbo:City ;
                 dbo:areaCode "020" .}
	limit 10""")
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()

    return render_template('index4.html', results=results["results"]["bindings"])

@app.route('/index4')
def index4():
    sparql = SPARQLWrapper("http://dbpedia.org/sparql")
    sparql.setQuery("""
	PREFIX dbo: <http://dbpedia.org/ontology/>
    PREFIX dbp: <http://dbpedia.org/property/>
    PREFIX dbr: <http://dbpedia.org/resource/>
    
    SELECT ?e ?label
    WHERE 
    {
      ?e  dbo:areaCode  "020" .
      OPTIONAL 
      {
         ?label  dbo:capital  ?e .  
      }
    }
    """)
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()

    return render_template('index4.html', results=results["results"]["bindings"])

@app.route('/index5')
def index5():
    sparql = SPARQLWrapper("http://dbpedia.org/sparql")
    sparql.setQuery("""
	PREFIX dbo: <http://dbpedia.org/ontology/>
    PREFIX dbp: <http://dbpedia.org/property/>
    PREFIX dbr: <http://dbpedia.org/resource/>
    
    SELECT ?e ?label
    WHERE {
      ?e dbo:areaCode	    "020" ;
            dbo:populationTotal ?label .
      FILTER (?label > 500000)
    } 
    limit 10""")
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()

    return render_template('index4.html', results=results["results"]["bindings"])


@app.route('/index6')
def index6():
    sparql = SPARQLWrapper("http://dbpedia.org/sparql")
    sparql.setQuery("""
	PREFIX dbo: <http://dbpedia.org/ontology/>
    PREFIX dbp: <http://dbpedia.org/property/>
    PREFIX dbr: <http://dbpedia.org/resource/>
    
    SELECT DISTINCT ?e
    WHERE {
     ?e      dbo:areaCode	"020" .
     ?capital   dbo:capital     ?e
    }
    limit 10""")
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()

    return render_template('index6.html', results=results["results"]["bindings"])


@app.route('/index7')
def index7():
    sparql = SPARQLWrapper("http://dbpedia.org/sparql")
    sparql.setQuery("""
	PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX dbp: <http://dbpedia.org/property/>
    PREFIX dbo: <http://dbpedia.org/ontology/>
    PREFIX dbr: <http://dbpedia.org/resource/>
    
    SELECT ?e
    WHERE {
      ?e dbo:country dbr:Netherlands .
      {
        ?e dbo:areaCode	"020" .
      }
      UNION
      {
        ?e dbo:areaCode	"010" .
      }
    } 
    """)
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()

    return render_template('index6.html', results=results["results"]["bindings"])


@app.route('/index8')
def index8():
    sparql = SPARQLWrapper("http://localhost:3030/BookMashup/query")
    sparql.setQuery("""
	PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT distinct ?e
    WHERE {
      ?e ?pred ?obj .} 
    limit 10""")
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()

    return render_template('index6.html', results=results["results"]["bindings"])

@app.route('/index9')
def index9():
    sparql = SPARQLWrapper("http://localhost:3030/BookMashup/query")
    sparql.setQuery("""
	PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT distinct ?e
    WHERE {
      ?sub ?pred ?e .} 
    limit 10""")
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()

    return render_template('index6.html', results=results["results"]["bindings"])




if __name__ == '__main__':
    app.run(debug=True)