/* @flow */
import Row from './Row';

import type { TableStruct } from './struct';


export default class Table {
    // Properties
    id: number;
    rows: Array<Row>;
    onDelete: (number) => (void);

    // Content
    title: string;

    // Flags
    showEnum: boolean; // Propagate in rows

    constructor(id: number, title: string, showEnumeration: boolean, onDelete: (number) => (void), table?: TableStruct = [['', ''], ['', '']]) {
        this.id = id;
        this.rows = [];
        this.title = title;

        this.showEnum = showEnumeration;

        this.onDelete = onDelete;

        // TODO: Fill rows
        // TODO: Build visuals
    }
}
