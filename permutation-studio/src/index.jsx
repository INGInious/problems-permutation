/* @flow */
import { IdManager } from './IdManager';
import { TableManager } from './TableManager';

import type { TableStruct } from './struct';


export function init_ui(pid: string, mainTables?: {[string] : TableStruct}, misleadingTable?: TableStruct) {
    IdManager.init(pid);

    var nullTablesContainer: HTMLElement|null = document.getElementById(IdManager.stringify(IdManager.TPL_TABLES_CONTAINER))
    if(nullTablesContainer==null) return;
    var tablesContainer: HTMLElement = nullTablesContainer;

    var nullMisleadingContainer: HTMLElement|null = document.getElementById(IdManager.stringify(IdManager.TPL_MISLEADING_CONTAINER))
    if(nullMisleadingContainer==null) return;
    var misleadingContainer: HTMLElement = nullMisleadingContainer;

    var tableManager = new TableManager(tablesContainer, misleadingContainer, mainTables, misleadingTable);
}
