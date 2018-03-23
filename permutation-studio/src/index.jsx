/* @flow */
import { IdManager } from './IdManager';

import type { TableStruct } from './struct';


export function init_ui(pid: string, mainTables: {[string] : TableStruct}, misleadingTable: TableStruct) {
    IdManager.init(pid);
}
