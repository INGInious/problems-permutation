/* @flow */
import Muuri from 'muuri';
import {IdManager} from './IdManager';


export default class GridSystem {
	columnGrids : Array<Muuri>;
    boardGrid : Muuri;
    
    hiddenInputs : Array<HTMLElement>;

	constructor(answerContainer: HTMLElement, candidatesContainer: HTMLElement, hiddenInputs: Array<HTMLElement>) {
        this.hiddenInputs = hiddenInputs;

		this.columnGrids = []

        this.generate_muuri(answerContainer, 'ANSWERS')
        this.generate_muuri(candidatesContainer, 'CANDIDATES')

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

	generate_muuri(container: HTMLElement, name: string) {
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
			//console.log('Pressed element at' + name);
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
			//console.log('Released element at' + name);
		})
		.on('layoutStart', function () {
			// Let's keep the board grid up to date with the
			// dimensions changes of column grids.
			that.boardGrid.refreshItems().layout();
		});

		that.columnGrids.push(grid);
	}
}