
window.onload = function () {
    // PermutationTask.generate_permutation_list_with([Array(110).join(' C-C C+C ') + ';','D','A','B'], '.board-column-content');
    //PermutationTask.generate_permutation_list('.board-column-content');
    //alert(document.querySelector('.board-column-content').getAttribute('data'));

    var problems = document.getElementsByClassName('permutation-list');
    for(let i=0;i<problems.length;i++) {
        pid = problems[i].getAttribute('id').split('-')[1]
        show_list_items(problems[i], pid)
    }
}

function show_list_items(problem, pid) {
    var jsonElems = problem.getAttribute('elems');
    var jsonElemsId = problem.getAttribute('elemsId');
    
    var elems = JSON.parse(jsonElems);
    var originalElemsId = JSON.parse(jsonElemsId);
    var elemsId = originalElemsId.map(function(elemId, i) {return 'permutation-item-'+pid+'-'+elemId;});

    const generatedAnswers = document.getElementById('permutation-generated-answers-' + pid);
    generatedAnswers.innerHTML = '';
    originalElemsId.map((elemId, i) => add_hidden_input('permutation-elem-'+pid+'-'+elemId, 'permutation-elem-'+pid+'-'+elemId, i));

    problem.innerHTML = '';
    PermutationTask.generate_permutation_list_with(elemsId, elems, '#permutation-' + pid, function() {
        var elemsPosition = [];
        for(let i=0;i<elemsId.length;i++) {
            const position = document.getElementById(elemsId[i]).getBoundingClientRect().top;
            elemsPosition.push([position, originalElemsId[i]])
        }
        elemsPosition.sort().map((elemPosition, i) => update_hidden_input('permutation-elem-'+pid+'-'+elemPosition[1], i))
    });
}

const hiddenInputFactory = (name, id, value) => {
	const hiddenInput = document.createElement('input')
    hiddenInput.setAttribute('type', 'hidden')
    hiddenInput.setAttribute('name', name)
    hiddenInput.setAttribute('id', id)
    hiddenInput.setAttribute('value', value)
	
	return hiddenInput
}

function add_hidden_input(name, id, value) {
    const generatedAnswers = document.getElementById('permutation-generated-answers-' + pid);
    generatedAnswers.appendChild(hiddenInputFactory(name, id, value));
}

function update_hidden_input(id, value) {
    document.getElementById(id).setAttribute('value', value)
}

function load_input_permutation(submissionid, key, input)
{
    alert('Hello task');
    //generate_permutation_list([Array(110).join(' C-C C+C ') + ';','D','A','B'], '.board-column-content');

    var field = $("form#task input[name='" + key + "']");
    if(key in input)
        $(field).prop('value', input[key]);
    else
        $(field).prop('value', "");
}