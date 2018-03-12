/* @flow */


export const IdManager = new class {
    TPL_ANSWER_CONTAINER: string;
    TPL_CANDIDATES_CONTAINER: string;
    TPL_HIDDEN_INPUTS: string;

    pid: string;
    _initialized: boolean;

    constructor() {
        this._initialized = false;

        this.TPL_ANSWER_CONTAINER = '$pid-answer'
        this.TPL_CANDIDATES_CONTAINER = '$pid-candidates'
        this.TPL_HIDDEN_INPUTS = '$pid-hidden-inputs'
    }

    // Lazy initialization
    init(pid: string) {
        this.pid = pid;
        this._initialized = true;
    }

    stringify(template: string, itemid: string|null = null) {
        if(!this._initialized) throw 'Uninitialized IdManager';

        if(itemid==null) return template.replace('$pid', this.pid)
	    else return template.replace('$pid', this.pid).replace('$item', itemid)
    }
}
