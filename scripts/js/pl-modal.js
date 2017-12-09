/**
 * Created by cesarmejia on 20/08/2017.
 */
var pl;
(function (pl) {
    var Event = (function () {
        /**
         * Create a Event instance.
         * @constructor
         */
        function Event() {
            this._handlers = [];
            this._scope = this || window;
        }
        /**
         * Add new handler.
         * @param {function} handler
         */
        Event.prototype.add = function (handler) {
            if (handler) {
                this._handlers.push(handler);
            }
        };
        /**
         * Excecute all suscribed handlers.
         */
        Event.prototype.fire = function () {
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
        Event.prototype.remove = function (handler) {
            this._handlers = this._handlers.filter(function (fn) {
                if (fn != handler)
                    return fn;
            });
        };
        return Event;
    }());
    pl.Event = Event;
})(pl || (pl = {}));
/**
 * Created by cesarmejia on 20/08/2017.
 */
(function (pl) {
    var Modal = (function () {
        // endregion
        /**
         * Create an instance of Modal.
         * @constructor
         * @param {object} settings
         */
        function Modal(settings) {
            // endregion
            // region Fields
            /**
             * Flag that indicate if the modal is open or not.
             * @type {boolean}
             */
            this._isOpen = false;
            // Define default options.
            var defaults = {
                avoidClose: false,
                closeWithOverlay: true,
                effectName: ''
            };
            // Create settings by extending defaults with passed
            // settings in constructor.
            this._settings = Modal.extendsDefaults(defaults, settings || {});
            // Select transitionend that browser support.
            this._transitionend = Modal.transitionSelect();
            this.buildOut();
            this.initializeEvents();
        }
        // region Static
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
                if (settings.hasOwnProperty(property)) {
                    source[property] = settings[property];
                }
            }
            return source;
        };
        // region Private Methods
        /**
         * Create modal elements.
         */
        Modal.prototype.buildOut = function () {
            // Create modal content.
            this.modal.appendChild(this.content);
            // Create close button element.
            if (!this._settings['avoidClose']) {
                debugger;
                this.content.appendChild(this.closeButton);
            }
        };
        /**
         * Attach handlers to modal elements.
         */
        Modal.prototype.initializeEvents = function () {
            var _this = this;
            if (!this._settings['avoidClose']) {
                var ESC_KEY_1 = 27;
                // Close modal if user press esc key.
                document.addEventListener('keydown', function (ev) {
                    if (ev.keyCode == ESC_KEY_1)
                        _this.close();
                }, false);
                // Close modal if user clicks the close button.
                this.closeButton.addEventListener('click', function (ev) {
                    _this.close();
                }, false);
                // Close modal if user clicks the overlay.
                if (this._settings['closeWithOverlay']) {
                    this.overlay.addEventListener('click', function (ev) {
                        _this.close();
                    }, false);
                }
            }
            // Bind "this" context to toggleTransition handler.
            this.toggleTransitionend = this.toggleTransitionend.bind(this);
            // Attach handler to transitionend event, when the event occurs for the first time
            // remove the event because transitionend handler will execute the same times as
            // styles modified.
            this.content.addEventListener(this._transitionend, this.toggleTransitionend, false);
        };
        /**
         * Remove elements from DOM.
         */
        Modal.prototype.removeFromDom = function () {
            this.overlay.parentNode.removeChild(this.overlay);
            this.modal.parentNode.removeChild(this.modal);
        };
        /**
         * Control the flow of transitionend handler and modal.
         * @param {TransitionEvent} ev
         */
        Modal.prototype.toggleTransitionend = function (ev) {
            var _this = this;
            var functionToCall = this._isOpen ? this.onClosed : this.onOpened;
            // Remove transitionend handler to avoid multiple calls depending on css properties modfied.
            this.content.removeEventListener(this._transitionend, this.toggleTransitionend);
            this._isOpen = !this._isOpen;
            functionToCall.call(this);
            setTimeout(function () {
                _this.content.addEventListener(_this._transitionend, _this.toggleTransitionend, false);
            }, 50);
        };
        // endregion
        // region Methods
        /**
         * Close modal and remove from DOM.
         */
        Modal.prototype.close = function () {
            if (!this._isOpen)
                return;
            var body = document.body;
            // Let scroll in body
            body.className = body.className.replace(/\s?\bno-scroll\b/g, '');
            this.overlay.className = this.overlay.className.replace(/\s?\bpl-modal-open\b/g, '');
            this.modal.className = this.modal.className.replace(/\s?\bpl-modal-open\b/g, '');
        };
        /**
         * Change effect from modal.
         * @param {string} effectName
         */
        Modal.prototype.changeEffect = function (effectName) {
            this._settings['effectName'] = effectName;
            this.modal.className = "pl-modal " + this._settings['effectName'];
        };
        /**
         * Add modal to DOM and show it.
         * @param {HTMLElement|string} element
         */
        Modal.prototype.open = function (element) {
            if (this._isOpen)
                return;
            var body = document.body;
            this.setContent(element);
            body.appendChild(this.overlay);
            body.appendChild(this.modal);
            // Avoid scroll in void since modal is open.
            body.className += 'no-scroll';
            // Force the browser to recognize the elements that we just added.
            window.getComputedStyle(this.overlay).backgroundColor;
            window.getComputedStyle(this.modal).opacity;
            window.getComputedStyle(this.content).opacity;
            this.overlay.className += ' pl-modal-open';
            this.modal.className += ' pl-modal-open';
        };
        /**
         * Set modal content.
         * @param {HTMLElement|string} element
         */
        Modal.prototype.setContent = function (element) {
            if (element === void 0) { element = ""; }
            // Empty content element.
            this.content.innerHTML = '';
            if (!this._settings['avoidClose']) {
                this.content.appendChild(this.closeButton);
            }
            if ("string" === typeof element) {
                this.content.appendChild(document.createTextNode(element));
            }
            else {
                this.content.appendChild(element);
            }
        };
        Object.defineProperty(Modal.prototype, "closed", {
            /**
             * Get modal closed event.
             * @return {Event}
             */
            get: function () {
                if (!this._closed) {
                    this._closed = new pl.Event();
                }
                return this._closed;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Fires when modal is closed.
         */
        Modal.prototype.onClosed = function () {
            if (this._closed) {
                this._closed.fire();
            }
            this.removeFromDom();
        };
        Object.defineProperty(Modal.prototype, "opened", {
            /**
             * Get modal opened event.
             * @return {Event}
             */
            get: function () {
                if (!this._opened) {
                    this._opened = new pl.Event();
                }
                return this._opened;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Fires when modal is opened.
         */
        Modal.prototype.onOpened = function () {
            if (this._opened) {
                this._opened.fire();
            }
        };
        Object.defineProperty(Modal.prototype, "overlay", {
            /**
             * Get overlay element.
             * @returns {HTMLElement}
             */
            get: function () {
                if (!this._overlay) {
                    this._overlay = document.createElement('div');
                    this._overlay.className = 'pl-modal-overlay';
                }
                return this._overlay;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Modal.prototype, "modal", {
            /**
             * Get modal element.
             * @returns {HTMLElement}
             */
            get: function () {
                if (!this._modal) {
                    this._modal = document.createElement('div');
                    this._modal.className = "pl-modal " + this._settings['effectName'];
                }
                return this._modal;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Modal.prototype, "content", {
            /**
             * Get content element.
             * @returns {HTMLElement}
             */
            get: function () {
                if (!this._content) {
                    this._content = document.createElement('div');
                    this._content.className = 'pl-modal-content';
                }
                return this._content;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Modal.prototype, "closeButton", {
            /**
             * Get close button element.
             * @returns {HTMLElement}
             */
            get: function () {
                if (!this._closeButton) {
                    this._closeButton = document.createElement('div');
                    this._closeButton.className = 'pl-modal-close-button';
                }
                return this._closeButton;
            },
            enumerable: true,
            configurable: true
        });
        return Modal;
    }());
    pl.Modal = Modal;
})(pl || (pl = {}));
