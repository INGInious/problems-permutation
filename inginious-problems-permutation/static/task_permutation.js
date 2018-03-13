
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
        // Decode data
        var elems = JSON.parse(jsonElems);
        var elemsId = JSON.parse(jsonElemsId);

        PermutationTaskUI.generate_ui(ptype, pid, elems, elemsId);
    }
}

// Templates

const TPL_LISTID = 'permutation-$pid';
const TPL_CARDID = 'permutation-item-$pid-$item';
const TPL_INPUTS = 'permutation-input-$pid';
const TPL_INPUTID = 'permutation-input-$pid-$item';

// Factory elements

const hiddenInputFactory = (name, id, value) => {
	const hiddenInput = document.createElement('input')
    hiddenInput.setAttribute('type', 'hidden')
    hiddenInput.setAttribute('name', name)
    hiddenInput.setAttribute('id', id)
    hiddenInput.setAttribute('value', value)
	
	return hiddenInput
}

// Main class

function PermutationTask(pid, problem_node) {
    this.pid = pid;
    this.problem_node = problem_node;
}

PermutationTask.prototype.stringify = function(template, itemId = null) {
    if (itemId == null) return template.replace('$pid', this.pid);
    else return template.replace('$pid', this.pid).replace('$item', itemId);
}

PermutationTask.prototype.generate_ui = function() {
    var that = this;

    // Get items data
    var jsonElems = this.problem_node.getAttribute('elems');
    var jsonElemsId = this.problem_node.getAttribute('elemsId');
    // Decode data
    var elems = JSON.parse(jsonElems);
    var originalElemsId = JSON.parse(jsonElemsId);
    var elemsId = originalElemsId.map(function(elemId, i) {return that.stringify(TPL_CARDID, elemId);});

    // Add a hidden input for every item
    const generatedAnswers = document.getElementById(this.stringify(TPL_INPUTS));
    generatedAnswers.innerHTML = '';
    originalElemsId.map((elemId, i) => this.add_hidden_input(this.pid + '-' + elemId, this.stringify(TPL_INPUTID, elemId), i+1));

    // Generate UI/UX
    this.problem_node.innerHTML = '';
    PermutationTaskUI.generate_permutation_list_with(elemsId, elems, '#' + this.stringify(TPL_LISTID), function() {
        // -- Drop element listener --
        // Update elements order
        var elemsPosition = [];
        for(let i=0;i<elemsId.length;i++) {
            const position = document.getElementById(elemsId[i]).getBoundingClientRect().top;
            elemsPosition.push([position, originalElemsId[i]])
        }
        elemsPosition.sort().map((elemPosition, i) => that.update_hidden_input(that.stringify(TPL_INPUTID, elemPosition[1]), i+1))
    });
}

PermutationTask.prototype.add_hidden_input = function(name, id, value) {
    const generatedAnswers = document.getElementById(this.stringify(TPL_INPUTS));
    generatedAnswers.appendChild(hiddenInputFactory(name, id, value));
}

PermutationTask.prototype.update_hidden_input = function(id, value) {
    document.getElementById(id).setAttribute('value', value)
}


function load_input_permutation(submissionid, key, input)
{
    // Previous submissions
    console.log('Input: ' + JSON.stringify(input))
    // TODO
    //generate_permutation_list([Array(110).join(' C-C C+C ') + ';','D','A','B'], '.board-column-content');

    var field = $("form#task input[name='" + key + "']");
    if(key in input)
        $(field).prop('value', input[key]);
    else
        $(field).prop('value', "");
}