/* @flow */
import { IdManager } from './IdManager';

export default class Item {
    // Hidden input name ($pid-$item)
    name: string;
    // Initial position
    ipos: number;
    // Current position. negative positions belongs to discarted elements
    pos: number;
    // Card content
    content: string;

    // Card
    card: HTMLElement;
    enumeration: HTMLElement;
    contentCard: HTMLElement;
    // Hidden inputs
    iposHiddenInput: HTMLElement;
    posHiddenInput: HTMLElement;

    constructor(ipos: number, name: string, content: string) {
        this.ipos = ipos;
        this.name = name;
        this.content = content;

        // Current position = initial position
        this.pos = this.ipos;
    }

    get_id() {
        return IdManager.stringify(IdManager.TPL_CARD, this.ipos+'');
    }

    toString() {
        return this.content;
    }

    build() {
        // Building card
        this.enumeration = document.createElement('span')
        this.enumeration.innerHTML = '';
        
        this.contentCard = document.createElement('span')
        this.contentCard.innerHTML = this.content

        this.card = document.createElement('div')
        this.card.setAttribute('class', 'permutation-item')

        var itemContent: HTMLElement = document.createElement('div')
        itemContent.setAttribute('class', 'permutation-item-content')
        itemContent.setAttribute('id', this.get_id())
        itemContent.appendChild(this.enumeration)
        itemContent.appendChild(this.contentCard)

        this.card.appendChild(itemContent)

        // Building hidden inputs
        this.iposHiddenInput = document.createElement('input')
        this.iposHiddenInput.setAttribute('type', 'hidden')
        this.iposHiddenInput.setAttribute('name', this.name + '-ipos')
        this.iposHiddenInput.setAttribute('value', this.ipos+'')

        this.posHiddenInput = document.createElement('input')
        this.posHiddenInput.setAttribute('type', 'hidden')
        this.posHiddenInput.setAttribute('name', this.name + '-pos')
        this.posHiddenInput.setAttribute('value', this.pos+'')
    }

    update_position(pos: number) {
        this.pos = pos;
        this.posHiddenInput.setAttribute('value', this.pos+'')
        
        if(pos > 0) {
            this.enumeration.innerHTML = pos+'. '
        } else {
            this.enumeration.innerHTML = ''
        }
    }

    get_card() {
        return this.card;
    }

    get_iposHiddenInput() {
        return this.iposHiddenInput;
    }

    get_posHiddenInput() {
        return this.posHiddenInput;
    }

    get_y() {
        return this.card.getBoundingClientRect().top;
    }
}