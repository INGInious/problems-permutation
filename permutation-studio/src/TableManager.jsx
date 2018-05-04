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

    constructor(parent: HTMLElement,
                mainTables: {[string] : TableStruct} = 
                        { 'ANSWERS': { title: 'ANSWERS', color: '#659F4A', content: [['',''],['','']] } },
                misleadingTable: TableStruct = { color: '#f9944a', content: [] }) {
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
        this.misleadingContainer = document.createElement('div')
        parent.appendChild(this.misleadingContainer)

        this.make_visible();
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

    add_new_table(title: string) {
        const tableId: number = this._get_new_table_id()
        var table: ListTable = new ListTable(tableId, title, getRandomColor(), true)
        table.set_handlers(
            this.remove_table // onDelete
        )
        this.allTables.set(tableId, table)
    }

    remove_table(tableId: number) {
    }

    make_visible() {
        this.allTables.forEach((table, key) => {
            if(key == -1) this.misleadingContainer.appendChild(table.get_dom())
            else this.mainContainer.appendChild(table.get_dom())
        })
    }
}
