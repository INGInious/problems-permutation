/* @flow */


export const IdManager = new class {
    TPL_TABLES_CONTAINER: string;
    TPL_MISLEADING_CONTAINER: string;
    TPL_TABLE_ITEM: string;
    TPL_TABLE_ITEM_ID: string;

    MISLEADING_TABLE_ID: number;

    pid: string;
    _initialized: boolean;

    constructor() {
        this._initialized = false;

        this.TPL_TABLES_CONTAINER = '$pid-lists-container'
        this.TPL_MISLEADING_CONTAINER = '$pid-misleading-container'
        this.TPL_TABLE_ITEM = '$pid-$table-$item'
        this.TPL_TABLE_ITEM_ID = '$pid-$table-id-$item'

        this.MISLEADING_TABLE_ID = 0
    }

    // Lazy initialization
    init(pid: string) {
        this.pid = pid;
        this._initialized = true;
    }

    stringify(template: string, tableid: string|null = null, itemid: string|null = null) {
        if(!this._initialized) throw 'Uninitialized IdManager';

        var gen_id: string = template.replace('$pid', this.pid);
        if(tableid!=null) gen_id.replace('$table', tableid)
        if(itemid!=null) gen_id.replace('$item', itemid)

	    return gen_id
    }
}
