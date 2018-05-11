
var uiTaskObject = {}

window.onload = function () {
    // PermutationTask.generate_permutation_list_with([Array(110).join(' C-C C+C ') + ';','D','A','B'], '.board-column-content');
    //PermutationTask.generate_permutation_list('.board-column-content');
    //alert(document.querySelector('.board-column-content').getAttribute('data'));

    var problems = document.getElementsByClassName('permutation');
    for(let i=0;i<problems.length;i++) {
        pid = problems[i].getAttribute('id').split('-')[1]

        var problem_node = problems[i];

        // Get items data
        var ptype = problem_node.getAttribute('ptype');
        var jsonElems = problem_node.getAttribute('elems');
        var jsonElemsId = problem_node.getAttribute('elemsId');
        var jsonTables = problem_node.getAttribute('tablesMetadata');
        var containerColor = problem_node.getAttribute('containerColor');
        // Decode data
        var elems = JSON.parse(jsonElems);
        var elemsId = JSON.parse(jsonElemsId);
        var tables = JSON.parse(jsonTables);

        uiTaskObject[pid] = PermutationTaskUI.generate_ui(ptype, pid, elems, elemsId, tables, containerColor);
    }
}


function load_input_permutation(submissionid, key, input)
{
    // Previous submissions
    console.log('Key: ' + JSON.stringify(key))
    console.log('Input: ' + JSON.stringify(input))

    var items = [];
    var itemsPos = [];

    Object.entries(input).forEach((pair) => {
        var item = pair[0];
        var itemPos = pair[1];

        if(!item.startsWith(key)) return;

        items.push(item);
        itemsPos.push(itemPos);
    })

    console.log(items)
    console.log(itemsPos)

    uiTaskObject[key].sortItems(items, itemsPos);
}