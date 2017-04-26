var pl;
(function (pl) {
    var PLEvent = (function () {
        /**
         * Create a PLEvent instance.
         *
         * @constructor
         */
        function PLEvent() {
            this._handlers = [];
            this._scope = this || window;
        }
        /**
         * Add new handler.
         *
         * @param {function} handler
         */
        PLEvent.prototype.add = function (handler) {
            if (handler) {
                this._handlers.push(handler);
            }
        };
        /**
         * Excecute all suscribed handlers.
         */
        PLEvent.prototype.fire = function () {
            var _this = this;
            var args = arguments;
            this._handlers.forEach(function (handler) {
                handler.apply(_this._scope, args);
            });
        };
        /**
         * Remove handler from handlers.
         * @param {function} handler
         */
        PLEvent.prototype.remove = function (handler) {
            this._handlers = this._handlers.filter(function (fn) {
                if (fn != handler)
                    return fn;
            });
        };
        return PLEvent;
    }());
    pl.PLEvent = PLEvent;
})(pl || (pl = {}));
(function (pl) {
    var PLModal = (function () {
        // endregion
        /**
         * Create an instance of PLModal.
         * @constructor
         */
        function PLModal() {
            /**
             * Flag that indicate if the modal is opened or not.
             * @type {boolean}
             */
            this._opened = false;
            this._body = document.body;
            this.buildOut();
            this.initializeEvents();
        }
        //region Private Methods
        /**
         * Create PLModal elements.
         */
        PLModal.prototype.buildOut = function () {
            // Create elements.
            this._overlay = document.createElement('div');
            this._modal = document.createElement('div');
            this._closeButton = document.createElement('div');
            // Close button should be in modal.
            this._modal.appendChild(this._closeButton);
            // Assign classes.
            this._overlay.className = 'pl-overlay';
            this._modal.className = 'pl-modal';
            this._closeButton.className = 'pl-close-button';
        };
        /**
         * Attach handlers to PlModal elements.
         */
        PLModal.prototype.initializeEvents = function () {
            var _this = this;
            var ESC_KEY = 27;
            document.addEventListener('keydown', function (ev) {
                if (ev.keyCode == ESC_KEY)
                    _this.close();
            }, false);
            this._closeButton.addEventListener('click', function (ev) { _this.close(); }, false);
            this._overlay.addEventListener(this.transitionend, function () { });
            this._modal.addEventListener(this.transitionend, function () {
                if (_this._opened) {
                    _this.onModalClosed();
                }
                else {
                    _this.onModalOpened();
                }
            });
        };
        /**
         * Fires when modal open.
         */
        PLModal.prototype.onModalOpened = function () {
            if (this._modalOpened) {
                this._modalOpened.fire();
            }
            this._opened = true;
        };
        /**
         * Fies when modal closes.
         */
        PLModal.prototype.onModalClosed = function () {
            if (this._modalClosed) {
                this._modalClosed.fire();
            }
            this._opened = false;
            this.removeFromDom();
        };
        /**
         * Remove elements from DOM.
         */
        PLModal.prototype.removeFromDom = function () {
            var overlay = this._overlay;
            var modal = this._modal;
            overlay.parentNode.removeChild(overlay);
            modal.parentNode.removeChild(modal);
        };
        Object.defineProperty(PLModal.prototype, "transitionend", {
            /**
             * Get transitionend event depending of the browser.
             * @returns {string}
             */
            get: function () {
                var el = document.createElement('div');
                var transEndEventNames = {
                    WebkitTransition: 'webkitTransitionEnd',
                    MozTransition: 'transitionend',
                    OTransition: 'oTransitionEnd otransitionend',
                    transition: 'transitionend'
                };
                for (var name_1 in transEndEventNames) {
                    if (el.style[name_1] !== undefined)
                        return transEndEventNames[name_1];
                }
                return false;
            },
            enumerable: true,
            configurable: true
        });
        //endregion
        //region Methods
        /**
         * Open modal and add to DOM.
         */
        PLModal.prototype.open = function () {
            this._body.appendChild(this._overlay);
            this._body.appendChild(this._modal);
            window.getComputedStyle(this._overlay).background;
            window.getComputedStyle(this._modal);
            this._overlay.className += ' shown';
            this._modal.className += ' shown';
        };
        /**
         * Close modal and remove from DOM.
         */
        PLModal.prototype.close = function () {
            var overlay = this._overlay;
            var modal = this._modal;
            overlay.className = overlay.className.replace(/(\s+)?shown/, '');
            modal.className = modal.className.replace(/(\s+)?shown/, '');
        };
        Object.defineProperty(PLModal.prototype, "modalOpened", {
            /**
             * Get the modalOpened event.
             * @return {PLEvent}
             */
            get: function () {
                if (!this._modalOpened) {
                    this._modalOpened = new pl.PLEvent();
                }
                return this._modalOpened;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PLModal.prototype, "modalClosed", {
            /**
             * Get the modalClosed event.
             * @return {PLEvent}
             */
            get: function () {
                if (!this._modalClosed) {
                    this._modalClosed = new pl.PLEvent();
                }
                return this._modalClosed;
            },
            enumerable: true,
            configurable: true
        });
        return PLModal;
    }());
    pl.PLModal = PLModal;
})(pl || (pl = {}));
