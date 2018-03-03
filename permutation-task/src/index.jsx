import Muuri from 'muuri'


const itemFactory = (text) => {
	const item = document.createElement('div')
	item.setAttribute('class', 'board-item')
	
	const itemContent = document.createElement('div')
	itemContent.setAttribute('class', 'board-item-content')
	itemContent.innerHTML = text;
	item.appendChild(itemContent)

	return item
}

var columnGrids = [];

export default function generate_permutation_list(elems, loc) {

	elems.map(text => document.getElementById('thegrid').appendChild(itemFactory(text)))
	var grid = new Muuri(loc, {
		items: '.board-item',
		layoutDuration: 400,
		layoutEasing: 'ease',
		dragEnabled: true,
		dragSort: function () {
			return columnGrids;
		},
		dragSortInterval: 0,
		dragContainer: document.body,
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
		columnGrids.forEach(function (grid) {
			grid.refreshItems();
		});
	})
	.on('layoutStart', function () {
		// Let's keep the board grid up to date with the
		// dimensions changes of column grids.
	});

	columnGrids.push(grid);
}

generate_permutation_list([Array(110).join(' C-C C+C ') + ';','D','A','B'], '.board-column-content');
