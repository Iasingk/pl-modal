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
        /**
         * [constructor description]
         * @constructor
         */
        function PLModal() {
            // 
            this._body = document.body;
            // 
            this.buildOut();
            // 
            this.initializeEvents();
        }
        Object.defineProperty(PLModal, "instance", {
            /**
             * [instance description]
             * @return {PLModal} [description]
             */
            get: function () {
                if (!PLModal._instance) {
                    PLModal._instance = new PLModal();
                }
                return PLModal.instance;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * [buildOut description]
         */
        PLModal.prototype.buildOut = function () {
            // Create elements.
            this._overlay = document.createElement('div');
            this._modal = document.createElement('div');
            this._closeButton = document.createElement('div');
            // 
            this._modal.appendChild(this._closeButton);
            // Assign classes.
            this._overlay.className = 'pl-overlay';
            this._modal.className = 'pl-modal';
            this._closeButton.className = 'pl-close-button';
        };
        /**
         * [initializeEvents description]
         */
        PLModal.prototype.initializeEvents = function () {
            var _this = this;
            //
            this._closeButton.addEventListener('click', function (ev) {
                _this.close();
            }, false);
            //
            document.addEventListener('keydown', function (ev) {
                if (ev.keyCode == 27)
                    _this.close();
            }, false);
        };
        /**
         * Fires when modal is displyaed.
         */
        PLModal.prototype.onModalDisplayed = function () {
            if (this._modalDisplayed) {
                this._modalDisplayed.fire();
            }
        };
        Object.defineProperty(PLModal.prototype, "transitionend", {
            /**
             *
             */
            get: function () {
                var el = document.createElement('div');
                if (el.style.WebkitTransition)
                    return 'webkitTransitionEnd';
                if (el.style.OTransition)
                    return 'oTransitionEnd';
                return 'transitionend';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PLModal.prototype, "modalDisplayed", {
            /**
             *
             */
            get: function () {
                if (!this._modalDisplayed) {
                    this._modalDisplayed = new pl.PLEvent();
                }
                return this._modalDisplayed;
            },
            enumerable: true,
            configurable: true
        });
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
            //
            this.onModalDisplayed();
        };
        /**
         * Close modal and remove from DOM.
         */
        PLModal.prototype.close = function () {
            var overlay = this._overlay;
            var modal = this._modal;
            overlay.className = overlay.className.replace(/(\s+)?shown/, '');
            overlay.parentNode.removeChild(overlay);
            modal.className = modal.className.replace(/(\s+)?shown/, '');
            modal.parentNode.removeChild(modal);
        };
        return PLModal;
    }());
    pl.PLModal = PLModal;
})(pl || (pl = {}));
