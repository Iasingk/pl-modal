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

			// Assign classes.
			this._overlay.className     = 'pl-overlay';
			this._modal.className       = 'pl-modal';
			this._closeButton.className = 'pl-close-button';
		}

		/**
		 * [initializeEvents description]
		 */
		private initializeEvents() {
			console.log('Events initialized');

			// Events
			this._modalDisplayed = new PLEvent();

			document.addEventListener('keydown', (ev) => {
				if (ev.keyCode == 27) 
					this.hide();
			}, false);
		}

		/**
		 * [onModalDisplayed description]
		 */
		private onModalDisplayed() {
			if (!this._modalDisplayed) {
				this._modalDisplayed.fire();
			}
		}

		/**
		 * [show description]
		 */
		public show() {
			this._body.appendChild(this._overlay);
			// this._body.appendChild(this._modal);
			// this._body.appendChild(this._closeButton);

			window.getComputedStyle(this._overlay).backgroundColor;
			window.getComputedStyle(this._modal);

			this._overlay.className += ' shown';
			this._modal.className += ' shown';

		}

		/**
		 * [hide description]
		 */
		public hide() {
			console.log(this._overlay);
			this._overlay.parentNode.removeChild(this._overlay);
		}
		
	}

}