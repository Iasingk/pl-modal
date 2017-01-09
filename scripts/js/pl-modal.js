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
            console.log('Events initialized');
            // Events
            this._modalDisplayed = new pl.PLEvent();
            document.addEventListener('keydown', function (ev) {
                if (ev.keyCode == 27)
                    _this.hide();
            }, false);
        };
        /**
         * [onModalDisplayed description]
         */
        PLModal.prototype.onModalDisplayed = function () {
            if (!this._modalDisplayed) {
                this._modalDisplayed.fire();
            }
        };
        /**
         * [show description]
         */
        PLModal.prototype.show = function () {
            this._body.appendChild(this._overlay);
            // this._body.appendChild(this._modal);
            // this._body.appendChild(this._closeButton);
            window.getComputedStyle(this._overlay).backgroundColor;
            window.getComputedStyle(this._modal);
            this._overlay.className += ' shown';
            this._modal.className += ' shown';
        };
        /**
         * [hide description]
         */
        PLModal.prototype.hide = function () {
            console.log(this._overlay);
            this._overlay.parentNode.removeChild(this._overlay);
        };
        return PLModal;
    }());
    pl.PLModal = PLModal;
})(pl || (pl = {}));
