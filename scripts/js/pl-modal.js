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
                effectName: '',
                avoidClose: false
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
            this._modal.className = 'pl-modal' + ' ' + this._settings['effectName'];
            // Create modal content.
            this._content = document.createElement('div');
            this._content.className = 'pl-modal-content';
            this._modal.appendChild(this._content);
            // Create close button element.
            if (!this._settings['avoidClose']) {
                this._closeButton = document.createElement('div');
                this._closeButton.className = 'pl-modal-close-button';
                this._content.appendChild(this._closeButton);
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
                this._closeButton.addEventListener('click', function (ev) {
                    _this.close();
                }, false);
            }
            // Bind "this" context to toggleTransition handler.
            this.toggleTransitionend = this.toggleTransitionend.bind(this);
            // Attach handler to transitionend event, when the event occurs for the first time
            // remove the event because transitionend handler will execute the same times as
            // styles modified.
            this._content.addEventListener(this._transitionend, this.toggleTransitionend, false);
        };
        /**
         * Fires when modal is opened.
         */
        Modal.prototype.onOpened = function () {
            if (this._opened) {
                this._opened.fire();
            }
        };
        /**
         * Fires when modal is closed.
         */
        Modal.prototype.onClosed = function () {
            if (this._closed) {
                this._closed.fire();
            }
            this.removeFromDom();
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
            var content = this._content, functionToCall = this._isOpen ? this.onClosed : this.onOpened;
            // Remove transitionend handler to avoid multiple calls depending on css properties modfied.
            content.removeEventListener(this._transitionend, this.toggleTransitionend);
            this._isOpen = !this._isOpen;
            functionToCall.call(this);
            setTimeout(function () {
                content.addEventListener(_this._transitionend, _this.toggleTransitionend, false);
            }, 50);
        };
        /**
         * Change effect from modal.
         * @param {string} effectName
         */
        Modal.prototype.changeEffect = function (effectName) {
            this._settings['effectName'] = effectName;
            this._modal.className = 'pl-modal' + ' ' + this._settings['effectName'];
        };
        /**
         * Close modal and remove from DOM.
         */
        Modal.prototype.close = function () {
            if (!this._isOpen)
                return;
            var body = document.body;
            var overlay = this._overlay;
            var modal = this._modal;
            // Let scroll in body
            body.className = body.className.replace(/\s?\bno-scroll\b/g, '');
            overlay.className = overlay.className.replace(/\s?\bpl-modal-open\b/g, '');
            modal.className = modal.className.replace(/\s?\bpl-modal-open\b/g, '');
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
         * Add modal to DOM and show it.
         * @param {HTMLElement|string} element
         */
        Modal.prototype.open = function (element) {
            if (this._isOpen)
                return;
            var body = document.body;
            var overlay = this._overlay;
            var modal = this._modal;
            var content = this._content;
            this.setContent(element);
            body.appendChild(overlay);
            body.appendChild(modal);
            // Avoid scroll in void since modal is open.
            body.className += 'no-scroll';
            // Force the browser to recognize the elements that we just added.
            window.getComputedStyle(overlay).backgroundColor;
            window.getComputedStyle(modal).opacity;
            window.getComputedStyle(content).opacity;
            overlay.className += ' pl-modal-open';
            modal.className += ' pl-modal-open';
        };
        /**
         * Set modal content.
         * @param {HTMLElement|string} element
         */
        Modal.prototype.setContent = function (element) {
            if (element === void 0) { element = ""; }
            var content = this._content;
            // Empty content element.
            content.innerHTML = '';
            if (!this._settings['avoidClose'])
                content.appendChild(this._closeButton);
            if ("string" === typeof element)
                content.appendChild(document.createTextNode(element));
            else
                content.appendChild(element);
        };
        return Modal;
    }());
    pl.Modal = Modal;
})(pl || (pl = {}));
