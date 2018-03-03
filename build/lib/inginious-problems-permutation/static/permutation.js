function load_input_permutation(submissionid, key, input) {
    var field = $("form#task input[name='" + key + "']");
    if(key in input)
        $(field).prop('value', input[key]);
    else
        $(field).prop('value', "");
}

function studio_init_template_permutation(well, pid, problem)
{
    if("answer" in problem)
        $('#answer-' + pid, well).val(problem["answer"]);
}