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
    var Modal = (function () {
        /**
         * Create an instance of Modal.
         * @constructor
         * @param {object} settings
         */
        function Modal(settings) {
            /**
             * Flag that indicate if the modal is open or not.
             * @type {boolean}
             */
            this._isOpen = false;
            // Define default options.
            var defaults = {
                className: '',
                avoidClose: true
            };
            // Create settings by extending defaults with passed
            // settings in constructor.
            this._settings = Modal.extendsDefaults(defaults, settings || {});
            // Select transitionend that browser support.
            this._transitionend = Modal.transitionSelect();
            this.buildOut();
            this.initializeEvents();
        }
        /**
         * Get transitionend event depending of the browser.
         * @return {string}
         */
        Modal.transitionSelect = function () {
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
        };
        ;
        /**
         * Utility method to extend defaults with user settings
         * @param {object} source
         * @param {object} settings
         * @return {object}
         */
        Modal.extendsDefaults = function (source, settings) {
            var property;
            for (property in settings) {
                if (settings.hasOwnProperty(property))
                    source[property] = settings[property];
            }
            return source;
        };
        /**
         * Create modal elements.
         */
        Modal.prototype.buildOut = function () {
            // Create overlay element.
            this._overlay = document.createElement('div');
            this._overlay.className = 'pl-modal-overlay';
            // Create modal element.
            this._modal = document.createElement('div');
            this._modal.className = 'pl-modal' + ' ' + this._settings['className'];
            // Create modal content.
            this._content = document.createElement('div');
            this._content.className = 'pl-modal-content';
            this._modal.appendChild(this._content);
            // Create close button element.
            if (this._settings['avoidClose']) {
                this._closeButton = document.createElement('div');
                this._closeButton.className = 'pl-modal-close-button';
                this._modal.appendChild(this._closeButton);
            }
        };
        /**
         * Attach handlers to modal elements.
         */
        Modal.prototype.initializeEvents = function () {
            var _this = this;
            if (this._settings['avoidClose']) {
                var ESC_KEY_1 = 27;
                // Close modal if user press esc key.
                document.addEventListener('keydown', function (ev) {
                    if (ev.keyCode == ESC_KEY_1)
                        _this.close();
                }, false);
                // Close modal if user clicks the close button.
                this._closeButton.addEventListener('click', function (ev) {
                    _this.close();
                }, false);
            }
            // Bind "this" context to toggleTransition handler.
            this.toggleTransitionend = this.toggleTransitionend.bind(this);
            // Attach handler to transitionend event, when the event occurs for the first time
            // remove the event because transitionend handler will execute the same times as
            // styles modified.
            this._modal.addEventListener(this._transitionend, this.toggleTransitionend, false);
        };
        /**
         * Fires when modal open.
         */
        Modal.prototype.onModalOpen = function () {
            if (this._modalOpen) {
                this._modalOpen.fire();
            }
            this._isOpen = true;
        };
        /**
         * Fires when modal closes.
         */
        Modal.prototype.onModalClose = function () {
            if (this._modalClose) {
                this._modalClose.fire();
            }
            this.removeFromDom();
            this._isOpen = false;
        };
        /**
         * Remove elements from DOM.
         */
        Modal.prototype.removeFromDom = function () {
            var overlay = this._overlay;
            var modal = this._modal;
            overlay.parentNode.removeChild(overlay);
            modal.parentNode.removeChild(modal);
        };
        /**
         * Control the flow of transitionend handler and modal.
         * @param {TransitionEvent} ev
         */
        Modal.prototype.toggleTransitionend = function (ev) {
            var _this = this;
            var modal = this._modal, functionToCall = this._isOpen ? this.onModalClose : this.onModalOpen;
            modal.removeEventListener(this._transitionend, this.toggleTransitionend);
            functionToCall.call(this);
            setTimeout(function () {
                modal.addEventListener(_this._transitionend, _this.toggleTransitionend, false);
            }, 50);
        };
        /**
         * Close modal and remove from DOM.
         */
        Modal.prototype.close = function () {
            if (!this._isOpen)
                return;
            var overlay = this._overlay;
            var modal = this._modal;
            overlay.className = overlay.className.replace(/(\s+)?modal-open/, '');
            modal.className = modal.className.replace(/(\s+)?modal-open/, '');
        };
        Object.defineProperty(Modal.prototype, "modalClose", {
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
        Object.defineProperty(Modal.prototype, "modalOpen", {
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
        Modal.prototype.open = function () {
            if (this._isOpen)
                return;
            var body = document.body;
            var overlay = this._overlay;
            var modal = this._modal;
            body.appendChild(overlay);
            body.appendChild(modal);
            // Force the browser to recognize the elements that we just added.
            window.getComputedStyle(overlay).backgroundColor;
            window.getComputedStyle(modal).height;
            overlay.className += ' modal-open';
            modal.className += ' modal-open';
        };
        /**
         * Set modal content.
         * @param {HTMLElement|string} content
         */
        Modal.prototype.setContent = function (content) {
            if (content === void 0) { content = ""; }
            // Empty content element.
            this._content.innerHTML = '';
            if ("string" === typeof content)
                this._content.appendChild(document.createTextNode(content));
            else
                this._content.appendChild(content);
        };
        return Modal;
    }());
    pl.Modal = Modal;
})(pl || (pl = {}));
