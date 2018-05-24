/* @flow */
import Muuri from 'muuri';
import { IdManager } from './IdManager';
import Item from './Item';
import { USE_SACK_ALGORITHM } from './flags'
import { WindowScroller } from './WindowScroller';


export default class GridSystem {
	columnGrids : Array<Muuri>;
	boardGrid : Muuri;
	
	isAnswer: Array<boolean>;
	answerItems: Map<string, Set<Item> >;
	candidateItems: Set<Item>;
	itemsMap: {[string]: Item};
	itemsPosMap: Map<string, Item>;

	candidatesTableName: string;
	answersTablesNames: Array<string>;
	muuris: Map<string, Muuri>;
	containers: Map<string, HTMLElement>;

	sortItems: (items: Array<string> ,itemsPos: Array<string>) => void;
	generate_muuri: (tableName: string, container: HTMLElement, include_item: (Item)=>void) => void;

	__bind_functions() {
		this.sortItems = this.sortItems.bind(this);
		this.generate_muuri = this.generate_muuri.bind(this);
	}

	constructor(listsContainer: HTMLElement, items: Array<Item>, tablesMetadata: Array<[string,string]>) {
		this.__bind_functions();
		var that = this;

		this.candidatesTableName = tablesMetadata[0][0];
		this.answersTablesNames = tablesMetadata.slice(1).map((pair) => pair[0])
		this.muuris = new Map();
		this.containers = new Map();

		// Add mapped items and sets
		this.answerItems = new Map();
		this.candidateItems = new Set();
		this.itemsMap = {};
		this.itemsPosMap = new Map();
		for(let i=0;i<items.length;i++) {
			this.itemsMap[items[i].get_id()] = items[i];
			this.itemsPosMap.set(items[i].get_pos_id(), items[i])
			
			// Add all items as candidates
			this.candidateItems.add(items[i]);
		}

		this.columnGrids = []

		for(var tableId=1;tableId < tablesMetadata.length;tableId++) {
			const metadata = tablesMetadata[tableId];
			const tableName = metadata[0];
			const tableColor = metadata[1];

			var container = document.createElement('div');
			container.setAttribute('class', 'permutation-column')

			var headerContainer = document.createElement('div');
			headerContainer.setAttribute('class', 'permutation-column-header unselectable');
			headerContainer.style.background = tableColor;
			var header = document.createElement('span')
			header.setAttribute('class', 'glyphicon glyphicon-th-list')
			headerContainer.appendChild(header);
			headerContainer.innerHTML += `<b> ${tableName}</b>`;

			let gridContainer = document.createElement('div');
			gridContainer.setAttribute('class', 'permutation-column-content')
			
			container.appendChild(headerContainer)
			container.appendChild(gridContainer)
			listsContainer.appendChild(container);

			this.add_table(gridContainer, tableName, tableColor, tablesMetadata);
		}

		var container2 = document.createElement('div');
		container2.setAttribute('class', 'permutation-column')

		var headerContainer2 = document.createElement('div');
		headerContainer2.setAttribute('class', 'permutation-column-header unselectable');
		headerContainer2.style.background = tablesMetadata[0][1];
		var header2 = document.createElement('span')
		header2.setAttribute('class', 'glyphicon glyphicon-trash')
		headerContainer2.appendChild(header2);
		headerContainer2.innerHTML += `<b> ${tablesMetadata[0][0]}</b>`;

		let candidatesContainer = document.createElement('div');
		candidatesContainer.setAttribute('class', 'permutation-column-content')
		candidatesContainer.setAttribute('id', `${IdManager.pid}-candidates`)

		this.populate_items(items, candidatesContainer);
		
		container2.appendChild(headerContainer2)
		container2.appendChild(candidatesContainer)
		listsContainer.appendChild(container2);
        
		this.generate_muuri(this.candidatesTableName, candidatesContainer, 
			(item:Item) => { // Include item
				for(var tableId=1;tableId < tablesMetadata.length;tableId++) {
					const metadata = tablesMetadata[tableId];
					const tableName = metadata[0];
				
					var table = that.answerItems.get(tableName);
					if(!table) {
						console.error(`Undefined table ${tableName}`)
						continue;
					} else if(table.has(item)) {
						// WARNING does 'delete' works in all browsers?
						table.delete(item);

						var sorted: Array<Item> = that.get_sorted_items(table);
						for(let i=0;i<sorted.length;i++) {
							sorted[i].update_position(tableName, i+1);// Starts in 1
						}
					}
				}
				that.candidateItems.add(item);
				
				if(USE_SACK_ALGORITHM) {
					item.update_position(tablesMetadata[0][0], -1); // Candidates bag
				} else {
					var sorted: Array<Item> = that.get_sorted_items(that.candidateItems);
					for(let i=0;i<sorted.length;i++) {
						sorted[i].update_position(tablesMetadata[0][0], -i-1); // Candidates bag
					}
				}
			});
		this.boardGrid = new Muuri('.permutation', {
			layoutDuration: 400,
			layoutEasing: 'ease',
			dragEnabled: false,
			dragSortInterval: 0,
			dragStartPredicate: {
				handle: '.permutation-column-header'
			},
			dragReleaseDuration: 400,
			dragReleaseEasing: 'ease'
		});
	}

