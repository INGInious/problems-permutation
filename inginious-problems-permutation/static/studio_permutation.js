// Event trigger

function studio_init_template_permutation(well, pid, problem) {
    var position = 2;
    var dt_position = 0;
    var pp = new PermutationProblem(pid, position, dt_position);

    if ('text' in problem && 'text_id' in problem) {
        if (0 in problem['text']) pp.set_row(0, problem['text'][0], problem['text_id'][0]);
        if (1 in problem['text']) pp.set_row(1, problem['text'][1], problem['text_id'][1]);

        while (position in problem['text']) {
            pp.add_row();
            pp.set_row(position, problem['text'][position], problem['text_id'][position]);

            position++;
        }
    }

    if ('dt' in problem) {
        while (dt_position in problem['dt']) {
            pp.dt_add_row();
            pp.dt_set_row(dt_position, problem['dt'][dt_position], problem['dt_id'][dt_position]);

            dt_position++;
        }
    }

    pp.add_listeners()
}

// Templates

function stringify(template, pid, item = null) {
    if (item == null) return template.replace('$pid', pid)
    else return template.replace('$pid', pid).replace('$item', item)
}

// -- HTML index constants! -- //
const TPL_TABLE = '$pid-text-table'
const TPL_DELETE_ROW = '$pid-delete$item'
const TPL_TEXT = '$pid-text$item'
const TPL_TEXT_ID = '$pid-textid$item'
const TPL_ROW = '$pid-text-row$item'

const TPL_DELETE_LAST = '$pid-deleterow'
const TPL_ADD_ROW = '$pid-addrow';

const TPL_DT_TABLE = '$pid-dt-table'
const TPL_DT_ROW = '$pid-dt-row$item'
const TPL_DT_DELETE_ROW = '$pid-dt-delete$item'
const TPL_DT_TEXT = '$pid-dt-text$item'
const TPL_DT_TEXT_ID = '$pid-dt-textid$item'

const TPL_DT_DELETE_LAST = '$pid-dt-deleterow'
const TPL_DT_ADD_ROW = '$pid-dt-addrow'

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
    inputText.setAttribute('id', stringify(TPL_TEXT, pid, i))
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
    inputTextId.setAttribute('id', stringify(TPL_TEXT_ID, pid, i))
    inputTextId.setAttribute('class', 'form-control input-md')
    inputTextId.setAttribute('name', 'problem[' + pid + '][text_id][' + i + ']')
    inputTextId.setAttribute('type', 'text')
    inputTextId.setAttribute('placeholder', 'Enter Id')
    inputTextId.setAttribute('aria-describedby', pid + '-addon' + i)
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
    deleteBtn.setAttribute('id', stringify(TPL_DELETE_ROW, pid, i))
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

const dtInputTextFactory = (pid, i) => {
    const tableRow = document.createElement('td')
    tableRow.setAttribute('class', 'col-md-6')

    const inputText = document.createElement('textarea')
    inputText.setAttribute('id', stringify(TPL_DT_TEXT, pid, i))
    inputText.setAttribute('class', 'form-control input-md')
    inputText.setAttribute('name', 'problem[' + pid + '][dt][' + i + ']')
    inputText.setAttribute('type', 'text')
    inputText.setAttribute('placeholder', 'Insert text of the next element')
    inputText.style.whiteSpace = 'nowrap'
    inputText.style.resize = 'vertical'
    tableRow.appendChild(inputText)

    return tableRow
}

const dtInputTextIdFactory = (pid, i) => {
    var tableRow = document.createElement('td')
    tableRow.setAttribute('class', 'col-md-4')

    var inputGroup = document.createElement('div')
    inputGroup.setAttribute('class', 'input-group')

    var pidSpan = document.createElement('span')
    pidSpan.setAttribute('class', 'input-group-addon')
    pidSpan.setAttribute('id', pid + '-dt-addon' + i)
    pidSpan.innerHTML = pid + '-'
    inputGroup.appendChild(pidSpan)

    var inputTextId = document.createElement('input')
    inputTextId.setAttribute('id', stringify(TPL_DT_TEXT_ID, pid, i))
    inputTextId.setAttribute('class', 'form-control input-md')
    inputTextId.setAttribute('name', 'problem[' + pid + '][dt_id][' + i + ']')
    inputTextId.setAttribute('type', 'text')
    inputTextId.setAttribute('placeholder', 'Enter Id')
    inputTextId.setAttribute('aria-describedby', pid + '-dt-addon' + i)
    inputTextId.style.minWidth = '4em'
    inputGroup.appendChild(inputTextId)

    tableRow.appendChild(inputGroup)
    return tableRow
}

