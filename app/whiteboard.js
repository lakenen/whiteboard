/**
 * @fileoverview Whiteboard Application
 * @author Cameron Lakenen
 */
Whiteboard = (function () {
    'use strict';

    var MODULE_SELECTOR = '.module';

    var modules = {},
        services = {},
        instances = {};

    function callModuleMethod(instance, method) {
        if (typeof instance[method] === 'function') {
            instance[method].call(instance);
        }
    }

    return {

        /**
         * Bootstraps the application and initializes all modules currently in the DOM
         * @returns {void}
         */
        init: function (selector) {
            this.element = this.getService('dom').query(selector);
            Whiteboard.History.start();
            this.startAllModules(document.body);
        },

        /**
         * Register a new module
         * @param  {string} name      The (unique) name of the module
         * @param  {Function} creator Factory function used to create an instance of the module
         * @returns {void}
         */
        addModule: function (name, creator) {
            modules[name] = {
                creator: creator,
                counter: 1
            };
        },

        /**
         * Initializes a module and calls init method if exists
         * @param  {HTMLElement} element
         * @returns {void}
         */
        startModule: function (element) {
            var dom = this.getService('dom'),
                moduleName = dom.getData(element, 'module'),
                moduleData = modules[moduleName],
                instanceData,
                instance,
                context;

            if (moduleData && !this.isModuleStarted(element)) {
                if (!element.id) {
                    element.id = moduleName + '-' + moduleData.counter;
                }

                moduleData.counter++;

                context = new Whiteboard.Context(this, element);
                instance = moduleData.creator(context);

                instanceData = {
                    moduleName: moduleName,
                    instance: instance,
                    context: context,
                    element: element
                };

                instances[element.id] = instanceData;

                callModuleMethod(instance, 'init');
            }
        },

        /**
         * Stops a module and calls destroy method if exists
         * @param  {HTMLElement} element
         * @returns {void}
         */
        stopModule: function (element) {
            var instanceData = instances[element.id];

            if (instanceData) {
                callModuleMethod(instanceData.instance, 'destroy');
                delete instances[element.id];
            }
        },

        /**
         * Starts all modules contained within the given element
         * @param  {HTMLElement} rootElement
         * @returns {void}
         */
        startAllModules: function (rootElement) {
            var i, len,
                dom = this.getService('dom'),
                moduleElements = dom.queryAll(MODULE_SELECTOR, rootElement);

            for (i = 0, len = moduleElements.length; i < len; ++i) {
                this.startModule(moduleElements[i]);
            }
        },

        /**
         * Stops all modules contained within the given element
         * @param  {HTMLElement} rootElement
         * @returns {void}
         */
        stopAllModules: function (rootElement) {
            var i, len,
                dom = this.getService('dom'),
                moduleElements = dom.queryAll(MODULE_SELECTOR, rootElement);

            for (i = 0, len = moduleElements.length; i < len; ++i) {
                this.stopModule(moduleElements[i]);
            }
        },

        /**
         * Returns true if the module for the given element is started
         * @param  {HTMLElement}  element   The element
         * @returns {Boolean}                True if the module is started, false if not
         */
        isModuleStarted: function (element) {
            var instanceData = instances[element.id];
            return typeof instanceData === 'object';
        },

        /**
         * Broadcast a message to all modules that have registered a
         * listener for the named message type
         * @param  {string} messageName The message name
         * @param  {any} data           The message data
         * @returns {void}
         */
        broadcast: function (messageName, data) {
            var id, instanceData, instance, messages;

            for (id in instances) {
                instanceData = instances[id];
                instance = instanceData.instance;
                messages = instance.messages || [];

                if (messages.indexOf(messageName) !== -1) {
                    if (typeof instance.onmessage === 'function') {
                        instance.onmessage.call(instance, messageName, data);
                    }
                }
            }
        },

        /**
         * Register a new service
         * @param  {string} name      The (unique) name of the service
         * @param  {Function} creator Factory function used to create an instance of the service
         * @returns {void}
         */
        addService: function (name, creator) {
            services[name] = {
                creator: creator,
                instance: null
            };
        },

        /**
         * Retrieve the named service
         * @param {string} name The name of the service to retrieve
         * @returns {?Object}   The service or null if the service doesn't exist
         */
        getService: function (name) {
            var service = services[name];

            if (service) {
                if (!service.instance) {
                    service.instance = service.creator(this);
                }

                return service.instance;
            }

            return null;
        },

        addRoute: function (route, router) {
            Whiteboard.History.route(route, function () {
                router(Whiteboard).apply(null, arguments);
            });
        },

        getElement: function () {
            return this.element;
        }
    };
})();
