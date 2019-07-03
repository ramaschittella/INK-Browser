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
        var cells = rows[i].split(",");
        if (cells.length > 1) {
            arr.push(cells[0].trim());
            arr.push(cells[2].trim());  
        }
    }
    main(document.getElementById('graphContainer'));
}

//Upload csv file

function upload()
{
    var fileUpload = document.getElementById("fileUpload");
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
    if (regex.test(fileUpload.value.toLowerCase())) {
        if (typeof (FileReader) != "undefined") {
            var reader = new FileReader();
            reader.onload = function (e) {
               
                rows = e.target.result.split("\n");
                // push nodes
                pushData(nodes);
            }
            reader.readAsText(fileUpload.files[0]);


        } else {
            alert("This browser does not support HTML5.");
        }
    } else {
        alert("Please upload a valid CSV file.");
    }
    
}


// find unique nodes

function findUniques(arr)
{
	const final = [ ];

	arr.map((e,i)=> !final.includes(e) && final.push(e) )
	return final;
}

// mxGraph function

function main(container)
{
	container.innerHTML="";
 // Checks if the browser is supported
 if (!mxClient.isBrowserSupported())
 {
    mxUtils.error('Browser is not supported!', 200, false);
 }
 else
 {
    // Creates the graph inside the given container
    var graph = new mxGraph(container);

    // Enables rubberband selection
    new mxRubberband(graph);

    // Gets the default parent for inserting new cells. This
    // is normally the first child of the root (ie. layer 0).
    var parent = graph.getDefaultParent();

    // Adds cells to the model in a single step
    var uniqueNodes=findUniques(nodes);
    graph.getModel().beginUpdate();
    try
    {
      
       var v=[];
       // Inserting a vertex
       for (var i = 0; i < uniqueNodes.length; i++) 
       {
          randomXY();
          this["v"+uniqueNodes[i]]=graph.insertVertex(parent, null,uniqueNodes[i],randPosX,randPosY, 60, 30);
        }
       
       for (var i = 0; i < rows.length; i++)
       {
            var cells = rows[i].split(",");
           
            if (cells.length > 1)
            {
            	var source=cells[0].trim();
            	var dest=cells[2].trim();
            	var e=cells[1].trim();
            	
            	graph.insertEdge(parent, null,e,this["v"+source],this["v"+dest]);
            }
        }
    }
    finally
    {
       // Updates the display
       graph.getModel().endUpdate();
    }
 }
};