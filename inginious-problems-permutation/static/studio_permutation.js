// Event trigger

function studio_init_template_permutation(well, pid, problem) {
    var position = 2;
    var pp = new PermutationProblem(pid, position);

    if ('text' in problem) {
        if (0 in problem['text']) pp.set_row(0, problem['text'][0], problem['textId'][0]);
        if (1 in problem['text']) pp.set_row(1, problem['text'][1], problem['textId'][1]);

        while (position in problem['text']) {
            pp.add_row();
            pp.set_row(position, problem['text'][position], problem['textId'][position]);

            position++;
        }
    }

    pp.add_listeners()
}

// Templates

function stringify(template, pid, item = null) {
    if (item == null) return template.replace('$pid', pid)
    else return template.replace('$pid', pid).replace('$item', item)
}

// -- This ids are linked to the first 2 rows of the html file -- //
const TPL_DYNTABLE = 'tab_logic_$pid'
const TPL_DELETEID = 'permutation-deletebtn-$pid-$item'
const TPL_INPUTTEXT = 'text_$pid_$item'
const TPL_INPUTTEXTID = 'textid_$pid_$item'
const TPL_ADDEDROW = 'addr_$pid_$item'

// Factory objects

const enumerationFactory = (i) => {
    const tableRow = document.createElement('td')
    tableRow.setAttribute('class', 'col-md-1')
    tableRow.style.textAlign = 'center'
    tableRow.style.verticalAlign = 'middle'

    tableRow.innerHTML = i

    return tableRow
}

const inputTextFactory = (pid, i) => {
    const tableRow = document.createElement('td')
    tableRow.setAttribute('class', 'col-md-6')

    const inputText = document.createElement('textarea')
    inputText.setAttribute('id', stringify(TPL_INPUTTEXT, pid, i))
    inputText.setAttribute('class', 'form-control input-md')
    inputText.setAttribute('name', 'problem[' + pid + '][text][' + i + ']')
    inputText.setAttribute('type', 'text')
    inputText.setAttribute('placeholder', 'Insert text of the next element')
    inputText.style.whiteSpace = 'nowrap'
    inputText.style.resize = 'vertical'
    tableRow.appendChild(inputText)

    return tableRow
}

const inputTextIdFactory = (pid, i) => {
    var tableRow = document.createElement('td')
    tableRow.setAttribute('class', 'col-md-4')

    var inputGroup = document.createElement('div')
    inputGroup.setAttribute('class', 'input-group')

    var pidSpan = document.createElement('span')
    pidSpan.setAttribute('class', 'input-group-addon')
    pidSpan.setAttribute('id', pid + '-addon' + i)
    pidSpan.innerHTML = pid + '-'
    inputGroup.appendChild(pidSpan)

    var inputTextId = document.createElement('input')
    inputTextId.setAttribute('id', stringify(TPL_INPUTTEXTID, pid, i))
    inputTextId.setAttribute('class', 'form-control input-md')
    inputTextId.setAttribute('name', 'problem[' + pid + '][textId][' + i + ']')
    inputTextId.setAttribute('type', 'text')
    inputTextId.setAttribute('placeholder', 'Id')
    inputTextId.style.minWidth = '4em'
    inputGroup.appendChild(inputTextId)

    tableRow.appendChild(inputGroup)
    return tableRow
}

const deleteBtnFactory = (pid, i, enabled, that) => {
    const tableRow = document.createElement('td')
    tableRow.setAttribute('class', 'col-md-1')
    tableRow.style.textAlign = 'center'
    tableRow.style.verticalAlign = 'middle'

    const deleteBtn = document.createElement('button')
    deleteBtn.setAttribute('id', stringify(TPL_DELETEID, pid, i))
    deleteBtn.setAttribute('type', 'button')
    deleteBtn.setAttribute('class', 'btn btn-default')
    deleteBtn.innerHTML = 'Delete'
    if (enabled) {
        // UNUSED CODE
        deleteBtn.onclick = (e) => {
            that.remove_row(i)
        }
    } else {
        deleteBtn.setAttribute('disabled', 'disabled')
        deleteBtn.setAttribute('title', 'You must have at least 2 items')
    }
    tableRow.appendChild(deleteBtn)

    return tableRow
}

// Main class

function PermutationProblem(pid, position) {
    this.pid = pid;

    this._idList = [];
    this._position = position;

    // Add empty strings for first ids
    for (let i = 0; i < position; i++) this._idList.push('');
}

// UNUSED
// Generates an Id based on the value of the teachers text statement
PermutationProblem.prototype.generateId = function (value, position) {
    var simpler = value.replace(/\s+/g, '');
    if (simpler.length == 0) {
        var loop = true;
        while (loop) {
            simpler = Math.floor(Math.random() * 1000);
            idx = this._idList.indexOf(simpler);
            loop = idx > -1 && idx != position;
        }
    } else if (simpler.length > 5) {
        simpler = simpler.substring(0, 9);

        var counter = 0;

        var loop = true;
        while (loop) {
            var genId = simpler;
            if (counter > 0) genId += '-' + counter;

            counter++;

            idx = this._idList.indexOf(genId);
            loop = idx > -1 && idx != position;
        }
        counter--;

        if (counter > 0) simpler += '-' + counter;
    }

    return simpler;
}

