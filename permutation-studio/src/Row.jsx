/* @flow */


export default class Row {
    // Properties
    onDelete: (void) => (void);

    // Content
    value: string;
    valueId: string;

    // Flags
    showEnum: boolean;

    constructor(id: number, showEnumeration: boolean, value: string = '', valueId: string = '') {
        this.value = value;
        this.valueId = valueId;

        this.showEnum = showEnumeration;

        this.onDelete = () => {};

        // TODO: Build visuals
    }

    set_delete_listener(onDelete: (void) => (void)) {
        this.onDelete = onDelete;
    }

}