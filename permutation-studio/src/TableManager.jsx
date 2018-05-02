/* @flow */
import { ListTable } from './ListTable';

import type { TableStruct } from './struct';


export class TableManager {
    // Properties
    parent: HTMLElement;
    mainContainer: HTMLElement;
    misleadingContainer: HTMLElement;

    tablesCounter: number;
    allTables: Map<number, ListTable>;

    // DOM
    // TODO: Remove this
    // tablesContainers: {[ListTable]: HTMLElement};// TODO: Probably don't need this
    // containerTables: {[HTMLElement]: ListTable|null};

    constructor(parent: HTMLElement,
                mainTables: {[string] : TableStruct} = {'ANSWERS': [['',''],['','']]},
                misleadingTable: TableStruct = []) {
        // Properties
        this.parent = parent;
        this.tablesCounter = 0;
        this.allTables = new Map();
        
        // Populate tables
        var misleadingTableObject: ListTable = new ListTable(-1, 'Misleading elements', false, misleadingTable);
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

            var table: ListTable = new ListTable(tableId, title, true, mainTables[title])
            table.set_handlers(
                this.remove_table // onDelete
            )
            this.allTables.set(tableId, table)
        });
    }

    add_new_table(title: string) {
        const tableId: number = this._get_new_table_id()
        var table: ListTable = new ListTable(tableId, title, true)
        table.set_handlers(
            this.remove_table // onDelete
        )
        this.allTables.set(tableId, table)
    }

    remove_table(tableId: number) {
    }

    /* @Deprecated
    render_table(table: ListTable) {
        // TODO: Edit button listeners
        var renderDone = false;
        
        Object.keys(this.containerTables).forEach((container) => {
            if(!renderDone && this.containerTables[container]==null) {
                table.render_at(container);

                renderDone = true;
            }
        });

        if(renderDone) return;

        var newContainer = document.createElement('div');
        this.mainContainer.appendChild(newContainer);

        // this.tablesContainers[table] = newContainer;
        this.containerTables[newContainer] = table;

        table.render_at(newcontainer);

        renderDone = true;
    } */

    make_visible() {
        this.allTables.forEach((table, key) => {
            if(key == -1) this.misleadingContainer.appendChild(table.get_dom())
            else this.mainContainer.appendChild(table.get_dom())
        })
    }
}
