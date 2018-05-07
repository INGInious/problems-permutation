/* @flow */
import Item from './Item';
import Muuri from 'muuri';
import { IdManager } from './IdManager';


export default class PermutationList {
    columnGrid: Muuri;
    listContainer: HTMLElement;

    answers: Set<Item>;
    itemsMap: {[string]: Item};

    constructor(listContainer: HTMLElement, items: Array<Item>) {
        var that = this;

        this.listContainer = listContainer;

        this.answers = new Set();
		this.itemsMap = {};
		for(let i=0;i<items.length;i++) {
			this.itemsMap[items[i].get_id()] = items[i];
			this.answers.add(items[i]);
        }
        
        this.generate_muuri(listContainer, function(item:Item) {
            var sorted: Array<Item> = that.get_sorted_items(that.answers);
            for(let i=0;i<sorted.length;i++) {
				// FIXME: Use custom table name
                sorted[i].update_position('answers', i+1);// Starts in 1
            }
		})
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
				return [that.columnGrid];
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
			that.columnGrid.refreshItems();
			if(process_item!=null) process_item(that.itemsMap[item._child.getAttribute('id')]);
			//console.log('Released element ' + item._child.getAttribute('name'));
		});

		that.columnGrid = grid;
    }
}