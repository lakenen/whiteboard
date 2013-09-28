

Whiteboard.addRoute(/^$/, function (application) {
    var dom = application.getService('dom');

    return function indexRoute(fragment) {
        var mainElement = application.getElement(),
            template = require('index');
        dom.setHTML(mainElement, template());
    };
});
