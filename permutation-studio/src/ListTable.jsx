/* @flow */
import Row from './Row';

import type { TableStruct } from './struct';

export class ListTable {
    // Properties
    id: number;
    dom: HTMLElement; // Lazy initialization
    rows: Array<Row>;
    onDelete: (id: number) => void;

    // Content
    title: string;

    // Flags
    showEnum: boolean; // Propagate in rows

    constructor(id: number, title: string, showEnumeration: boolean,
                tableStr: TableStruct = [['', ''], ['', '']]) {
        this.id = id;
        this.rows = [];
        this.title = title;

        this.showEnum = showEnumeration;

        this.onDelete = (id: number) => {
            throw {name : "NotImplementedError", message : "Missing onDelete handler!"};
        }

        for(let i=0;i<tableStr.length;i++) {
            var row: Row = new Row(i, this.showEnum, tableStr[i][0], tableStr[i][1]);
            row.set_delete_listener(()=>{
                this.delete_row(row)
            })
            this.rows.push(row)
        }
    }

    set_handlers(onDelete: (id: number) => void) {
        this.onDelete = onDelete;
    }

    delete_row(row: Row) {
    }

    _build_dom() {
        // Lazy initialization
        if(this.dom) return;

        this.dom = document.createElement('div')
        // TODO: Fill dom
    }

    get_dom() : HTMLElement {
        this._build_dom();
        return this.dom;
    }

}
