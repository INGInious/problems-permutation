/* @flow */
import { ListTable } from './ListTable';

import { getRandomColor } from './utils';
import type { TableStruct } from './struct';


export class TableManager {
    // Properties
    parent: HTMLElement;
    mainContainer: HTMLElement;
    misleadingContainer: HTMLElement;

    tablesCounter: number;
    allTables: Map<number, ListTable>;

    remove_table: (tableId: number) => void;
    _disable_delete_table: (_: void) => void;
    _enable_delete_table: (_: void) => void;

    __bind_functions() {
        this.remove_table = this.remove_table.bind(this)
        this._disable_delete_table = this._disable_delete_table.bind(this)
        this._enable_delete_table = this._enable_delete_table.bind(this)
    }

    constructor(parent: HTMLElement,
                mainTables: {[string] : TableStruct} = 
                        { 'ANSWERS': { title: 'ANSWERS', color: '#659F4A', content: [['',''],['','']] } },
                misleadingTable: TableStruct = { color: '#f9944a', content: [] }) {
        this.__bind_functions()
        // Properties
        this.parent = parent;
        this.tablesCounter = 0;
        this.allTables = new Map();
        
        // Populate tables
        var misleadingTableObject: ListTable = new ListTable(-1, 'Misleading elements',
                                                                misleadingTable.color, false,
                                                                misleadingTable.content);
        this.allTables.set(-1, misleadingTableObject);
        this._populate_tables(mainTables)

        // Create physical objects
        this.mainContainer = document.createElement('div')
        parent.appendChild(this.mainContainer)
        var newTableButton = document.createElement('button')
        newTableButton.setAttribute('class', 'btn btn-success')
        newTableButton.innerHTML = '<span class="glyphicon glyphicon-plus" aria-hidden="true"></span> New Table'
        newTableButton.onclick = () => {
            var tableName = 'List ';
            var counter = this.allTables.size;
            while(this._table_name_exists(tableName + counter)) counter ++;
            this.add_new_table(tableName + counter);
        }
        parent.appendChild(newTableButton)
        parent.appendChild(document.createElement('br'))
        parent.appendChild(document.createElement('br'))
        parent.appendChild(document.createElement('br'))
        this.misleadingContainer = document.createElement('div')
        parent.appendChild(this.misleadingContainer)

        this.make_visible();
    }

    _table_name_exists(tableName: string) {
        this.allTables.forEach((table: ListTable) => {
            if(table.title == tableName) return true;
        })
        return false;
    }

    _get_new_table_id(): number {
        const tableId: number = this.tablesCounter + 1;
        this.tablesCounter ++;

        return tableId;
    }

    _populate_tables(mainTables: {[string] : TableStruct}) {
        Object.keys(mainTables).forEach((title) => {
            const tableId: number = this._get_new_table_id()

            var tableStruct: TableStruct = mainTables[title];
            tableStruct.title = tableStruct.title || title;
            var table: ListTable = new ListTable(tableId, tableStruct.title, tableStruct.color, true, tableStruct.content)
            table.set_handlers(
                this.remove_table // onDelete
            )
            this.allTables.set(tableId, table)
        });
    }

    _disable_delete_table() {
        this.allTables.forEach((table: ListTable, id: number) => {
            if(id >= 0) table.disable_delete_table()
        })
    }

    _enable_delete_table() {
        this.allTables.forEach((table: ListTable, id: number) => {
            if(id >= 0) table.enable_delete_table()
        })
    }

    add_new_table(title: string) {
        const tableId: number = this._get_new_table_id()
        var table: ListTable = new ListTable(tableId, title, getRandomColor(), true)
        table.set_handlers(
            this.remove_table // onDelete
        )
        this.allTables.set(tableId, table)
        this.mainContainer.appendChild(table.get_dom())

        if(this.allTables.size > 2) {
            this._enable_delete_table()
        }
    }

    remove_table(tableId: number) {
        var listTable = this.allTables.get(tableId);
        if(!listTable) return;
        var table: HTMLElement = listTable.get_dom()
        this.allTables.delete(tableId)
        this.mainContainer.removeChild(table)
        if(this.allTables.size <= 2) {
            this._disable_delete_table()
        }
    }

    make_visible() {
        this.allTables.forEach((table, key) => {
            if(key == -1) this.misleadingContainer.appendChild(table.get_dom())
            else this.mainContainer.appendChild(table.get_dom())
        })
    }
}
