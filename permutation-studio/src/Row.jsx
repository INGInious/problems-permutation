/* @flow */


export default class Row {
    // Properties
    id: number;
    onDelete: (number) => (void);

    // Content
    value: string;
    valueId: string;

    // Flags
    showEnum: boolean;

    constructor(id: number, onDelete: (number) => (void), showEnumeration: boolean, value?: string = '', valueId?: string = '') {
        this.id = id;
        this.value = value;
        this.valueId = valueId;

        this.showEnum = showEnumeration;

        this.onDelete = onDelete;

        // TODO: Build visuals
    }

}