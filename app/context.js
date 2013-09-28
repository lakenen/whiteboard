/**
 * @fileoverview Context class definition
 * @author Cameron Lakenen
 */

/**
 * Context class used for module scoping (creating, destroying, broadcasting messages)
 * @param {Whiteboard} application The application object to wrap
 * @constructor
 */
Whiteboard.Context = (function () {

    'use strict';

    return function Context(application, element) {
        var dom = application.getService('dom');

        /**
         * Passthrough method to the application that broadcasts a message to all
         * modules that have registered a listener for the named message type
         * @param  {string} messageName The message name
         * @param  {any} data           The message data
         * @returns {void}
         */
        this.broadcast = function (messageName, data) {
            application.broadcast(messageName, data);
        };

        /**
         * Passthrough method to the application that retrieves services
         * @param {string} name The name of the service to retrieve
         * @returns {?Object}   An object if the service is found or null if not
         */
        this.getService = function (name) {
            return application.getService(name);
        };

        /**
         * Return the element associated with this module context
         * @return {HTMLElement}
         */
        this.getElement = function () {
            return element;
        };


        /**
         * Passthrough method to query the DOM in the context of the element
         * @param   {string} selector
         * @returns {HTMLElement}
         */
        this.query = function (selector) {
            return dom.query(selector, element);
        };

        /**
         * Passthrough method to queryAll the DOM in the context of the element
         * @param   {string} selector
         * @returns {HTMLElement}
         */
        this.queryAll = function (selector) {
            return dom.queryAll(selector, element);
        };
    };
})();
