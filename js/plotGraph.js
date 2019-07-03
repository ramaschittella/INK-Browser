// global variables
var nodes=[];
var rows=[];
var randPosX=0;
var randPosY=0;

// Used to give the random position
function randomXY()
{
	
	// var bodyWidth = document.body.clientWidth-150;
	// var bodyHeight = document.body.clientHeight-150;
	var bodyWidth = document.getElementById("graphContainer").offsetWidth-120;
	var bodyHeight =document.getElementById("graphContainer").offsetHeight-120;
	randPosX =Math.floor(Math.random()*bodyWidth);
	randPosY =Math.floor(Math.random()*bodyHeight);
}

// Push Data function( for Nodes)

function pushData(arr)
{
	for (var i = 0; i < rows.length; i++)
	{
        var cells = rows[i].split(",");   //csv files seperated by comma, so we split by a comma
        if (cells.length > 1)  //make sure cell is not empty
	{
            arr.push(cells[0].trim()); //trim function is used to remove white space inbetween the words in a csv file eg if you give node 1 trim function will return node1
            arr.push(cells[2].trim());  
        }
    }
    main(document.getElementById('graphContainer'));
}

//Upload csv file

function upload()
{
    var fileUpload = document.getElementById("fileUpload");
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;    //regular expression to check the extension of the uploaded file to only accept the csv file
    if (regex.test(fileUpload.value.toLowerCase())) {
        if (typeof (FileReader) != "undefined") {  
            var reader = new FileReader();
            reader.onload = function (e) {   //event means target . Target is the uploaded file
               
                rows = e.target.result.split("\n");
                // push nodes
                pushData(nodes);
            }
            reader.readAsText(fileUpload.files[0]);         //converts csv fileto text file


        } else {
            alert("This browser does not support HTML5.");
        }
    } else {
        alert("Please upload a valid CSV file.");
    }
    
}


// find unique nodes

function findUniques(arr)    //To remove duplicate nodes
{
	const final = [ ];

	arr.map((e,i)=> !final.includes(e) && final.push(e) )  //e and i are vowels which detect the similar words in grammer
	return final;
}

// mxGraph function

function main(container)   //container is the div where we plot the graph
{
	container.innerHTML="";          //to clear the screen where there is already a graph
 // Checks if the browser is supported
 if (!mxClient.isBrowserSupported())
 {
    mxUtils.error('Browser is not supported!', 200, false);
 }
 else
 {
    // Creates the graph inside the given container
    var graph = new mxGraph(container);    //mxgraph is a class and graph is an instance of a class

    // Enables rubberband selection
    new mxRubberband(graph);   //move the nodes and edges on a graph

    // Gets the default parent for inserting new cells. This
    // is normally the first child of the root (ie. layer 0).
    var parent = graph.getDefaultParent();

    // Adds cells to the model in a single step
    var uniqueNodes=findUniques(nodes);
    graph.getModel().beginUpdate();
    try
    {
      
       var v=[];   //for vertex
       // Inserting a vertex
       for (var i = 0; i < uniqueNodes.length; i++) 
       {
          randomXY();
          this["v"+uniqueNodes[i]]=graph.insertVertex(parent, null,uniqueNodes[i],randPosX,randPosY, 60, 30); //to concatenate the v and unique node name to easily identify the node names 60 and 30 are height and width of the node 
        }
       
       for (var i = 0; i < rows.length; i++)
       {
            var cells = rows[i].split(",");
           
            if (cells.length > 1)
            {
            	var source=cells[0].trim();   //first node
            	var dest=cells[2].trim();		//second node
            	var e=cells[1].trim();		//edge
            	
            	graph.insertEdge(parent, null,e,this["v"+source],this["v"+dest]); // parent edge id(null) //name of the edge(e) //to create a link a between the first and second node 
            }
        }
    }
    finally
    {
       // Updates the display
       graph.getModel().endUpdate(); //display the updated model of a graph
    }
 }
};