const dtDeleteBtnFactory = (pid, i, that) => {
    const tableRow = document.createElement('td')
    tableRow.setAttribute('class', 'col-md-1')
    tableRow.style.textAlign = 'center'
    tableRow.style.verticalAlign = 'middle'

    const deleteBtn = document.createElement('button')
    deleteBtn.setAttribute('id', stringify(TPL_DT_DELETE_ROW, pid, i))
    deleteBtn.setAttribute('type', 'button')
    deleteBtn.setAttribute('class', 'btn btn-default')
    deleteBtn.innerHTML = 'Delete'
    // Always enabled button
    deleteBtn.onclick = (e) => {
        that.dt_remove_row(i)
    }
    tableRow.appendChild(deleteBtn)

    return tableRow
}

// Main class

function PermutationProblem(pid, position, dtPosition) {
    this.pid = pid;

    this._idList = [];
    this._position = position;

    this._dt_idList = [];
    this._dt_position = dtPosition;

    // Add empty strings for first ids
    for (let i = 0; i < position; i++) this._idList.push('');
    // Add empty strings for first dt ids
    for (let i = 0; i < dtPosition; i++) this._dt_idList.push('');
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

    // Text table
    $("#" + stringify(TPL_ADD_ROW, this.pid)).click(() => {
        that.add_row(this.pid, this._position);
    });
    $('#' + stringify(TPL_DELETE_LAST, this.pid)).click(function () {
        that.remove_last();
    });

    // Misleading text table
    $("#" + stringify(TPL_DT_ADD_ROW, this.pid)).click(() => {
        that.dt_add_row(this.pid, this._position);
    });
    $('#' + stringify(TPL_DT_DELETE_LAST, this.pid)).click(function () {
        that.dt_remove_last();
    });

    // UNUSED CODE
    for (let i = 0; i < this._position; i++) {
        $('#' + stringify(TPL_TEXT, this.pid, i)).on("change paste keyup", function () {
            return;
            // Do this only if id autogeneration wanted
            var value = $(this).val();
            var newValue = that.generateId(value, i);

            that._idList[i] = newValue;
            $('#' + stringify(TPL_TEXT_ID, that.pid, i)).val(newValue);
        });
    }
}

PermutationProblem.prototype.add_row = function () {
    var that = this;

    $('#' + stringify(TPL_ROW, this.pid, this._position)).html('')
    $('#' + stringify(TPL_ROW, this.pid, this._position)).append(enumerationFactory(this._position + 1))
    $('#' + stringify(TPL_ROW, this.pid, this._position)).append(inputTextFactory(this.pid, this._position))
    $('#' + stringify(TPL_ROW, this.pid, this._position)).append(inputTextIdFactory(this.pid, this._position))
    $('#' + stringify(TPL_ROW, this.pid, this._position)).append(deleteBtnFactory(this.pid, this._position, false))

    $('#' + stringify(TPL_TABLE, this.pid)).append('<tr id="' + stringify(TPL_ROW, this.pid, this._position + 1) + '"></tr>')

    // Ids generation
    this._idList.push('')
    this._position++;

    // Verify delete buttons
    if (this._position >= 2) this.enable_all_delete() // Position starts with zero

    // UNUSED CODE
    $('#' + stringify(TPL_TEXT, this.pid, this._position)).on("change paste keyup", function () {
        return;
        // Do this only if id autogeneration wanted
        var value = $(this).val();
        var newValue = that.generateId(value, that._position);

        that._idList[that._position] = newValue;
        $('#' + stringify(TPL_TEXT_ID, that.pid, that._position)).val(newValue);
    });
}

PermutationProblem.prototype.dt_add_row = function () {
    var that = this;

    $('#' + stringify(TPL_DT_ROW, this.pid, this._dt_position)).html('')
    $('#' + stringify(TPL_DT_ROW, this.pid, this._dt_position)).append(dtInputTextFactory(this.pid, this._dt_position))
    $('#' + stringify(TPL_DT_ROW, this.pid, this._dt_position)).append(dtInputTextIdFactory(this.pid, this._dt_position))
    $('#' + stringify(TPL_DT_ROW, this.pid, this._dt_position)).append(dtDeleteBtnFactory(this.pid, this._dt_position, this))

    $('#' + stringify(TPL_DT_TABLE, this.pid)).append('<tr id="' + stringify(TPL_DT_ROW, this.pid, this._dt_position + 1) + '"></tr>')

    // Ids generation
    this._dt_idList.push('')
    this._dt_position++;

    // Verify delete buttons
    if (this._dt_position >= 1) this.dt_enable_delete() // Position starts with zero
}

