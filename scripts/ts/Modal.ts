/**
 * Created by cesarmejia on 20/08/2017.
 */
module pl {

    export class Modal {

        // region Static

        /**
         * Get transitionend event depending of the browser.
         * @return {string}
         */
        static transitionSelect(): string {
            let el = document.createElement('div');

            let transEndEventNames = {
                WebkitTransition: 'webkitTransitionEnd',
                MozTransition: 'transitionend',
                OTransition: 'otransitionend',
                transition: 'transitionend'
            };

            for (let name in transEndEventNames) {
                if (el.style[name] !== undefined)
                    return transEndEventNames[name];
            }
        };

        // endregion

        // region Fields

        /**
         * Flag that indicate if the modal is open or not.
         * @type {boolean}
         */
        private _isOpen: boolean = false;

        /**
         * Modal settings
         * @type {object}
         */
        private _settings: Object;

        /**
         * Transitionend name.
         * @type {string}
         */
        private _transitionend: string;

        // endregion

        /**
         * Create an instance of Modal.
         * @constructor
         * @param {object} settings
         */
        constructor(settings: Object) {
            // Define default options.
            let defaults = {
                avoidClose: false,
                closeWithOverlay: false,
                effectName: ''
            };

            // Create settings by extending defaults with passed
            // settings in constructor.
            this._settings = Util.extendsDefaults(defaults, settings || {});

            // Select transitionend that browser support.
            this._transitionend = Modal.transitionSelect();

            this.buildOut();
            this.initializeEvents();
        }

        // region Private Methods

        /**
         * Create modal elements.
         */
        private buildOut() {
            // Create modal content.
            this.modal.appendChild(this.content);

            // Create close button element.
            if (!this._settings['avoidClose']) {
                this.content.appendChild(this.closeButton);
            }
        }

        /**
         * Attach handlers to modal elements.
         */
        private initializeEvents() {
            if (!this._settings['avoidClose']) {
                let ESC_KEY = 27;

                // Close modal if user press esc key.
                document.addEventListener('keydown', ev => {
                    if (ev.keyCode == ESC_KEY) this.close();
                }, false);

                // Close modal if user clicks the close button.
                this.closeButton.addEventListener('click', ev => {
                    this.close();
                }, false);

                // Close modal if user clicks the overlay.
                if (this._settings['closeWithOverlay']) {
                    this.overlay.addEventListener('click', ev => {
                        this.close();
                    }, false);
                }
            }

            // Bind "this" context to toggleTransition handler.
            this.toggleTransitionend = this.toggleTransitionend.bind(this);

            // Attach handler to transitionend event, when the event occurs for the first time
            // remove the event because transitionend handler will execute the same times as
            // styles modified.
            this.content.addEventListener(this._transitionend, this.toggleTransitionend, false);

        }

        /**
         * Remove elements from DOM.
         */
        private removeFromDom() {
            this.overlay.parentNode.removeChild(this.overlay);
            this.modal.parentNode.removeChild(this.modal);
        }

        /**
         * Control the flow of transitionend handler and modal.
         * @param {TransitionEvent} ev
         */
        private toggleTransitionend(ev: TransitionEvent) {
            let functionToCall = this._isOpen ? this.onClosed : this.onOpened;

            // Remove transitionend handler to avoid multiple calls depending on css properties modfied.
            this.content.removeEventListener(this._transitionend, this.toggleTransitionend);

            this._isOpen = !this._isOpen;
            functionToCall.call(this);

            setTimeout(() => {
                this.content.addEventListener(this._transitionend, this.toggleTransitionend, false);
            }, 50);
        }

        // endregion

        // region Methods

        /**
         * Close modal and remove from DOM.
         */
        close() {
            if (!this._isOpen) return;

            let body = document.body;

            // Fire closing event.
            this.onClosing();

            // Let scroll in body
            Classie.removeClass(body, 'no-scroll');

            Classie.removeClass(this.overlay, 'pl-modal-open');
            Classie.removeClass(this.modal, 'pl-modal-open');
        }

        /**
         * Change effect from modal.
         * @param {string} effectName
         */
        changeEffect(effectName: string) {
            this._settings['effectName'] = effectName;

            Classie.reset(this.modal);
            Classie.addClass(this.modal, 'pl-modal');
            Classie.addClass(this.modal, this._settings['effectName']);
        }

