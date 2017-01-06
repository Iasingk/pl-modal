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
         * [show description]
         */
        PLModal.prototype.show = function () {
        };
        /**
         * [hide description]
         */
        PLModal.prototype.hide = function () {
        };
        return PLModal;
    }());
    pl.PLModal = PLModal;
})(pl || (pl = {}));
