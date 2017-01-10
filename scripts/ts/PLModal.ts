module pl {

	export class PLModal {
		
		/**
		 * [_instance description]
		 * @type {PLModal}
		 */
		private static _instance: PLModal;

		/**
		 * [instance description]
		 * @return {PLModal} [description]
		 */
		public static get instance(): PLModal {
			if (!PLModal._instance) {
				PLModal._instance = new PLModal();
			}

			return PLModal.instance;
		}

		/**
		 * [_body description]
		 * @type {HTMLElement}
		 */
		private _body: HTMLElement;

		/**
		 * [_overlay description]
		 * @type {HTMLElement}
		 */
		private _overlay: HTMLElement;

		/**
		 * [_modal description]
		 * @type {HTMLElement}
		 */
		private _modal: HTMLElement;

		/**
		 * [_closeButton description]
		 * @type {HTMLElement}
		 */
		private _closeButton: HTMLElement;

		/**
		 * [modalDisplayed description]
		 * @type {PLEvent}
		 */
		private _modalDisplayed: PLEvent;

		/**
		 * [constructor description]
		 * @constructor
		 */
		constructor() {
			// 
			this._body = document.body;

			// 
			this.buildOut();

			// 
			this.initializeEvents();

		}

		/**
		 * [buildOut description]
		 */
		private buildOut() {
			// Create elements.
			this._overlay     = document.createElement('div');
			this._modal       = document.createElement('div');
			this._closeButton = document.createElement('div');

			// 
			this._modal.appendChild(this._closeButton);

			// Assign classes.
			this._overlay.className     = 'pl-overlay';
			this._modal.className       = 'pl-modal';
			this._closeButton.className = 'pl-close-button';
		}

		/**
		 * [initializeEvents description]
		 */
		private initializeEvents() {
			//
			this._closeButton.addEventListener('click', (ev) => {
				this.close();
			}, false);

			//
			document.addEventListener('keydown', (ev) => {
				if (ev.keyCode == 27) 
					this.close();
			}, false);
		}

		/**
		 * Fires when modal is displyaed.
		 */
		private onModalDisplayed() {
			if (this._modalDisplayed) {
				this._modalDisplayed.fire();
			}
		}

		/**
		 *
		 */
		private get transitionend(): string {
			var el = document.createElement('div');

			if (el.style.WebkitTransition) return 'webkitTransitionEnd';
			if (el.style.OTransition) return 'oTransitionEnd';
			return 'transitionend';
		}

		/**
		 *
		 */
		public get modalDisplayed(): PLEvent {
			if (!this._modalDisplayed) {
				this._modalDisplayed = new PLEvent();
			}

			return this._modalDisplayed;
		}

		/**
		 * Open modal and add to DOM.
		 */
		public open() {
			this._body.appendChild(this._overlay);
			this._body.appendChild(this._modal);

			window.getComputedStyle(this._overlay).background;
			window.getComputedStyle(this._modal);

			this._overlay.className += ' shown';
			this._modal.className += ' shown';

			//
			this.onModalDisplayed();

		}

		/**
		 * Close modal and remove from DOM.
		 */
		public close() {
			let overlay = this._overlay;
			let modal   = this._modal;

			overlay.className = overlay.className.replace(/(\s+)?shown/, '');
			overlay.parentNode.removeChild(overlay);

			modal.className = modal.className.replace(/(\s+)?shown/, '');
			modal.parentNode.removeChild(modal);
		}
		
	}

}