// Adds listeners to the Add and Delete buttons
PermutationProblem.prototype.add_listeners = function () {
    var that = this;

    //$('#' + stringify(TPL_INPUTTEXT, this.pid, 0)).markItUp({});
    if (false)
        var editor = CodeMirror.fromTextArea(document.getElementById(stringify(TPL_INPUTTEXT, this.pid, 0)), {
            lineNumbers: false,
            lineWrapping: true,
            gutter: true,
            value: '\n'
        });

    $("#add_row_" + this.pid).click(() => {
        that.add_row(this.pid, this._position);
    });
    $('#delete_row_' + this.pid).click(function () {
        that.remove_last();
    });

    // UNUSED CODE
    for (let i = 0; i < this._position; i++) {
        $('#' + stringify(TPL_INPUTTEXT, this.pid, i)).on("change paste keyup", function () {
            return;
            // Do this only if id autogeneration wanted
            var value = $(this).val();
            var newValue = that.generateId(value, i);

            that._idList[i] = newValue;
            $('#' + stringify(TPL_INPUTTEXTID, that.pid, i)).val(newValue);
        });
    }
}

PermutationProblem.prototype.add_row = function () {
    var that = this;

    $('#' + stringify(TPL_ADDEDROW, this.pid, this._position)).html('')
    $('#' + stringify(TPL_ADDEDROW, this.pid, this._position)).append(enumerationFactory(this._position + 1))
    $('#' + stringify(TPL_ADDEDROW, this.pid, this._position)).append(inputTextFactory(this.pid, this._position))
    $('#' + stringify(TPL_ADDEDROW, this.pid, this._position)).append(inputTextIdFactory(this.pid, this._position))
    $('#' + stringify(TPL_ADDEDROW, this.pid, this._position)).append(deleteBtnFactory(this.pid, this._position, false))

    $('#' + stringify(TPL_DYNTABLE, this.pid)).append('<tr id="' + stringify(TPL_ADDEDROW, this.pid, this._position + 1) + '"></tr>')

    // Ids generation
    this._idList.push('')
    this._position++;

    // Verify delete buttons
    if (this._position >= 2) this.enable_all_delete() // Position starts with zero

    // UNUSED CODE
    $('#' + stringify(TPL_INPUTTEXT, this.pid, this._position)).on("change paste keyup", function () {
        return;
        // Do this only if id autogeneration wanted
        var value = $(this).val();
        var newValue = that.generateId(value, that._position);

        that._idList[that._position] = newValue;
        $('#' + stringify(TPL_INPUTTEXTID, that.pid, that._position)).val(newValue);
    });
}

PermutationProblem.prototype.remove_last = function () {
    if (this._position > 2) {
        document.getElementById(stringify(TPL_ADDEDROW, this.pid, this._position - 1)).onclick = () => { }
        $('#' + stringify(TPL_ADDEDROW, this.pid, this._position - 1)).off()
        $('#' + stringify(TPL_ADDEDROW, this.pid, this._position - 1)).html('')

        this._idList.pop();
        this._position--;
    }

    if (this._position <= 2) this.disable_all_delete()
}

PermutationProblem.prototype.remove_row = function (position) {
    if (position >= this._position) {
        // Out of range
        return
    }

    // Update next items
    while ((position + 1) < this._position) {
        var rowText = $('#' + stringify(TPL_INPUTTEXT, this.pid, position + 1)).val()
        var rowTextId = $('#' + stringify(TPL_INPUTTEXTID, this.pid, position + 1)).val()

        $('#' + stringify(TPL_INPUTTEXT, this.pid, position)).val(rowText);
        $('#' + stringify(TPL_INPUTTEXTID, this.pid, position)).val(rowTextId);
        this._idList[position] = this._idList[position + 1]

        position++;
    }

    // Remove excess
    this.remove_last()
}

PermutationProblem.prototype.set_row = function (position, value, valueId) {
    $('#' + stringify(TPL_INPUTTEXT, this.pid, position)).val(value);
    $('#' + stringify(TPL_INPUTTEXTID, this.pid, position)).val(valueId);
}

PermutationProblem.prototype.enable_all_delete = function () {
    if (this._position <= 2) {
        // We must have at least 2 items
        return;
    }

    for (let i = 0; i < this._position; i++)
        this.enable_delete(stringify(TPL_DELETEID, this.pid, i), i)
}

PermutationProblem.prototype.enable_delete = function (node_id, position) {
    var that = this

    node = document.getElementById(node_id);
    node.removeAttribute('disabled');
    node.removeAttribute('title');
    node.onclick = (e) => {
        that.remove_row(position)
    }
}

PermutationProblem.prototype.disable_all_delete = function () {
    if (this._position > 2) {
        // There are too many items, we can't delete
        return;
    }

    for (let i = 0; i < this._position; i++)
        this.disable_delete(stringify(TPL_DELETEID, this.pid, i))
}

PermutationProblem.prototype.disable_delete = function (node_id) {
    node = document.getElementById(node_id)

    node.setAttribute('disabled', 'disabled')
    node.setAttribute('title', 'You must have at least 2 items')
    node.onclick = () => { }
}