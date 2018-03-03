import Muuri from 'muuri'

var grid = new Muuri('.grid', {
	dragEnabled: true
});

function component() {
	var element = document.createElement('div');
	element.innerHTML = "Hello world of webpacks!";
	return element;
}

document.body.appendChild(component());
