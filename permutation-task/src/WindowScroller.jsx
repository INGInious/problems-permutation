/* @flow */

const THRESHOLD = 50;

export const WindowScroller = new class {

    listenerCount: Set<String>;
    doScroll: boolean;

    topMouseY: number;
    bottomMouseY: number;
    scrollY: number;

    enableListener: () => void;
    disableListener: () => void;
    scrollLoop: () => void;
    startScrolling: () => void;
    stopScrolling: () => void;

    constructor() {
        this.listenerCount = new Set();
        this.doScroll = false;

        this.mouseX = screen.width/2;
        this.mouseY = screen.height/2;
        this.scrollY = window.scrollY;

        this.__bind_functions();
    }

    __bind_functions() {
        this.enableListener = this.enableListener.bind(this);
        this.disableListener = this.disableListener.bind(this);
        this.scrollLoop = this.scrollLoop.bind(this);
        this.startScrolling = this.startScrolling.bind(this);
        this.stopScrolling = this.stopScrolling.bind(this);
        this.updateMouse = this.updateMouse.bind(this);
    }

    scrollLoop() {
        // console.log(this.mouseY);
        if(this.topMouseY <= THRESHOLD) {
            // console.log('scrolling up')
            window.scrollBy(0, -30);
        } else if(this.bottomMouseY >= (screen.height - THRESHOLD)) {
            // console.log('scrolling down')
            window.scrollBy(0, 30);
        }
        if(this.doScroll) setTimeout(this.scrollLoop, 30);
    }

    startScrolling() {
        this.doScroll = true;
        this.scrollLoop();
    }

    stopScrolling() {
        this.doScroll = false;
    }

    updateMouse(mouseEvent: MouseEvent) {
        this.topMouseY = mouseEvent.pageY - window.pageYOffset;
        this.bottomMouseY = mouseEvent.screenY;
    }

    enableListener(enabler: String) {
        // TODO: Race condition (?)
        this.listenerCount.add(enabler);
        if(this.listenerCount.size > 1) return;
        
        this.mouseX = screen.width/2;
        this.mouseY = screen.height/2;
        this.scrollY = window.scrollY;

        document.body.addEventListener("mousemove", this.updateMouse, true);
        this.startScrolling();
    }

    disableListener(enabler: String) {
        // TODO: Race condition (?)
        this.listenerCount.delete(enabler);
        if(this.listenerCount.size > 0) return;
        
        this.stopScrolling();
        document.body.removeEventListener("mousemove", this.updateMouse, true);
    }

}
