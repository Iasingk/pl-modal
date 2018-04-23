/**
 * Created by cesarmejia on 07/02/2018.
 */
module pl {

    export class Classie {

        /**
         * Adds the specified class to an element.
         * @param {HTMLElement} elem
         * @param {string} className
         */
        static addClass(elem: HTMLElement, className: string) {
            let parts: Array<string> = className.split(" "), i: number = 0;
            if (elem.classList) {
                for (; i < parts.length; i++) { elem.classList.add(parts[i]); }
            } else if (!Classie.hasClass(elem, className)) {
                for (; i < parts.length; i++) { elem.className += " " + parts[i]; }
            }
        }

        /**
         * Determine whether any of the matched elements are assigned the given class.
         * @param {HTMLElement} elem
         * @param {string} className
         * @returns {boolean}
         */
        static hasClass(elem: HTMLElement, className: string) {
            return elem.classList
                ? elem.classList.contains(className)
                : new RegExp("\\b" + className + "\\b").test(elem.className);
        }

        /**
         * Remove class from element.
         * @param {HTMLElement} elem
         * @param {string} className
         */
        static removeClass(elem: HTMLElement, className: string) {
            let parts: Array<string> = className.split(" "), i: number = 0;
            if (elem.classList) {
                for (; i < parts.length; i++) { elem.classList.remove(parts[i]); }
            } else {
                for (; i < parts.length; i++) {
                    elem.className = elem.className.replace(new RegExp("\\b" + parts[i] + "\\b", "g"), '');
                }
            }
        }

        /**
         * Remove all classes in element.
         * @param {HTMLElement} elem
         */
        static reset(elem: HTMLElement) {
            elem.className = '';
        }

        /**
         * Add or remove class from element.
         * @param {HTMLElement} elem
         * @param {string} className
         */
        static toggleClass(elem: HTMLElement, className: string) {
            if (elem.classList) elem.classList.toggle(className);
            else Classie.hasClass(elem, className)
                ? Classie.removeClass(elem, className)
                : Classie.addClass(elem, className)
        }

    }

}