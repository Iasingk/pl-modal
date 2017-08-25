var pl;
(function (pl) {
    var PLEvent = (function () {
        /**
         * Create a PLEvent instance.
         * @constructor
         */
        function PLEvent() {
            this._handlers = [];
            this._scope = this || window;
        }
        /**
         * Add new handler.
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
         * Create an instance of PLModal.
         * @constructor
         */
        function PLModal() {
            /**
             * Flag that indicate if the modal is open or not.
             * @type {boolean}
             */
            this._isOpen = false;
            this.buildOut();
            this.initializeEvents();
        }
        /**
         * Create modal elements.
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
         * Attach handlers to modal elements.
         */
        PLModal.prototype.initializeEvents = function () {
            var _this = this;
            var ESC_KEY = 27;
            // Close modal if user press esc key.
            document.addEventListener('keydown', function (ev) {
                if (ev.keyCode == ESC_KEY)
                    _this.close();
            }, false);
            // Close modal if user clicks the close button.
            this._closeButton.addEventListener('click', function (ev) {
                _this.close();
            }, false);
            // Attach handler when transition ends.
            /* this._modal.addEventListener(this.transitionend, ev => {
                if (this._isOpen) {
                    this.onModalClose();
                } else {
                    this.onModalOpen();
                }
            });*/
        };
        /**
         * Fires when modal open.
         */
        PLModal.prototype.onModalOpen = function () {
            if (this._modalOpen) {
                this._modalOpen.fire();
            }
            this._isOpen = true;
        };
        /**
         * Fires when modal closes.
         */
        PLModal.prototype.onModalClose = function () {
            if (this._modalClose) {
                this._modalClose.fire();
            }
            this.removeFromDom();
            this._isOpen = false;
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
             * @return {string}
             */
            get: function () {
                var el = document.createElement('div');
                var transEndEventNames = {
                    WebkitTransition: 'webkitTransitionEnd',
                    MozTransition: 'transitionend',
                    OTransition: 'otransitionend',
                    transition: 'transitionend'
                };
                for (var name_1 in transEndEventNames) {
                    if (el.style[name_1] !== undefined)
                        return transEndEventNames[name_1];
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         *
         */
        PLModal.prototype.closing = function () {
        };
        /**
         *
         */
        PLModal.prototype.opening = function (ev) {
            console.log('WTF?');
            if (!this._isOpen) {
                console.log('open');
                ev.target.removeEventListener(ev.type, arguments.callee);
                this.onModalOpen();
            }
            else {
                console.log('close');
            }
        };
        /**
         * Close modal and remove from DOM.
         */
        PLModal.prototype.close = function () {
            var overlay = this._overlay;
            var modal = this._modal;
            overlay.className = overlay.className.replace(/(\s+)?open/, '');
            modal.className = modal.className.replace(/(\s+)?open/, '');
        };
        /**
         * Utility method to extend defaults with user settings
         * @param {object} source
         * @param {object} settings
         * @return {object}
         */
        PLModal.prototype.extendsDefaults = function (source, settings) {
            var property;
            for (property in settings) {
                if (settings.hasOwnProperty(property))
                    source[property] = settings[property];
            }
            return source;
        };
        Object.defineProperty(PLModal.prototype, "modalClose", {
            /**
             * Get modal close event.
             * @return {PLEvent}
             */
            get: function () {
                if (!this._modalClose) {
                    this._modalClose = new pl.PLEvent();
                }
                return this._modalClose;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PLModal.prototype, "modalOpen", {
            /**
             * Get modal open event.
             * @return {PLEvent}
             */
            get: function () {
                if (!this._modalOpen) {
                    this._modalOpen = new pl.PLEvent();
                }
                return this._modalOpen;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Add modal to DOM and show it.
         */
        PLModal.prototype.open = function () {
            var body = document.body;
            var overlay = this._overlay;
            var modal = this._modal;
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
        };
        return PLModal;
    }());
    pl.PLModal = PLModal;
})(pl || (pl = {}));
