module pl {

	export class PLModal {
		
		// region Static
        // endregion

        // region Fields

        /**
		 * Body element.
		 * @type {HTMLElement}
		 */
		private _body: HTMLElement;

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
		 * Flag that indicate if the modal is opened or not.
		 * @type {boolean}
		 */
		private _opened: boolean = false;

        // endregion

		/**
		 * Create an instance of PLModal.
		 * @constructor
		 */
		constructor() {
			this._body = document.body;

			this.buildOut();
			this.initializeEvents();

		}

		// region Private Methods

		/**
		 * Create PLModal elements.
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
		 * Attach handlers to PlModal elements.
		 */
		private initializeEvents() {
			let ESC_KEY = 27;

			document.addEventListener('keydown', (ev) => {
				if (ev.keyCode == ESC_KEY) 
					this.close();
			}, false);

			this._closeButton.addEventListener('click', (ev) => { this.close(); }, false);

			this._modal.addEventListener(this.transitionend, () => {
				if (this._opened) {
					this.onModalClosed();
				} else {
					this.onModalOpened();
				}
			});


		}

		/**
         * Fires when modal open.
         */
		private onModalOpened() {
			if (this._modalOpened) {
				this._modalOpened.fire();
			}

			this._opened = true;
		}

		/**
		 * Fies when modal closes.
		 */
		private onModalClosed() {
			if (this._modalClosed) {
				this._modalClosed.fire();
			}

			this._opened = false;

			this.removeFromDom();
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
		 * @returns {string}
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

        // endregion

        // region Methods

        /**
		 * Open modal and add to DOM.
		 */
		public open() {

			this._body.appendChild(this._overlay);
			this._body.appendChild(this._modal);

			// Force the browser to recognize the elements that we just added.
			window.getComputedStyle(this._overlay).backgroundColor;
			window.getComputedStyle(this._modal);

			this._overlay.className += ' shown';
			this._modal.className += ' shown';

		}

		/**
		 * Close modal and remove from DOM.
		 */
		public close() {
			let overlay = this._overlay;
			let modal   = this._modal;

			overlay.className = overlay.className.replace(/(\s+)?shown/, '');
			modal.className = modal.className.replace(/(\s+)?shown/, '');
			
		}

        // endregion

        // region Events

        /**
		 * Modal opened event.
		 * @type {PLEvent}
		 */
		private _modalOpened: PLEvent;

        /**
		 * Get the modalOpened event.
		 * @return {PLEvent}
		 */
		public get modalOpened(): PLEvent {
			if (!this._modalOpened) {
				this._modalOpened = new PLEvent();
			}

			return this._modalOpened;
		}

		/**
		 * Modal closed event.
		 * @type {PLEvent}
		 */
		private _modalClosed: PLEvent;

		/**
		 * Get the modalClosed event.
		 * @return {PLEvent}
		 */
		public get modalClosed(): PLEvent {
			if (!this._modalClosed) {
				this._modalClosed = new PLEvent();
			}

			return this._modalClosed;
		}

        // endregion

        // region Properties
        // endregion
		
	}

}