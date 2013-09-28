/**
 * @fileoverview HelloWorld module definition
 * @author Cameron Lakenen
 */
Whiteboard.addModule('home', function (context) {
    'use strict';

    var dom = context.getService('dom'),
        element = context.getElement();

    function handleClick(ev) {
        if (ev.target.classList.contains('home-back-button')) {
            element.classList.remove('home-selected-left')
            element.classList.remove('home-selected-right');
        } else if (this.classList.contains('home-option-left')) {
            element.classList.add('home-selected-left');
            context.broadcast('presentation-request');
        } else if (this.classList.contains('home-option-right')) {
            element.classList.add('home-selected-right');
        }
    }

    return {
        init: function () {
            var tmpl = require('modules/home');
            dom.setHTML(element, tmpl({
                user: 'Cameron',
                etc: '...'
            }));

            this.bindEvents();
        },

        destroy: function () {
            context.query('.home-option-left').removeEventListener('click', handleClick);
            context.query('.home-option-right').removeEventListener('click', handleClick);
        },

        bindEvents: function () {
            context.query('.home-option-left').addEventListener('click', handleClick);
            context.query('.home-option-right').addEventListener('click', handleClick);
        }
    };
});
