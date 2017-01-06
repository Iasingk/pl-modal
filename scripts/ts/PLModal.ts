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
		 * [constructor description]
		 * @constructor
		 */
		constructor() {
			
		}

		/**
		 * [show description]
		 */
		public show() {
			
		}

		/**
		 * [hide description]
		 */
		public hide() {
			
		}
		
	}

}