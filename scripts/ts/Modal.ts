/**
 * Created by cesarmejia on 20/08/2017.
 */
module pl {

    export class Modal {

        /**
         * Overlay element.
         * @type {HTMLElement}
         */
        private _overlay: HTMLElement;

        /**
         * Modal element.
         * @type {HTMLElement}
         */
        private _modal: HTMLElement;

        /**
         * Modal content.
         * @type {HTMLElement}
         */
        private _content: HTMLElement;

        /**
         * Close button element.
         * @type {HTMLElement}
         */
        private _closeButton: HTMLElement;

        /**
         * Flag that indicate if the modal is open or not.
         * @type {boolean}
         */
        private _isOpen: boolean = false;

        /**
         * Modal closed event.
         * @type {Event}
         */
        private _closed: Event;

        /**
         * Modal opened event.
         * @type {Event}
         */
        private _opened: Event;

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

        /**
         * Get transitionend event depending of the browser.
         * @return {string}
         */
        static transitionSelect():string {
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
                if (settings.hasOwnProperty(property))
                    source[property] = settings[property];
            }

            return source;
        }

        /**
         * Create an instance of Modal.
         * @constructor
         * @param {object} settings
         */
        constructor(settings: Object) {
            // Define default options.
            let defaults = {
                effectName: '',
                avoidClose: false
            };

            // Create settings by extending defaults with passed
            // settings in constructor.
            this._settings = Modal.extendsDefaults(defaults, settings || {});

            // Select transitionend that browser support.
            this._transitionend = Modal.transitionSelect();

            this.buildOut();
            this.initializeEvents();
        }

        /**
         * Create modal elements.
         */
        private buildOut() {
            // Create overlay element.
            this._overlay = document.createElement('div');
            this._overlay.className = 'pl-modal-overlay';

            // Create modal element.
            this._modal = document.createElement('div');
            this._modal.className = 'pl-modal' + ' ' + this._settings['effectName'];

            // Create modal content.
            this._content = document.createElement('div');
            this._content.className = 'pl-modal-content';
            this._modal.appendChild(this._content);

            // Create close button element.
            if (!this._settings['avoidClose']) {
                this._closeButton = document.createElement('div');
                this._closeButton.className = 'pl-modal-close-button';
                this._content.appendChild(this._closeButton);
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
                this._closeButton.addEventListener('click', ev => {
                    this.close();
                }, false);
            }

            // Bind "this" context to toggleTransition handler.
            this.toggleTransitionend = this.toggleTransitionend.bind(this);

            // Attach handler to transitionend event, when the event occurs for the first time
            // remove the event because transitionend handler will execute the same times as
            // styles modified.
            this._content.addEventListener(this._transitionend, this.toggleTransitionend, false);

        }

        /**
         * Fires when modal is opened.
         */
        private onOpened() {
            if (this._opened) {
                this._opened.fire();
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
         * Remove elements from DOM.
         */
        private removeFromDom() {
            let overlay = this._overlay;
            let modal = this._modal;

            overlay.parentNode.removeChild(overlay);
            modal.parentNode.removeChild(modal);
        }

        /**
         * Control the flow of transitionend handler and modal.
         * @param {TransitionEvent} ev
         */
        private toggleTransitionend(ev: TransitionEvent) {
            let content = this._content,
                functionToCall = this._isOpen ? this.onClosed : this.onOpened;

            // Remove transitionend handler to avoid multiple calls depending on css properties modfied.
            content.removeEventListener(this._transitionend, this.toggleTransitionend);

            this._isOpen = !this._isOpen;
            functionToCall.call(this);

            setTimeout(() => {
                content.addEventListener(this._transitionend, this.toggleTransitionend, false);
            }, 50);

        }

        /**
         * Change effect from modal.
         * @param {string} effectName
         */
        public changeEffect(effectName: string) {
            this._settings['effectName'] = effectName;
            this._modal.className = 'pl-modal' + ' ' + this._settings['effectName'];
        }

        /**
         * Close modal and remove from DOM.
         */
        public close() {
            if (!this._isOpen) return;

            let body = document.body;
            let overlay = this._overlay;
            let modal = this._modal;

            // Let scroll in body
            body.className = body.className.replace(/\s?\bno-scroll\b/g, '');

            overlay.className = overlay.className.replace(/\s?\bpl-modal-open\b/g, '');
            modal.className = modal.className.replace(/\s?\bpl-modal-open\b/g, '');

        }

        /**
         * Get modal closed event.
         * @return {Event}
         */
        public get closed() {
            if (!this._closed) {
                this._closed = new Event();
            }

            return this._closed;
        }

        /**
         * Get modal opened event.
         * @return {Event}
         */
        public get opened() {
            if (!this._opened) {
                this._opened = new Event();
            }

            return this._opened;
        }

        /**
         * Add modal to DOM and show it.
         * @param {HTMLElement|string} element
         */
        public open(element?) {
            if (this._isOpen) return;

            let body = document.body;
            let overlay = this._overlay;
            let modal = this._modal;
            let content = this._content;

            this.setContent(element);

            body.appendChild(overlay);
            body.appendChild(modal);

            // Avoid scroll in void since modal is open.
            body.className += 'no-scroll';

            // Force the browser to recognize the elements that we just added.
            window.getComputedStyle(overlay).backgroundColor;
            window.getComputedStyle(modal).opacity;
            window.getComputedStyle(content).opacity;

            overlay.className += ' pl-modal-open';
            modal.className += ' pl-modal-open';

        }

        /**
         * Set modal content.
         * @param {HTMLElement|string} element
         */
        public setContent(element: any = "") {
            let content = this._content;

            // Empty content element.
            content.innerHTML = '';

            if (!this._settings['avoidClose'])
                content.appendChild(this._closeButton);

            if ("string" === typeof element)
                content.appendChild(document.createTextNode(element));
            else
                content.appendChild(element);

        }

    }

}