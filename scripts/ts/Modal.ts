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

        /**
         * Utility method to extend defaults with user settings
         * @param {object} source
         * @param {object} settings
         * @return {object}
         */
        static extendsDefaults(source: Object, settings: Object) {
            let property;

            for (property in settings) {
                if (settings.hasOwnProperty(property)) {
                    source[property] = settings[property];
                }
            }

            return source;
        }

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
            this._settings = Modal.extendsDefaults(defaults, settings || {});

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

            // Let scroll in body
            body.className = body.className.replace(/\s?\bno-scroll\b/g, '');

            this.overlay.className = this.overlay.className.replace(/\s?\bpl-modal-open\b/g, '');
            this.modal.className = this.modal.className.replace(/\s?\bpl-modal-open\b/g, '');
        }

        /**
         * Change effect from modal.
         * @param {string} effectName
         */
        changeEffect(effectName: string) {
            this._settings['effectName'] = effectName;
            this.modal.className = `pl-modal ${this._settings['effectName']}`;
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
            body.className += 'no-scroll';

            // Force the browser to recognize the elements that we just added.
            window.getComputedStyle(this.overlay).backgroundColor;
            window.getComputedStyle(this.modal).opacity;
            window.getComputedStyle(this.content).opacity;

            this.overlay.className += ' pl-modal-open';
            this.modal.className += ' pl-modal-open';
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
         * Modal closed event.
         * @type {pl.PLEvent}
         */
        private _closed: PLEvent;

        /**
         * Get modal closed event.
         * @return {pl.PLEvent}
         */
        get closed() {
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
        get opened() {
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
                this._overlay.className = 'pl-modal-overlay';
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
                this._modal.className = `pl-modal ${this._settings['effectName']}`;
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
                this._content.className = 'pl-modal-content';
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
                this._closeButton.className = 'pl-modal-close-button';
            }

            return this._closeButton;
        }

        // endregion

    }

}