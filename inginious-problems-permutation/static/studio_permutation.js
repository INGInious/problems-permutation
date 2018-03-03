function studio_init_template_permutation(well, pid, problem)
{
    var i=2;
        
    $("#add_row").click(function(){
        $('#addr'+i).html("<td>"+ (i+1) +"</td><td><input name='text"+i+"' type='text' placeholder='Insert text of the next element' class='form-control input-md'  /> </td>");

        $('#tab_logic').append('<tr id="addr'+(i+1)+'"></tr>');
        i++; 
    });
    $("#delete_row").click(function(){
        if(i>2){
            $("#addr"+(i-1)).html('');
            i--;
        }
    });
    
    if("answer" in problem)
        $('#answer-' + pid, well).val(problem["answer"]);
}