function getNodeAndEdges()
{
	let path=window.location.pathname;
	console.log("path name ",path);
	if(path === "/update" || path === "/update2")
    {
      const fixedNode=document.getElementById("subj").innerHTML;
	let table = document.getElementById('tbldata');
    let rlen = table.rows.length;
    let node=[];
    let edge=[];
    for (let i = 0; i < rlen; i++){
    	// var inputs1 = table.rows.item(i).getElementsByTagName("td");

        let inputs = table.rows.item(i).getElementsByTagName("input");
        let inputslen = inputs.length;
        // console.log("int",inputs);
        if(inputslen > 0)
        {
        	let inputedge = trimOut(inputs[0].value);
            let inputnode = trimOut(inputs[1].value);


            node.push(inputnode);
            edge.push(inputedge);
        }
    }
    console.log("nodes ",node);
    console.log("edges ",edge);
    console.log("fixed ",fixedNode);
    }

}

function trimOut(inp)
{
	var temp=inp.substring(inp.lastIndexOf("/")+1,inp.length);
	return temp;
}