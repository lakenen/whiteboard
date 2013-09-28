/**
 * @fileoverview DOM service definition
 * @author Cameron Lakenen
 */
Whiteboard.addService('dom', function (application) {
    'use strict';

    return {
        query: function (selector, element) {
            return (element || document).querySelector(selector);
        },

        queryAll: function (selector, element) {
            return (element || document).querySelectorAll(selector);
        },

        getData: function (element, property) {
            if (element.dataset) {
                return element.dataset[property];
            } else {
                return element.getAttribute('data-' + property);
            }
        },

        setData: function (element, property, value) {
            if (element.dataset) {
                element.dataset[property] = value;
            } else {
                element.setAttribute('data-' + property, value);
            }
        },

        setHTML: function (element, html) {
            application.stopAllModules(element);
            element.innerHTML = html;
            application.startAllModules(element);
        }
    };
});
