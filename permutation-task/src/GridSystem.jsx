/* @flow */
import Muuri from 'muuri';
import { IdManager } from './IdManager';
import Item from './Item';


export default class GridSystem {
	columnGrids : Array<Muuri>;
    boardGrid : Muuri;
	
	isAnswer: Array<boolean>;
	answerItems: Set<Item>;
	candidateItems: Set<Item>;
	itemsMap: {[string]: Item};

	constructor(answerContainer: HTMLElement, candidatesContainer: HTMLElement, items: Array<Item>) {
		var that = this;

		// Add mapped items and sets
		this.answerItems = new Set();
		this.candidateItems = new Set();
		this.itemsMap = {};
		for(let i=0;i<items.length;i++) {
			this.itemsMap[items[i].get_id()] = items[i];
			
			// Add all items as candidates
			this.candidateItems.add(items[i]);
		}

		this.columnGrids = []

        this.generate_muuri(answerContainer, function(item:Item) {
			if(that.candidateItems.has(item)) {
				// WARNING does 'delete' works in all browsers?
				that.candidateItems.delete(item);

				var sorted: Array<Item> = that.get_sorted_items(that.candidateItems);
				for(let i=0;i<sorted.length;i++) {
					sorted[i].update_position(-i-1);
				}
			}
			that.answerItems.add(item);

			var sorted: Array<Item> = that.get_sorted_items(that.answerItems);
			for(let i=0;i<sorted.length;i++) {
				sorted[i].update_position(i+1);
			}
		})
        this.generate_muuri(candidatesContainer, function(item:Item) {
			if(that.answerItems.has(item)) {
				// WARNING does 'delete' works in all browsers?
				that.answerItems.delete(item);

				var sorted: Array<Item> = that.get_sorted_items(that.answerItems);
				for(let i=0;i<sorted.length;i++) {
					sorted[i].update_position(i+1);
				}
			}
			that.candidateItems.add(item);
			
			var sorted: Array<Item> = that.get_sorted_items(that.candidateItems);
			for(let i=0;i<sorted.length;i++) {
				sorted[i].update_position(-i-1);
			}
		})

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

	generate_muuri(container: HTMLElement, process_item: (Item)=>void) {
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
			if(process_item!=null) process_item(that.itemsMap[item._child.getAttribute('id')]);
			//console.log('Released element ' + item._child.getAttribute('name'));
		})
		.on('layoutStart', function () {
			// Let's keep the board grid up to date with the
			// dimensions changes of column grids.
			that.boardGrid.refreshItems().layout();
		});

		that.columnGrids.push(grid);
	}
}