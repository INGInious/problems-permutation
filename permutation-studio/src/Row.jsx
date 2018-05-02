/* @flow */


export default class Row {
    // Properties
    parentId: number;
    rowId: number;
    dom: HTMLElement; // Lazy initialization
    deleteButton: HTMLElement;
    onDelete: (rowId: number) => void;
    enumContainer: HTMLElement;
    valueTA: HTMLElement;
    valueIdInput: HTMLElement;

    // Content
    value: string;
    valueId: string;

    // Flags
    showEnum: boolean;

    __bindFunctions() {
        this.enable_delete = this.enable_delete.bind(this);
        this.disable_delete = this.disable_delete.bind(this);
        this._get_value_placeholder = this._get_value_placeholder.bind(this);
        this.setId = this.setId.bind(this);
    }

    constructor(parentId: number, id: number, showEnumeration: boolean, value: string = '', valueId: string = '') {
        this.__bindFunctions()

        this.onDelete = (rowId: number) => {
            throw {name : "NotImplementedError", message : "Missing onDelete handler!"};
        };
        
        this.parentId = parentId;
        this.rowId = id;
        this.value = value;
        this.valueId = valueId;
        this.showEnum = showEnumeration;
    }

    setId(newId: number) {
        this.rowId = newId;
        if(this.enumContainer)
            this.enumContainer.innerHTML = ''+(this.rowId + 1);
        this.valueTA.setAttribute('name', `problem[PID][${this.parentId}][text][${this.rowId}]`)
        this.valueIdInput.setAttribute('name', `problem[PID][${this.parentId}][text_id][${this.rowId}]`)
    }

    setHandlers(onDelete: (rowId: number) => void) {
        this.onDelete = onDelete;
    }

    enable_delete() {
        if(!this.dom) return;
        this.deleteButton.setAttribute('title', '')
        this.deleteButton.onclick = (e) => { this.onDelete(this.rowId) } 
        this.deleteButton.removeAttribute('disabled')
    }

    disable_delete() {
        if(!this.dom) return;
        this.deleteButton.setAttribute('disabled', 'disabled')
        this.deleteButton.setAttribute('title', 'You must have at least 2 items')
        this.deleteButton.onclick = (e) => {} 
    }

    _get_value_placeholder(): string {
        switch(this.rowId) {
            case 0:
                return 'Insert text of the first element';
            case 1:
                return 'Insert text of the second element';
            default:
                return 'Insert text of the next element';
        }
    }

    _build_dom() {
        // Lazy initialization
        if(this.dom) return;
        this.dom = document.createElement('tr')

        if(this.showEnum) {
            /* <td class="col-md-1" style="text-align: center;">1</td> */
            this.enumContainer = document.createElement('td')
            this.enumContainer.setAttribute('class', 'col-md-1')
            this.enumContainer.style.textAlign = 'center'
            this.enumContainer.innerHTML = ''+(this.rowId + 1);

            this.dom.appendChild(this.enumContainer)
        }

        /* <td class="col-md-6">
            <textarea id="PID-text0" class="form-control" name="problem[PID][text][0]"
                        placeholder="Insert text of the first element" style="white-space: nowrap;resize: vertical;">
            </textarea>
        </td> */
        var valueContainer = document.createElement('td')
        valueContainer.setAttribute('class', 'col-md-6')
        this.valueTA = document.createElement('textarea')
        this.valueTA.setAttribute('class', 'form-control')
        this.valueTA.setAttribute('name', `problem[PID][${this.parentId}][text][${this.rowId}]`)
        this.valueTA.setAttribute('placeholder', this._get_value_placeholder())
        this.valueTA.style.whiteSpace = 'nowrap';
        this.valueTA.style.resize = 'vertical';
        this.valueTA.innerHTML = this.value;
        valueContainer.appendChild(this.valueTA)

        this.dom.appendChild(valueContainer)

        /* <td class="col-md-4">
            <div class="input-group" style="vertical-align: middle;">
                <span class="input-group-addon" id="PID-addon0">PID-</span>
                <input type="text" id="PID-textid0" name='problem[PID][text_id][0]'
                    placeholder="Enter Id" class="form-control" aria-describedby="PID-addon0" style="min-width: 4em;"/>
            </div>
        </td> */
        var valueIdContainer = document.createElement('td')
        valueIdContainer.setAttribute('class', 'col-md-4')
        var valueIdContCont = document.createElement('div')
        valueIdContCont.setAttribute('class', 'input-group')
        valueIdContCont.style.verticalAlign = 'middle'
        var headSpan = document.createElement('span')
        headSpan.setAttribute('class', 'input-group-addon')
        headSpan.innerHTML = 'PID-';
        valueIdContCont.appendChild(headSpan)
        this.valueIdInput = document.createElement('input')
        this.valueIdInput.setAttribute('class', 'form-control')
        this.valueIdInput.setAttribute('type', 'text')
        this.valueIdInput.setAttribute('name', `problem[PID][${this.parentId}][text_id][${this.rowId}]`)
        this.valueIdInput.setAttribute('placeholder', 'Enter Id')
        this.valueIdInput.style.minWidth = '4em'
        valueIdContCont.appendChild(this.valueIdInput)
        valueIdContainer.appendChild(valueIdContCont)

        this.dom.appendChild(valueIdContainer)

        /* <td class="col-md-1" style="text-align: center;vertical-align: middle;">
            <button id="PID-delete0" type="button" class="btn btn-default" 
                    disabled="disabled" title="You must have at least 2 items">Delete</button>
        </td> */
        var deleteContainer = document.createElement('td')
        deleteContainer.setAttribute('class', 'col-md-1')
        deleteContainer.style.textAlign = 'center'
        deleteContainer.style.verticalAlign = 'middle'
        this.deleteButton = document.createElement('button')
        this.deleteButton.setAttribute('class', 'btn btn-default')
        this.deleteButton.setAttribute('type', 'button')
        this.deleteButton.setAttribute('disabled', 'disabled')
        this.deleteButton.setAttribute('title', 'You must have at least 2 items')
        this.deleteButton.innerHTML = 'Delete';
        deleteContainer.appendChild(this.deleteButton)

        this.dom.appendChild(deleteContainer)
    }

    get_dom() {
        this._build_dom();
        return this.dom;
    }

}