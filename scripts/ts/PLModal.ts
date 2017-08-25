module pl {

	export class PLModal {

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
		 * Modal close event.
		 * @type {PLEvent}
		 */
		private _modalClose: PLEvent;

        /**
         * Modal open event.
         * @type {PLEvent}
         */
        private _modalOpen: PLEvent;

		/**
		 * Create an instance of PLModal.
		 * @constructor
		 */
		constructor() {
			this.buildOut();
			this.initializeEvents();
		}

		/**
		 * Create modal elements.
		 */
		private buildOut() {
			// Create elements.
			this._overlay     = document.createElement('div');
			this._modal       = document.createElement('div');
			this._closeButton = document.createElement('div');

			// Close button should be in modal.
			this._modal.appendChild(this._closeButton);

			// Assign classes.
			this._overlay.className     = 'pl-overlay';
			this._modal.className       = 'pl-modal';
			this._closeButton.className = 'pl-close-button';

		}

		/**
		 * Attach handlers to modal elements.
		 */
		private initializeEvents() {
            let ESC_KEY = 27;

			// Close modal if user press esc key.
			document.addEventListener('keydown', ev => {
				if (ev.keyCode == ESC_KEY) this.close();
			}, false);

			// Close modal if user clicks the close button.
			this._closeButton.addEventListener('click', ev => {
				this.close();
			}, false);

			// Attach handler when transition ends.
			/* this._modal.addEventListener(this.transitionend, ev => {
                if (this._isOpen) {
                    this.onModalClose();
                } else {
                    this.onModalOpen();
                }
			});*/

		}

        /**
         * Fires when modal open.
         */
        private onModalOpen() {
            if (this._modalOpen) {
                this._modalOpen.fire();
            }

            this._isOpen = true;
        }

        /**
         * Fires when modal closes.
         */
        private onModalClose() {
            if (this._modalClose) {
                this._modalClose.fire();
            }

            this.removeFromDom();

            this._isOpen = false;
        }

		/**
		 * Remove elements from DOM.
		 */
		private removeFromDom() {
			let overlay = this._overlay;
			let modal   = this._modal;

			overlay.parentNode.removeChild(overlay);
			modal.parentNode.removeChild(modal);
		}

		/**
		 * Get transitionend event depending of the browser.
		 * @return {string}
		 */
		private get transitionend(): string {
			let el = document.createElement('div');

			let transEndEventNames = {
				WebkitTransition : 'webkitTransitionEnd',
				MozTransition    : 'transitionend',
				OTransition      : 'otransitionend',
				transition       : 'transitionend'
			};

			for (let name in transEndEventNames) {
				if (el.style[name] !== undefined)
					return transEndEventNames[name];
			}
		}

		/**
		 *
		 */
		private closing() {

		}

		/**
		 *
		 */
		private opening(ev) {
			console.log('WTF?');
			if (!this._isOpen) {
				console.log('open');
				ev.target.removeEventListener(ev.type, <EventListener>arguments.callee);
				this.onModalOpen();
			} else {
				console.log('close');
			}
		}

		/**
		 * Close modal and remove from DOM.
		 */
		public close() {
			let overlay = this._overlay;
			let modal   = this._modal;

			overlay.className = overlay.className.replace(/(\s+)?open/, '');
			modal.className = modal.className.replace(/(\s+)?open/, '');

		}

        /**
         * Utility method to extend defaults with user settings
         * @param {object} source
         * @param {object} settings
         * @return {object}
         */
        public extendsDefaults(source, settings) {
            let property;

            for (property in settings) {
                if (settings.hasOwnProperty(property))
                    source[property] = settings[property];
            }

            return source;
        }

        /**
         * Get modal close event.
         * @return {PLEvent}
         */
        public get modalClose() {
            if (!this._modalClose) {
                this._modalClose = new PLEvent();
            }

            return this._modalClose;
        }

        /**
         * Get modal open event.
         * @return {PLEvent}
         */
        public get modalOpen() {
            if (!this._modalOpen) {
                this._modalOpen = new PLEvent();
            }

            return this._modalOpen;
        }

		/**
		 * Add modal to DOM and show it.
		 */
		public open() {
            let body    = document.body;
			let	overlay = this._overlay;
			let	modal   = this._modal;

			// Attach handler to transitionend event, when the event occurs for the first time
			// remove the event because transitionend will execute the same times as
			// styles modified.
			modal.addEventListener(this.transitionend, this.opening.bind(this));

			body.appendChild(overlay);
			body.appendChild(modal);

			// Force the browser to recognize the elements that we just added.
			window.getComputedStyle(overlay).backgroundColor;
			window.getComputedStyle(modal).height;

			overlay.className += ' open';
			modal.className += ' open';

		}

	}

}