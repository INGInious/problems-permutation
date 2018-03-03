function studio_init_template_permutation(well, pid, problem) {
    // Detect tab change event
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var target = $(e.target).attr("href") 
        
        // wait activation of tab 'subproblems'
        if(target == '#tab_subproblems') {
            if (0 in problem['text']) set_row(pid, 0, problem['text'][0]);
            if (1 in problem['text']) set_row(pid, 1, problem['text'][1]);

            var position = 2;
            while(position in problem['text']) {
                add_row(pid, position);
                set_row(pid, position, problem['text'][position]);
                position ++;
            }
            add_listeners(pid, position)
        }
    });
}


function add_listeners(pid, ipos) {
    var i=ipos;

    $("#add_row_" + pid).click(() => {
        add_row(pid, i);
        i++;
    });
    $('#delete_row_' + pid).click(function(){
        if(i>2){
            $('#addr_' + pid + '_' + (i-1)).html('');
            i--;
        }
    });
}

function set_row(pid, position, value) {
    $('#text_' + pid + '_' + position).val(value);
}

function add_row(pid, i) {
    $('#addr_' + pid + '_' + i).html("<td>"+ (i+1) +"</td><td><input id='text_" + pid + "_" + i +  "' name='problem["+pid+'][text]['+i+"]' type='text' placeholder='Insert text of the next element' class='form-control input-md'  /> </td>");

    $('#tab_logic_' + pid).append('<tr id="addr_' + pid + '_' + (i+1) + '"></tr>');
}