PermutationProblem.prototype.remove_last = function () {
    if (this._position > 2) {
        document.getElementById(stringify(TPL_ROW, this.pid, this._position - 1)).onclick = () => { }
        $('#' + stringify(TPL_ROW, this.pid, this._position - 1)).off()
        $('#' + stringify(TPL_ROW, this.pid, this._position - 1)).html('')

        this._idList.pop();
        this._position--;
    }

    if (this._position <= 2) this.disable_all_delete()
}

PermutationProblem.prototype.dt_remove_last = function () {
    if (this._dt_position > 0) {
        document.getElementById(stringify(TPL_DT_ROW, this.pid, this._dt_position - 1)).onclick = () => { }
        $('#' + stringify(TPL_DT_ROW, this.pid, this._dt_position - 1)).off()
        $('#' + stringify(TPL_DT_ROW, this.pid, this._dt_position - 1)).html('')

        this._dt_idList.pop();
        this._dt_position--;
    }

    if (this._dt_position == 0) this.dt_disable_delete()
}

PermutationProblem.prototype.remove_row = function (position) {
    if (position >= this._position) {
        // Out of range
        return
    }

    // Update next items
    while ((position + 1) < this._position) {
        var rowText = $('#' + stringify(TPL_TEXT, this.pid, position + 1)).val()
        var rowTextId = $('#' + stringify(TPL_TEXT_ID, this.pid, position + 1)).val()

        $('#' + stringify(TPL_TEXT, this.pid, position)).val(rowText);
        $('#' + stringify(TPL_TEXT_ID, this.pid, position)).val(rowTextId);
        this._idList[position] = this._idList[position + 1]

        position++;
    }

    // Remove excess
    this.remove_last()
}

PermutationProblem.prototype.dt_remove_row = function (position) {
    if (position >= this._dt_position) {
        // Out of range
        return
    }

    // Update next items
    while ((position + 1) < this._dt_position) {
        var rowText = $('#' + stringify(TPL_DT_TEXT, this.pid, position + 1)).val()
        var rowTextId = $('#' + stringify(TPL_DT_TEXT_ID, this.pid, position + 1)).val()

        $('#' + stringify(TPL_DT_TEXT, this.pid, position)).val(rowText);
        $('#' + stringify(TPL_DT_TEXT_ID, this.pid, position)).val(rowTextId);
        this._dt_idList[position] = this._dt_idList[position + 1]

        position++;
    }

    // Remove excess
    this.dt_remove_last()
}

PermutationProblem.prototype.set_row = function (position, value, valueId) {
    $('#' + stringify(TPL_TEXT, this.pid, position)).val(value);
    $('#' + stringify(TPL_TEXT_ID, this.pid, position)).val(valueId);
}

PermutationProblem.prototype.dt_set_row = function (position, value, valueId) {
    $('#' + stringify(TPL_DT_TEXT, this.pid, position)).val(value);
    $('#' + stringify(TPL_DT_TEXT_ID, this.pid, position)).val(valueId);
}

PermutationProblem.prototype.enable_all_delete = function () {
    if (this._position <= 2) {
        // We must have at least 2 items
        return;
    }

    // Enable 'Delete last row'
    this.enable_delete(stringify(TPL_DELETE_LAST, this.pid))

    for (let i = 0; i < this._position; i++)
        this.enable_delete(stringify(TPL_DELETE_ROW, this.pid, i), i)
}

PermutationProblem.prototype.dt_enable_delete = function () {
    node_id = stringify(TPL_DT_DELETE_LAST, this.pid)
    node = document.getElementById(node_id)
    node.removeAttribute('disabled')
    node.removeAttribute('title')
}

PermutationProblem.prototype.enable_delete = function (node_id, position=null) {
    var that = this

    node = document.getElementById(node_id);
    node.removeAttribute('disabled');
    node.removeAttribute('title');
    if (position != null) {
        node.onclick = (e) => {
            that.remove_row(position)
        }
    }
}

PermutationProblem.prototype.disable_all_delete = function () {
    if (this._position > 2) {
        // There are too many items, we can't delete
        return;
    }

    // Disable 'Delete last row'
    this.disable_delete(stringify(TPL_DELETE_LAST, this.pid))

    for (let i = 0; i < this._position; i++)
        this.disable_delete(stringify(TPL_DELETE_ROW, this.pid, i))
}

PermutationProblem.prototype.dt_disable_delete = function () {
    node_id = stringify(TPL_DT_DELETE_LAST, this.pid)
    node = document.getElementById(node_id)

    node.setAttribute('disabled', 'disabled')
}

PermutationProblem.prototype.disable_delete = function (node_id) {
    node = document.getElementById(node_id)

    node.setAttribute('disabled', 'disabled')
    node.setAttribute('title', 'You must have at least 2 items')
    node.onclick = () => { }
}