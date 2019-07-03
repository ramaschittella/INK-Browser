$(document).ready(function () {
    // global variables
var nodes=[];
var rows=[];
var randPosX=0;
var randPosY=0;
let clickedValue="";
let preValue="";
var v=[];
let temp="";
let graph;

// jquery function

	$("#upload").click(function () {
        upload();
    });
    $(document).on('click','.btn-detail',function () {
         temp=$(this).text();
            console.log("click btn v ",temp);
             $.ajax({
                                url:"/getSubjectFromObject",
                                method:"GET",
                                data:{action:temp},
                                success:function (data) {
                                    // hightlight
                                console.log(data.obj);
                                preValue=clickedValue;
                                temp=v[preValue];
                                graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, '', [temp]);

                                clickedValue=data.obj;
                                temp=v[clickedValue];
                                // console.log("v ",v);
                                graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, '#ffc107', [temp]);
                                    let tvalue="";
                                    // console.log("o p ",data);
                                    $(".r").remove();
                                    $.each(data.values,function (index,t) {
                                        tvalue="<tr class='r'><td><button class='btn-click btn btn-block btn-primary'>"+t.s.value+"</button></td></tr>";
                                       // console.log("values ",t);
                                        $("#st tbody").append(tvalue);
                                    });
                                },
                                error:function (error) {
                                    console.log("error ",error);
                                }
                            });
    });


    // object clicked
    $(document).on('click','.btn-click',function () {
         temp=$(this).text();
            console.log("click btn v ",temp);
             $.ajax({
                                url:"/getPredicate",
                                method:"GET",
                                data:{action:temp},
                                success:function (data) {

                                    let tvalue="";
                                    // console.log("o p ",data);
                                    $(".p").remove();
                                    $.each(data,function (index,t) {
                                        tvalue="<tr class='p'><td><button class='btn btn-block btn-success text-left'>"+t.p.value+"</button></td>" +
                                            "<td><button class='btn-detail btn btn-block btn-success text-left'>"+t.o.value+"</button></td></tr>";
                                       console.log("values ",tvalue);
                                        $("#tbldata tbody").append(tvalue);
                                    });
                                    // console.log("tbl val ",tvalue);
                                    // $("#tbldata tbody").append(tvalue);


                                },
                                error:function (error) {
                                    console.log("error ",error);
                                }
                            });
    });

	// end of jquery function

    // javascript function
function trimOut(inp)
{
	let temp=inp.substring(inp.lastIndexOf("/")+1,inp.length);
	return temp.trim();
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
    graph = new mxGraph(container);

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
                            preValue=clickedValue;
                            temp=v[preValue];
                            graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, '', [temp]);
                            console.log("cell ",cell);
                            clickedValue=cell.value;
                             temp=v[clickedValue];
                            // console.log("v ",v);
                            graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, '#ffc107', [temp]);

                            console.log("clicked",cell.value);
                            $.ajax({
                                url:"/getSubject",
                                method:"GET",
                                data:{action:clickedValue},
                                success:function (data) {

                                    let tvalue="";
                                    console.log("data ",data[0].s.value);
                                    $(".r").remove();
                                    $(".p").remove();
                                    $.each(data,function (index,t) {
                                        tvalue="<tr class='r'><td><button class='btn-click btn btn-block btn-primary'>"+t.s.value+"</button></td></tr>";
                                       // console.log("values ",t);
                                        $("#st tbody").append(tvalue);
                                    });


                                },
                                error:function (error) {
                                    console.log("error ",error);
                                }
                            });
                            // window.location.href="/update?action="+clickedValue;
                        }
                    }
                });
    graph.getModel().beginUpdate();
    try
    {


       // Inserting a vertex
       for (var i = 0; i < nodes.length; i++)
       {
          randomXY();
          temp=nodes[i];
          v[temp]=graph.insertVertex(parent,null,temp,randPosX,randPosY, 90, 40);
        }

       for (var i = 0; i < rows.length; i++)
       {
            var cells = rows[i].split(",");

            if (cells.length > 1)
            {
            	var source=trimOut(cells[0]);
            	var dest=trimOut(cells[2]);
            	var e=trimOut(cells[1]);

            	graph.insertEdge(parent, null,e,v[source],v[dest]);
            }
        }
    }
    finally
    {

       // Updates the display

       graph.getModel().endUpdate();

    }
 }
}
});