/* @flow */
import { ListTable } from './ListTable';

import type { TableStruct } from './struct';


export class TableManager {
    // Properties
    parent: HTMLElement;
    mainContainer: HTMLElement;
    misleadingContainer: HTMLElement;

    mainTables: Array<ListTable>;
    misleadingTable: ListTable;

    // DOM
    tablesContainers: {[ListTable]: HTMLElement};
    containerTables: {[HTMLElement]: ListTable|null};

    constructor(parent: HTMLElement,
                mainTables: {[string] : TableStruct} = {'ANSWERS': [['',''],['','']]},
                misleadingTable: TableStruct = []) {
        // Properties
        this.parent = parent;
        this.mainTables = [];
        Object.keys(mainTables).forEach((title) => {
            var table: ListTable = new ListTable(title, true, mainTables[title])
            table.set_delete_listener(() => {
                this.remove_table(table)
            })
            this.mainTables.push(table)
        });
        this.misleadingTable = new ListTable('Misleading elements', false, misleadingTable);

        this.mainContainer = document.createElement('div')
        parent.appendChild(this.mainContainer)

        this.misleadingContainer = document.createElement('div')
        parent.appendChild(this.misleadingContainer)

        // DOM
        tablesContainers = {}
        containerTables = {}

        this.tablesContainers[this.misleadingTable] = this.misleadingContainer;
        this.containerTables[this.misleadingContainer] = this.misleadingTable;
    }

    add_new_table(title: string) {
        var table: ListTable = new ListTable(title, true)
        table.set_delete_listener(()=>{
            this.remove_table(table)
        })
        this.mainTables.push(table)
    }

    remove_table(table: ListTable) {
    }

    render() {
        // TODO: Check free containers, if not then create container.
        // TODO: Edit button listeners
    }
}
