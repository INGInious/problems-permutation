/* @flow */
import GridSystem from './GridSystem';
import { IdManager } from './IdManager';
import Item from './Item';
import PermutationList from './PermutationList';


function generate_trello_ui(pid: string, elems: Array<string>, elemsId: Array<string>, 
							tablesMetadata: Array<[string,string]>, containerColor: string) {
	var nullListsContainer: HTMLElement|null = document.getElementById(IdManager.stringify(IdManager.TPL_ANSWER_CONTAINER))
	// var nullCandidatesContainer: HTMLElement|null = document.getElementById(IdManager.stringify(IdManager.TPL_CANDIDATES_CONTAINER))
	var nullHiddenInputs: HTMLElement|null = document.getElementById(IdManager.stringify(IdManager.TPL_HIDDEN_INPUTS))

	if(nullListsContainer==null || nullHiddenInputs==null) {
		console.error(`Something is null:`)
		console.log(nullListsContainer)
		console.log(nullHiddenInputs)
		return;
	}

	const listsContainer: HTMLElement = nullListsContainer;
	// const candidatesContainer: HTMLElement = nullCandidatesContainer;
	const hiddenInputs: HTMLElement = nullHiddenInputs;

	var items: Array<Item> = [];

	for(let i=0;i<elems.length;i++) {
		var item: Item;

		item = new Item(-i-1, elemsId[i], elems[i]) // -,1, -2, -3
		item.build()

		// candidatesContainer.appendChild(item.get_card())
		hiddenInputs.appendChild(item.get_iposHiddenInput())
		hiddenInputs.appendChild(item.get_posHiddenInput())

		items.push(item)
	}
	new GridSystem(listsContainer, items, tablesMetadata, containerColor)
}

function generate_list_ui(pid: string, elems: Array<string>, elemsId: Array<string>, 
							tablesMetadata: Array<[string,string]>, containerColor: string) {
	var nullAnswersContainer: HTMLElement|null = document.getElementById(IdManager.stringify(IdManager.TPL_ANSWER_CONTAINER))
	var nullHiddenInputs: HTMLElement|null = document.getElementById(IdManager.stringify(IdManager.TPL_HIDDEN_INPUTS))

	if(nullAnswersContainer==null || nullHiddenInputs==null) {
		console.error(`Something is null:`)
		console.log(nullAnswersContainer)
		console.log(nullHiddenInputs)
		return;
	}

	const answersContainer: HTMLElement = nullAnswersContainer;
	const hiddenInputs: HTMLElement = nullHiddenInputs;

	var items: Array<Item> = [];

	for(let i=0;i<elems.length;i++) {
		var item: Item;

		item = new Item(i+1, elemsId[i], elems[i]) // Starts in 1
		item.build()

		answersContainer.appendChild(item.get_card())
		hiddenInputs.appendChild(item.get_iposHiddenInput())
		hiddenInputs.appendChild(item.get_posHiddenInput())

		items.push(item)
	}
	new PermutationList(answersContainer, items)
}

export function generate_ui(ptype: 'trello'|'list', pid: string, elems: Array<string>, elemsId: Array<string>,
							tablesMetadata: Array<[string,string]>, containerColor: string) {
	IdManager.init(pid);

	console.log(ptype)
	
	if(ptype=='trello') {
		generate_trello_ui(pid, elems, elemsId, tablesMetadata, containerColor);
	}
	if(ptype=='list') {
		generate_list_ui(pid, elems, elemsId, tablesMetadata, containerColor);
	}
}


// generate_permutation_list([Array(110).join(' C-C C+C ') + ';','D','A','B'], '.board-column-content');