	// @external
	sortItems(items: Array<string>, itemsPos: Array<string>) {
		// Remove all candidates
		var candidatesMuuri: Muuri = this.muuris.get(this.candidatesTableName);
		var tmpContainer = this.containers.get(this.candidatesTableName);
		if(!tmpContainer) {
			console.error('Candidates container not found')
			return;
		}
		var candidatesContainer: HTMLElement = tmpContainer;
		this.candidateItems.forEach((item: Item) => {
			candidatesMuuri.remove(0);	
			candidatesContainer.removeChild(item.get_card());
		})
		// Remove all current answers
		for(var i=0;i<this.answersTablesNames.length;i++) {
			var tableName = this.answersTablesNames[i]

			var muuriGrid = this.muuris.get(tableName)
			var container = this.containers.get(tableName)
			var itemSet = this.answerItems.get(tableName)
			
			if(!itemSet || !muuriGrid || !container) {
				console.error('Item not found!')
				continue;
			}

			itemSet.forEach((item: Item) => {
				muuriGrid.remove(0);
				container.removeChild(item.get_card())
			})
		}
		// Removing items logically
		this.candidateItems.clear();
		this.answerItems.forEach((items: Set<Item>) => {
			items.clear();
		})

		// Computing new positions
		var mappedOrder: Map<string, Map<number, Item> > = new Map();
		mappedOrder.set(this.candidatesTableName, new Map());
		this.answersTablesNames.forEach((tableName: string) => {
			mappedOrder.set(tableName, new Map());
		})
		console.log(this.itemsPosMap)
		items.map((itemId: string, i: number) => {
			if(!this.itemsPosMap.has(itemId)) {
				// console.log(`Not found item ${itemId}`)
				return;
			}

			var item = this.itemsPosMap.get(itemId);
			var itemPos: string = itemsPos[i];
			var sepPos = itemPos.lastIndexOf("#");

			var tableName = itemPos.substring(0, sepPos);
			var pos = parseInt(itemPos.substring(sepPos+1));

			var map = mappedOrder.get(tableName);
			
			if(!map) {
				console.error(`Error loading map from table "${tableName}"`);
				return;
			}
			if(!item) {
				console.error(`Error loading item "${itemId}"`);
				return;
			}

			// Add items logically
			if(tableName == this.candidatesTableName) {
				this.candidateItems.add(item)
				item.update_position(tableName, -pos)
			} else {
				var tableItems = this.answerItems.get(tableName)
				if(!tableItems) console.error('Could not find items table')
				else tableItems.add(item)
				item.update_position(tableName, pos)
			}

			if(map.has(pos))
				 // FIXME: When using SACK_ALGORITHM, all the candidates have the same position (1)
				 // Then they all overlap in this map
				map.set(map.size+1, item)
			map.set(pos, item)
		});
		var newOrder: {[string]: Array<Item>} = {};
		mappedOrder.forEach((posMap: Map<number, Item>, tableName: string) => {
			var sortedItems: Array<Item> = [...posMap.entries()].sort((a: [number, Item], b: [number, Item]) => {
				return a[0] > b[0] ? 1:-1; // Assuming non repeated keys
			}).map((pair: [number, Item]) => { return pair[1]; });
			newOrder[tableName] = sortedItems;
		});
		// Repopulating with DOM elements
		candidatesMuuri.add(newOrder[this.candidatesTableName].map((item: Item) => {return item.get_card()}));
		for(var i=0;i<this.answersTablesNames.length;i++) {
			var tableName = this.answersTablesNames[i];

			var muuri = this.muuris.get(tableName)
			if(!muuri) {
				console.error(`Could not find muuri for table ${tableName}`);
				continue;
			}
			muuri.add(newOrder[tableName].map((item: Item) => {return item.get_card()}));
		}
	}

