function load_input_permutation(submissionid, key, input)
{
    var grid = new Muuri('.grid');
    
    var field = $("form#task input[name='" + key + "']");
    if(key in input)
        $(field).prop('value', input[key]);
    else
        $(field).prop('value', "");
}