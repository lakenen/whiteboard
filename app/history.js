
Whiteboard.History = (function () {

    // Cached regex for stripping a leading hash/slash and trailing space.
    var routeStripper = /^[#\/]|\s+$/g;

    // Cached regex for stripping leading and trailing slashes.
    var rootStripper = /^\/+|\/+$/g;

    // Cached regex for removing a trailing slash.
    var trailingSlash = /\/$/;

    return {
        started: false,
        handlers: [],

        // Get the normalized URL fragment
        getFragment: function(fragment) {
            if (fragment == null) {
                fragment = this.location.pathname;
                var root = this.root.replace(trailingSlash, '');
                if (!fragment.indexOf(root)) {
                    fragment = fragment.substr(root.length);
                }
            }
            return fragment.replace(routeStripper, '');
        },

        // Start the hash change handling, returning `true` if the current URL matches
        // an existing route, and `false` otherwise.
        start: function(options) {
            if (this.started) {
                return;
            }
            this.started = true;

            this.checkUrl = this.checkUrl.bind(this);

            this.location = window.location;
            this.history = window.history;

            // Figure out the initial configuration
            this.options = _.extend({}, {root: '/'}, this.options, options);
            this.root = this.options.root;
            this.fragment = this.getFragment();

            // Normalize root to always include a leading and trailing slash.
            this.root = ('/' + this.root + '/').replace(rootStripper, '/');
            window.addEventListener('popstate', this.checkUrl);

            if (!this.options.silent) {
                return this.loadUrl();
            }
        },

        // Disable history, perhaps temporarily. Not useful in a real app,
        // but possibly useful for unit testing Routers.
        stop: function() {
            window.removeEventListener('popstate', this.checkUrl);
            this.started = false;
        },

        // Add a route to be tested when the fragment changes. Routes added later
        // may override previous routes.
        route: function(route, callback) {
            this.handlers.unshift({route: route, callback: callback});
        },

        /**
         * Checks the current URL to see if it has changed, and if it has, calls `loadUrl`
         * @returns {boolean}
         */
        checkUrl: function() {
            var current = this.getFragment();
            if (current === this.fragment) {
                return false;
            }
            this.loadUrl();
        },

        /**
         * Attempt to load the current URL fragment. If a route succeeds with a
         * match, returns `true`. If no defined routes matches the fragment,
         * returns `false`.
         * @param  {string} [fragmentOverride] Override the current fragment with
         *                                     a specified fragment string
         * @returns {boolean}
         */
        loadUrl: function(fragmentOverride) {
            var fragment = this.fragment = this.getFragment(fragmentOverride);
            var matched = _.any(this.handlers, function(handler) {
                if (handler.route.test(fragment)) {
                    handler.callback(fragment);
                    return true;
                }
            });
            return matched;
        },

        /**
         * Navigate to the given URL fragment
         * @param {string} fragment         The URL fragment to navigate to
         * @param {Object} [options]        Options object or boolean passthrough to
         *                                  options.trigger
         * @param {boolean} options.trigger Whether to fire the route callback
         * @param {boolean} options.replace Whether to modify the current URL
         *                                  without adding an entry to the history
         * @returns {void}
         */
        navigate: function(fragment, options) {
            if (!this.started) {
                return false;
            }

            // if options not specified or is boolean, use options as the trigger param
            if (!options || options === true) {
                options = {trigger: options};
            }
            fragment = this.getFragment(fragment || '');
            if (this.fragment === fragment) {
                return;
            }
            this.fragment = fragment;
            var url = this.root + fragment;

            // use pushState to set the fragment as a real URL
            this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);

            if (options.trigger) {
                this.loadUrl(fragment);
            }
        }
    };
})();
