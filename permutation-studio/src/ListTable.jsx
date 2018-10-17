/* @flow */
import Row from './Row';
import { IdManager } from './IdManager';
import type { TableContent } from './struct';

export class ListTable {
    // Properties
    id: number;
    dom: HTMLElement; // Lazy initialization
    rows: Array<Row>;
    bodyContainer: HTMLElement; // Contains rows DOM
    removeTableButton: HTMLElement; // Contains remove table button DOM
    onDelete: (id: number) => void;

    // Content
    title: string;
    color: string;

    // Flags
    showEnum: boolean; // Propagate in rows

    add_row: (_: void) => void;
    delete_row: (rowId: number) => void;
    enable_delete_table: (_: void) => void;
    disable_delete_table: (_: void) => void;

    __bindFunctions() {
        this.add_row = this.add_row.bind(this)
        this.delete_row = this.delete_row.bind(this);
        this.enable_delete_table = this.enable_delete_table.bind(this);
        this.disable_delete_table = this.disable_delete_table.bind(this);
    }

    constructor(id: number, title: string, color: string, showEnumeration: boolean,
                    rows: TableContent = [['', ''], ['', '']]) {
        this.__bindFunctions()
        
        this.id = id;
        this.rows = [];
        this.title = title;
        this.color = color;
        this.showEnum = showEnumeration;
        this.onDelete = (id: number) => {
            throw {name : "NotImplementedError", message : "Missing onDelete handler!"};
        }

        this._populate_rows(rows)
        this._update_ui()
    }

    _update_ui() {
        // Check if delete buttons can be enabled
        // if(!this.showEnum) { //  || this.rows.length > 2
        for(let i=0;i<this.rows.length;i++)
            this.rows[i].enable_delete()
        // } else {
            // for(let i=0;i<this.rows.length;i++)
                // this.rows[i].disable_delete()
        // }
    }

    _populate_rows(rows: TableContent = [['', ''], ['', '']]) {
        for(let i=0;i<rows.length;i++) {
            var row: Row = new Row(this.id, i, this.showEnum, rows[i][1], rows[i][0]);
            row.setHandlers(
                this.delete_row // onDelete
            )
            this.rows.push(row)
        }
    }

    set_handlers(onDelete: (id: number) => void) {
        this.onDelete = onDelete;
    }

    enable_delete_table() {
        if(!this.removeTableButton) return;
        
        this.removeTableButton.onclick = () => {
            this.onDelete(this.id);
        }
        this.removeTableButton.setAttribute('title', '')
        this.removeTableButton.removeAttribute('disabled')
    }

    disable_delete_table() {
        if(!this.removeTableButton) return;

        this.removeTableButton.setAttribute('disabled', 'disabled')
        this.removeTableButton.setAttribute('title', 'You must have at least one target list')
        this.removeTableButton.onclick = () => {}
    }

    delete_row(rowId: number) {
        var row = this.rows[rowId].get_dom()
        this.bodyContainer.removeChild(row)
        this.rows.splice(rowId, 1)

        for(let i=0;i<this.rows.length;i++) {
            this.rows[i].setId(i);
        }

        this._update_ui()
    }

    add_row() {
        var row: Row = new Row(this.id, this.rows.length, this.showEnum);
        row.setHandlers(
            this.delete_row // onDelete
        )
        this.rows.push(row)
        this.bodyContainer.appendChild(row.get_dom())

        this._update_ui()
    }

    _update_title(newTitle: string) {
        this.title = newTitle;
        if(this.removeTableButton) {
            this.removeTableButton.innerHTML = '<span class="fa fa-fw fa-trash" aria-hidden="true"></span> ' + this.title
        }
    }

    _build_dom() {
        // Lazy initialization
        if(this.dom) return;

        this.dom = document.createElement('div')
        /*
        <div class="" style="height: 3em">
            List name: <input type="text" value="ANSWERS" />
        </div>
         */

        var titleContainer = document.createElement('div');
        
        if(this.showEnum) {
            titleContainer.innerHTML = this.showEnum?"List name: ":"Candidates list name: ";
            var titleInput: HTMLInputElement = document.createElement('input')
            titleInput.setAttribute('name', `problem[${IdManager.pid}][${this.id}][tableName]`)
            titleInput.setAttribute('type', 'text')
            titleInput.setAttribute('value', this.title)
            // $FlowFixMe onfocusout does exist in some navigators
            titleInput.onfocusout = (evt) => {
                this._update_title(evt.target.value);
            }
            titleContainer.appendChild(titleInput)
            
            this.removeTableButton = document.createElement('button')
            this.removeTableButton.setAttribute('class', 'btn btn-danger pull-right')
            this.removeTableButton.innerHTML = '<span class="fa fa-fw fa-trash" aria-hidden="true"></span> ' + this.title
            this.removeTableButton.onclick = () => {
                this.onDelete(this.id);
            }
            titleContainer.appendChild(this.removeTableButton)
        }

        // Color picker
        var pickerContainer = document.createElement('div');
        if(this.showEnum) {
            pickerContainer.innerHTML = "Color: ";
            var pickerInput = document.createElement('input')
            pickerInput.setAttribute('type', 'color')
            pickerInput.setAttribute('name', `problem[${IdManager.pid}][${this.id}][tableColor]`)
            pickerInput.setAttribute('value', this.color)
            pickerContainer.appendChild(pickerInput)
            var pickerStrInput = document.createElement('label')
            pickerStrInput.innerHTML = this.color;
            pickerContainer.appendChild(pickerStrInput)

            pickerInput.onchange = (evt) => {
                pickerStrInput.innerHTML = evt.target.value;
            }
        }

        /*
         <table class="table table-bordered table-hover" id="pid-text-table">
            <thead>
                <tr >
                    <th class="text-center">
                        #
                    </th>
                    <th class="text-center">
                        Text
                    </th>
                    <th class="text-center">
                        Text Id
                    </th>
                </tr>
            </thead>
            ...
         */
        var tableContainer = document.createElement('table')
        tableContainer.setAttribute('class', 'table table-bordered table-hover')
        var tableHead = document.createElement('thead')
        var htmlcode: string;
        if(this.showEnum) htmlcode = '<tr><th class="text-center">#</th>'
        else htmlcode = '<tr>'
        htmlcode += '<th class="text-center">Text</th>' + 
                    '<th class="text-center">Text Id</th></tr>';
        tableHead.innerHTML = htmlcode
        tableContainer.appendChild(tableHead)

        /* tbody */
        this.bodyContainer = document.createElement('tbody')
        for(let i=0;i<this.rows.length;i++)
            this.bodyContainer.appendChild(this.rows[i].get_dom())
        tableContainer.appendChild(this.bodyContainer)

        /* <a id="pid-addrow" class="btn btn-default pull-left">Add Element</a>
            <a id='pid-deleterow' class="pull-right btn btn-default">Delete Row</a> */
        var controlsContainer = document.createElement('div')
        
        var rightButton = document.createElement('a')
        rightButton.setAttribute('class', 'btn btn-secondary')
        rightButton.innerHTML = "Add Element"
        rightButton.onclick = this.add_row;
        controlsContainer.appendChild(rightButton)
        

        // Table
        this.dom.appendChild(titleContainer)
        this.dom.appendChild(pickerContainer)
        this.dom.appendChild(tableContainer)
        // Controls
        this.dom.appendChild(controlsContainer)
        this.dom.appendChild(document.createElement('br'))

        this._update_ui()
    }

    get_dom() : HTMLElement {
        this._build_dom();
        return this.dom;
    }

}
