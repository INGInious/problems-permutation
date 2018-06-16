// Event trigger

function normalize(table) {
    table.title = table.tableName;
    table.color = table.tableColor;
    table.content = [];
    if(table.text == undefined)
        return table;

    for(var i=0;i in table.text;i++) {
        table.content.push([table.text_id[i], table.text[i]])
    }

    return table;
}

function studio_init_template_permutation(well, pid, problem) {
    console.log(problem)

    var mainTables = 1 in problem?{}:undefined;
    for(var i=1;i in problem;i++) {
        mainTables[problem[i].tableName] = normalize(problem[i]);
    }

    var misleadingTable = 0 in problem?normalize(problem[0]):undefined;

    PermutationStudioUI.init_ui(pid, mainTables, misleadingTable)
    return;
}
