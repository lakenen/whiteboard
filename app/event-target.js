/**
 * @fileoverview Definition of a custom event type. This is used as a utility
 * throughout the framework whenever custom events are used. It is intended to
 * be inherited from, either through the prototype or via mixin.
 * @author Cameron Lakenen
 */

/*global Whiteboard*/
Whiteboard.EventTarget = (function () {
    'use strict';

    /**
     * An object that is capable of generating custom events and also
     * executing handlers for events when they occur.
     * @constructor
     */
    function EventTarget() {

        /**
         * Map of events to handlers. The keys in the object are the event names.
         * The values in the object are arrays of event handler functions.
         * @type {Object}
         * @private
         */
        this._handlers = {};
    };

    EventTarget.prototype = {

        // restore constructor
        constructor: EventTarget,

        /**
         * Adds a new event handler for a particular type of event.
         * @param {string} type The name of the event to listen for.
         * @param {Function} handler The function to call when the event occurs.
         * @returns {void}
         */
        on: function(type, handler) {
            if (typeof this._handlers[type] === 'undefined') {
                this._handlers[type] = [];
            }

            this._handlers[type].push(handler);
        },

        /**
         * Fires an event with the given name and data.
         * @param {string} type The type of event to fire.
         * @param {Object} data An object with properties that should end up on
         *      the event object for the given event.
         * @returns {void}
         */
        fire: function(type, data) {
            var handlers,
                i,
                len,
                event = {
                    type: type,
                    data: data
                };

            // if there are handlers for the event, call them in order
            handlers = this._handlers[event.type];
            if (handlers instanceof Array) {
                for (i = 0, len = handlers.length; i < len; i++) {
                    if (handlers[i]) {
                        handlers[i].call(this, event);
                    }
                }
            }

            // call handlers for `all` event type
            handlers = this._handlers.all;
            if (handlers instanceof Array) {
                for (i = 0, len = handlers.length; i < len; i++) {
                    if (handlers[i]) {
                        handlers[i].call(this, event);
                    }
                }
            }
        },

        /**
         * Removes an event handler from a given event.
         * If the handler is not provided, remove all handlers of the given type.
         * @param {string} type The name of the event to remove from.
         * @param {Function} handler The function to remove as a handler.
         * @returns {void}
         */
        off: function(type, handler) {

            var handlers = this._handlers[type],
                i,
                len;

            if (handlers instanceof Array) {
                if (!handler) {
                    handlers.length = 0;
                    return;
                }
                for (i = 0, len = handlers.length; i < len; i++) {
                    if (handlers[i] === handler || handlers[i].handler === handler) {
                        handlers.splice(i, 1);
                        break;
                    }
                }
            }
        },


        /**
         * Adds a new event handler that should be removed after it's been triggered once.
         * @param {string} type The name of the event to listen for.
         * @param {Function} handler The function to call when the event occurs.
         * @returns {void}
         */
        one: function(type, handler) {
            var me = this,
                proxy = function (event) {
                    me.off(type, proxy);
                    handler.call(me, event);
                };
            proxy.handler = handler;
            this.on(type, proxy);
        }
    };

    return EventTarget;
})();