        /**
         * Add modal to DOM and show it.
         * @param {HTMLElement|string} element
         */
        open(element?) {
            if (this._isOpen) return;

            let body = document.body;

            this.setContent(element);

            body.appendChild(this.overlay);
            body.appendChild(this.modal);

            // Avoid scroll in void since modal is open.
            Classie.addClass(body, 'no-scroll');

            // Fire opening event.
            this.onOpening();

            // Force the browser to recognize the elements that we just added.
            window.getComputedStyle(this.overlay).backgroundColor;
            window.getComputedStyle(this.modal).opacity;
            window.getComputedStyle(this.content).opacity;

            Classie.addClass(this.overlay, 'pl-modal-open');
            Classie.addClass(this.modal, 'pl-modal-open');
        }

        /**
         * Set modal content.
         * @param {HTMLElement|string} element
         */
        setContent(element: any = "") {
            // Empty content element.
            this.content.innerHTML = '';

            if (!this._settings['avoidClose']) {
                this.content.appendChild(this.closeButton);
            }

            if ("string" === typeof element) {
                this.content.appendChild(document.createTextNode(element));
            } else {
                this.content.appendChild(element);
            }
        }

        // endregion

        // region Events

        /**
         * Fires when modal is closed.
         */
        private onClosing() {
            if (this._closing) {
                this._closing.fire();
            }
        }

        /**
         * Fires when modal is opened.
         */
        private onOpening() {
            if (this._opening) {
                this._opening.fire();
            }
        }

        /**
         * Fires when modal is closed.
         */
        private onClosed() {
            if (this._closed) {
                this._closed.fire();
            }

            this.removeFromDom();
        }

        /**
         * Fires when modal is opened.
         */
        private onOpened() {
            if (this._opened) {
                this._opened.fire();
            }
        }

        // endregion

        // region Properties

        /**
         * Modal closing event.
         * @type {pl.PLEvent}
         */
        private _closing: PLEvent;

        /**
         * Get modal closing event.
         * @returns {pl.PLEvent}
         */
        get closing(): PLEvent {
            if (!this._closing) {
                this._closing = new PLEvent();
            }

            return this._closing;
        }

        /**
         * Modal opening event.
         * @type {pl.PLEvent}
         */
        private _opening: PLEvent;

        /**
         * Get modal opening event.
         * @returns {pl.PLEvent}
         */
        get opening(): PLEvent {
            if (!this._opening) {
                this._opening = new PLEvent();
            }

            return this._opening;
        }

        /**
         * Modal closed event.
         * @type {pl.PLEvent}
         */
        private _closed: PLEvent;

        /**
         * Get modal closed event.
         * @return {pl.PLEvent}
         */
        get closed(): PLEvent {
            if (!this._closed) {
                this._closed = new PLEvent();
            }

            return this._closed;
        }

        /**
         * Modal opened event.
         * @type {pl.PLEvent}
         */
        private _opened: PLEvent;

        /**
         * Get modal opened event.
         * @return {pl.PLEvent}
         */
        get opened(): PLEvent {
            if (!this._opened) {
                this._opened = new PLEvent();
            }

            return this._opened;
        }

        /**
         * Overlay element.
         * @type {HTMLElement}
         */
        private _overlay: HTMLElement;

        /**
         * Get overlay element.
         * @returns {HTMLElement}
         */
        get overlay(): HTMLElement {
            if (!this._overlay) {
                this._overlay = document.createElement('div');
                Classie.addClass(this._overlay, 'pl-modal-overlay');
            }

            return this._overlay;
        }

        /**
         * Modal element.
         * @type {HTMLElement}
         */
        private _modal: HTMLElement;

        /**
         * Get modal element.
         * @returns {HTMLElement}
         */
        get modal(): HTMLElement {
            if (!this._modal) {
                this._modal = document.createElement('div');
                Classie.addClass(this._modal, 'pl-modal');
                Classie.addClass(this._modal, this._settings['effectName']);
            }

            return this._modal;
        }

        /**
         * Modal content.
         * @type {HTMLElement}
         */
        private _content: HTMLElement;

        /**
         * Get content element.
         * @returns {HTMLElement}
         */
        get content(): HTMLElement {
            if (!this._content) {
                this._content = document.createElement('div');
                Classie.addClass(this._content, 'pl-modal-content');
            }

            return this._content;
        }

        /**
         * Close button element.
         * @type {HTMLElement}
         */
        private _closeButton: HTMLElement;

        /**
         * Get close button element.
         * @returns {HTMLElement}
         */
        get closeButton(): HTMLElement {
            if (!this._closeButton) {
                this._closeButton = document.createElement('div');
                Classie.addClass(this._closeButton, 'pl-modal-close-button');
            }

            return this._closeButton;
        }

        // endregion

    }

}