/* @flow */
import GridSystem from './GridSystem';
import {IdManager} from './IdManager';


const itemFactory = (elemId: string, text: string) => {
	const item = document.createElement('div')
	item.setAttribute('class', 'permutation-item')
	
	const itemContent = document.createElement('div')
	itemContent.setAttribute('id', elemId)
	itemContent.setAttribute('class', 'permutation-item-content')
	itemContent.innerHTML = text;
	item.appendChild(itemContent)

	return item
}


export function generate_ui(pid: string) {
	IdManager.init(pid);

	var nullAnswersContainer: HTMLElement|null = document.getElementById(IdManager.stringify(IdManager.TPL_ANSWER_CONTAINER))
	var nullCandidatesContainer: HTMLElement|null = document.getElementById(IdManager.stringify(IdManager.TPL_CANDIDATES_CONTAINER))

	if(nullAnswersContainer==null || nullCandidatesContainer==null) return;

	const answersContainer: HTMLElement = nullAnswersContainer;
	const candidatesContainer: HTMLElement = nullCandidatesContainer;

	new GridSystem(answersContainer, candidatesContainer, [])
}


// generate_permutation_list([Array(110).join(' C-C C+C ') + ';','D','A','B'], '.board-column-content');
