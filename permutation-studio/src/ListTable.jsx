/* @flow */
import Row from './Row';
import type { TableStruct } from './struct';

export class ListTable {
    // Properties
    id: number;
    dom: HTMLElement; // Lazy initialization
    rows: Array<Row>;
    bodyContainer: HTMLElement; // Contains rows DOM
    onDelete: (id: number) => void;

    // Content
    title: string;

    // Flags
    showEnum: boolean; // Propagate in rows

    __bindFunctions() {
        this.delete_row = this.delete_row.bind(this);
    }

    constructor(id: number, title: string, showEnumeration: boolean,
                    rows: TableStruct = [['', ''], ['', '']]) {
        this.__bindFunctions()
        
        this.id = id;
        this.rows = [];
        this.title = title;
        this.showEnum = showEnumeration;
        this.onDelete = (id: number) => {
            throw {name : "NotImplementedError", message : "Missing onDelete handler!"};
        }

        this._populate_rows(rows)
        this._update_ui()
    }

    _update_ui() {
        // Check if delete buttons can be enabled
        if(!this.showEnum || this.rows.length > 2) {
            for(let i=0;i<this.rows.length;i++)
                this.rows[i].enable_delete()
        } else {
            for(let i=0;i<this.rows.length;i++)
                this.rows[i].disable_delete()
        }
    }

    _populate_rows(rows: TableStruct = [['', ''], ['', '']]) {
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

    delete_row(rowId: number) {
        var row = this.rows[rowId].get_dom()
        this.bodyContainer.removeChild(row)
        this.rows.splice(rowId, 1)

        for(let i=0;i<this.rows.length;i++) {
            this.rows[i].setId(i);
        }

        this._update_ui()
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
        titleContainer.innerHTML = "List name: "
        var titleInput = document.createElement('input')
        titleInput.setAttribute('type', 'text')
        titleInput.setAttribute('value', this.title)
        titleContainer.appendChild(titleInput)

        /*
         <table class="table table-bordered table-hover" id="PID-text-table">
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

        this.dom.appendChild(titleContainer)
        this.dom.appendChild(tableContainer)
        this._update_ui()
    }

    get_dom() : HTMLElement {
        this._build_dom();
        return this.dom;
    }

}
