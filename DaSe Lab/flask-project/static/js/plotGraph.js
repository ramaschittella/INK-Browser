// global variables
let nodes=[];
let fixedNode;
let edges=[];
let randPosX=0;
let randPosY=0;
let nodes2=[];
let edges2=[];
let fixedNode2;
let path;
//store data locally
function saveData()
{
    localStorage.setItem("nodes",JSON.stringify(nodes));
    localStorage.setItem("edges",JSON.stringify(edges));
    localStorage.setItem("fixedNode",fixedNode);
}

function getData()
{
    nodes=JSON.parse(localStorage.getItem("nodes"));
    edges=JSON.parse(localStorage.getItem("edges"));
    fixedNode=localStorage.getItem("fixedNode");
}

// Used to give the random position
function randomXY()
{

	// var bodyWidth = document.body.clientWidth-150;
	// var bodyHeight = document.body.clientHeight-150;
	let bodyWidth = document.getElementById("graphContainer").offsetWidth-120;
	let bodyHeight =document.getElementById("graphContainer").offsetHeight-120;
	randPosX =Math.floor(Math.random()*bodyWidth);
	randPosY =Math.floor(Math.random()*bodyHeight);
}

// finding nodes and edges

function getNodeAndEdges()
{
	path=window.location.pathname;
	console.log("path name ",path);
	if(path === "/update")
    {
      fixedNode=document.getElementById("subj").innerHTML;
	let table = document.getElementById('tbldata');
    let rlen = table.rows.length;
    for (let i = 0; i < rlen; i++){
    	// var inputs1 = table.rows.item(i).getElementsByTagName("td");

        let inputs = table.rows.item(i).getElementsByTagName("input");
        let inputslen = inputs.length;
        // console.log("int",inputs);
        if(inputslen > 0)
        {
        	let inputedge = trimOut(inputs[0].value);
            let inputnode = trimOut(inputs[1].value);


            nodes.push(inputnode);
            edges.push(inputedge);
        }
    }

    // console.log("nodes ",nodes);
    // console.log("edges ",edges);
    // console.log("fixed ",fixedNode);
    main(document.getElementById('graphContainer'));
    }
	else if(path === "/update2") {
	     fixedNode2=document.getElementById("subj").innerHTML;
	     getData();
	     let table = document.getElementById('tbldata');
         let rlen = table.rows.length;
         for (let i = 0; i < rlen; i++){
    	// var inputs1 = table.rows.item(i).getElementsByTagName("td");

        let inputs = table.rows.item(i).getElementsByTagName("input");
        let inputslen = inputs.length;
        // console.log("int",inputs);
        if(inputslen > 0)
        {
        	let inputedge = trimOut(inputs[0].value);
            let inputnode = trimOut(inputs[1].value);


            nodes2.push(inputnode);
            edges2.push(inputedge);
        }
      }// for loop end
        main(document.getElementById('graphContainer'));
    }//else if end
    else
    {
        localStorage.removeItem("nodes");
        localStorage.removeItem("edges");
        localStorage.removeItem("fixedNode");
    }
}

function trimOut(inp)
{
	let temp=inp.substring(inp.lastIndexOf("/")+1,inp.length);
	return temp.trim();
}




// mxGraph function

function main(container)
{
	// container.innerHTML="";
 // Checks if the browser is supported
 if (!mxClient.isBrowserSupported())
 {
    mxUtils.error('Browser is not supported!', 200, false);
 }
 else
 {
    // Creates the graph inside the given container
    let graph = new mxGraph(container);

    // Enables rubberband selection
    new mxRubberband(graph);

    // Gets the default parent for inserting new cells. This
    // is normally the first child of the root (ie. layer 0).
    let parent = graph.getDefaultParent();

    // Adds cells to the model in a single step
    graph.getModel().beginUpdate();
    try
    {
          let n=[];
          randomXY();

          let topNode=graph.insertVertex(parent, null,fixedNode,randPosX,randPosY, 90, 40);
       // Inserting a vertex
       for (let i = 0; i < nodes.length; i++)
       {
          randomXY();
          this["n"+nodes[i]]=graph.insertVertex(parent, null,nodes[i],randPosX,randPosY, 90, 40);
          let dest=nodes[i];
          if(dest === "ActingPlayerRole")
          {
              graph.insertEdge(parent, null,edges[i],this["n"+dest],topNode);
          }
          else
          {
             graph.insertEdge(parent, null,edges[i],topNode,this["n"+dest]);
          }

          console.log("dest ",dest);
        }

       if(path === "/update2"){
           for (let i = 0; i < nodes2.length; i++)
            {
                randomXY();
                this["n"+nodes2[i]]=graph.insertVertex(parent, null,nodes2[i],randPosX,randPosY, 90, 40);
                let dest=nodes2[i];
                if(dest === "ActingPlayerRole")
                {
                   graph.insertEdge(parent, null,edges2[i],this["n"+dest],this["n"+fixedNode2]);
                }
                else
                {
                    graph.insertEdge(parent, null,edges2[i],this["n"+fixedNode2],this["n"+dest]);
                }

                console.log("dest ",dest);
            }
       }


    }
    finally
    {
       // Updates the display
       graph.getModel().endUpdate();
       saveData();
    }
 }
}