	populate_items(items: Array<Item>, container: HTMLElement) {
		for(var i=0;i<items.length;i++) {
			container.appendChild(items[i].get_card())
		}
	}

	add_table(container: HTMLElement, tableName: string, tableColor: string, tablesMetadata: Array<[string, string]>) {
		var that = this;
		this.answerItems.set(tableName, new Set());
		
		this.generate_muuri(tableName, container, (item:Item) => {
			if(that.candidateItems.has(item)) {
				// WARNING does 'delete' works in all browsers?
				that.candidateItems.delete(item);

				if(!USE_SACK_ALGORITHM) {
					var sorted: Array<Item> = that.get_sorted_items(that.candidateItems);
					for(let i=0;i<sorted.length;i++) {
						sorted[i].update_position(tablesMetadata[0][0], -i-1); // Candidates bag
					}
				}
			}
			// Remove from other tables
			for(var tableId=1;tableId < tablesMetadata.length;tableId++) {
				const metadata = tablesMetadata[tableId];
				const otherTableName = metadata[0];
				if(otherTableName == tableName) continue;
			
				var table = that.answerItems.get(otherTableName);
				if(!table) {
					console.error(`Undefined table ${otherTableName}`)
					continue;
				} else if(table.has(item)) {
					// WARNING does 'delete' works in all browsers?
					table.delete(item);

					var sorted: Array<Item> = that.get_sorted_items(table);
					for(let i=0;i<sorted.length;i++) {
						sorted[i].update_position(otherTableName, i+1);// Starts in 1
					}
				}
			}

			var table = that.answerItems.get(tableName)
			if(table) {
				table.add(item);

				var sorted: Array<Item> = that.get_sorted_items(table);
				for(let i=0;i<sorted.length;i++) {
					sorted[i].update_position(tableName, i+1);// Starts in 1
				}
			} else console.error(`Undefined table ${tableName}`);
		});
	}

	get_sorted_items(unsorted: Set<Item>) {
		var sorted: Array<Item> = [];

		var posItemPair: Array<[number, Item]> = [];
		unsorted.forEach(function(item) {
			posItemPair.push([item.get_y(), item]);
		});
		
		posItemPair = posItemPair.sort(function(a:[number, Item], b:[number, Item]): number {
			return a[0] > b[0]? 1: -1;
		});
		
		for(let i=0;i<posItemPair.length;i++) sorted.push(posItemPair[i][1]);

		return sorted;
	}

	generate_muuri(tableName: string, container: HTMLElement, include_item: (Item)=>void) {
		var that = this;

		var grid = new Muuri(container, {
			items: '.permutation-item',
			layoutDuration: 400,
			layoutEasing: 'ease',
			dragEnabled: true,
			dragSort: function () {
				return that.columnGrids;
			},
			dragSortInterval: 0,
			dragContainer: document.body, // TODO: can we drag items in the whole body?
			dragReleaseDuration: 400,
			dragReleaseEasing: 'ease'
		})
		.on('dragStart', function (item) {
			// Let's set fixed widht/height to the dragged item
			// so that it does not stretch unwillingly when
			// it's appended to the document body for the
			// duration of the drag.
			item.getElement().style.width = item.getWidth() + 'px';
			item.getElement().style.height = item.getHeight() + 'px';
			WindowScroller.enableListener(item._child.getAttribute('id'));
			//console.log('Pressed element ' + item._child.getAttribute('name') + ' at ' + name);
		})
		.on('dragReleaseEnd', function (item) {
			// Let's remove the fixed width/height from the
			// dragged item now that it is back in a grid
			// column and can freely adjust to it's
			// surroundings.
			item.getElement().style.width = '';
			item.getElement().style.height = '';
			// Just in case, let's refresh the dimensions of all items
			// in case dragging the item caused some other items to
			// be different size.
			that.columnGrids.forEach(function (grid) {
				grid.refreshItems();
			});
			WindowScroller.disableListener(item._child.getAttribute('id'));
			if(include_item!=null) include_item(that.itemsMap[item._child.getAttribute('id')]);
			//console.log('Released element ' + item._child.getAttribute('name'));
		})
		.on('layoutStart', function () {
			// Let's keep the board grid up to date with the
			// dimensions changes of column grids.
			that.boardGrid.refreshItems().layout();
		});

		that.columnGrids.push(grid);
		that.muuris.set(tableName, grid)
		that.containers.set(tableName, container)
	}
}