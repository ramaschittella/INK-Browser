// global variables
var nodes=[];
var rows=[];
var randPosX=0;
var randPosY=0;
let clickedValue="";

let temp="";
function trimOut(inp)
{
	let temp=inp.substring(inp.lastIndexOf("/")+1,inp.length);
	return temp.trim();
}


//store data locally
function saveData()
{
    console.log("save data call ");
    localStorage.setItem("nodes",JSON.stringify(nodes));
    localStorage.setItem("rows",JSON.stringify(rows));
    localStorage.setItem("click",clickedValue);
}

function getData()
{
    console.log("get data call ");
    nodes=JSON.parse(localStorage.getItem("nodes"));
    rows=JSON.parse(localStorage.getItem("rows"));
    clickedValue=localStorage.getItem("click");
     main(document.getElementById('graphContainer'));
}

// get the table data




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
        console.log("cells ",cells);
        if (cells.length > 1) {
            arr.push(trimOut(cells[0]));
            arr.push(trimOut(cells[2]));
        }
    }
	console.log("pushdata call ");
    main(document.getElementById('graphContainer'));
}

function checkPath()
{
    console.log("check path call ");
    path=window.location.pathname;
	console.log("path name ",path);
	if(path === "/")
    {
         localStorage.removeItem("nodes");
         localStorage.removeItem("rows");
         localStorage.removeItem("click");
    }
	else {
	    getData();
    }
}


function clickevent()
{
    graph.addListener(mxEvent.CLICK, function(sender, evt)
				{
					var cell = evt.getProperty('cell');
					console.log("cell ",cell.value);
					// var hightlightCell=new mxCellHighlight(graph,'#00FF00','2',"dashed");

					if (cell != null)
					{
						graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, 'white', [cell]);
						graph.setCellStyles(mxConstants.STYLE_STROKECOLOR,'red', [cell]);
						var overlays = graph.getCellOverlays(cell);

						if (overlays == null)
						{
							// Creates a new overlay with an image and a tooltip
							var overlay = new mxCellOverlay(
								new mxImage('editors/images/overlays/check.png', 16, 16),
								'Overlay tooltip');

							// Installs a handler for clicks on the overlay
							overlay.addListener(mxEvent.CLICK, function(sender, evt2)
							{
								mxUtils.alert('Overlay clicked');
							});

							// Sets the overlay for the cell in the graph
							graph.addCellOverlay(cell, overlay);
						}
						else
						{
							graph.removeCellOverlays(cell);
						}
					}
				});
}



//Upload csv file

function upload()
{
    var fileUpload = document.getElementById("fileUpload");
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
    if (regex.test(fileUpload.value.toLowerCase())) {
        if (typeof (FileReader) != "undefined") {
            rows=[];
            nodes=[];
            var reader = new FileReader();
            reader.onload = function (e) {

                rows = e.target.result.split("\n");
                // push nodes
                pushData(nodes);
            };
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
    // Disables basic selection and cell handling


     // Highlights the vertices when the mouse enters
     var highlight = new mxCellTracker(graph, '#0e2eff');



    // Adds cells to the model in a single step
    nodes=findUniques(nodes);
    graph.addListener(mxEvent.CLICK, function(sender, evt)
				{
                    var cell = evt.getProperty('cell');
                    if(cell!=null)
                    {
                        if(cell.vertex === true){

                            console.log("cell ",cell);
                            clickedValue=cell.value;
                            saveData();
                            console.log("clicked",cell.value);

                            window.location.href="/update?action="+clickedValue;
                        }
                    }
                });
    graph.getModel().beginUpdate();
    try
    {

       var v=[];
       // Inserting a vertex
       for (var i = 0; i < nodes.length; i++)
       {
          randomXY();
          this["v"+nodes[i]]=graph.insertVertex(parent,null,nodes[i],randPosX,randPosY, 90, 40);
        }

       for (var i = 0; i < rows.length; i++)
       {
            var cells = rows[i].split(",");

            if (cells.length > 1)
            {
            	var source=trimOut(cells[0]);
            	var dest=trimOut(cells[2]);
            	var e=trimOut(cells[1]);

            	graph.insertEdge(parent, null,e,this["v"+source],this["v"+dest]);
            }
        }
       if(clickedValue!=null)
           {
               temp=this["v"+clickedValue];
               console.log("call h ",temp);
                graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, '#ffc107', [temp]);
           }




    }
    finally
    {

       // Updates the display

       graph.getModel().endUpdate();

    }
 }
}