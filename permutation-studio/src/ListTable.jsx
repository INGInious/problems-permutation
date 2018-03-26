/* @flow */
import Row from './Row';

import type { TableStruct } from './struct';


export class ListTable {
    // Properties
    rows: Array<Row>;
    onDelete: (void) => (void);

    // Content
    title: string;

    // Flags
    showEnum: boolean; // Propagate in rows

    constructor(title: string, showEnumeration: boolean,
                tableStr: TableStruct = [['', ''], ['', '']]) {
        this.rows = [];
        this.title = title;

        this.showEnum = showEnumeration;

        this.onDelete = () => {};

        for(let i=0;i<tableStr.length;i++) {
            var row: Row = new Row(i, this.showEnum, tableStr[i][0], tableStr[i][1]);
            row.set_delete_listener(()=>{
                this.delete_row(row)
            })
            this.rows.push(row)
        }
        // TODO: Build visuals
    }

    set_delete_listener(onDelete: (void)=>(void)) {
        this.onDelete = onDelete;
    }

    delete_row(row: Row) {
    }

}
