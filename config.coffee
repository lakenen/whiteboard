exports.config =
  # See http://brunch.io/#documentation for docs.
  modules:
    # only wrap templates in commonjs wrapper
    wrapper: (fullPath, data) ->
      if /templates/.test(fullPath)
        sourceURLPath = fullPath.replace(/^app\/templates\//, '')
        moduleName = sourceURLPath.replace(/\.\w+$/, '')
        path = JSON.stringify(moduleName)
        path =
        """
        require.define(#{path}, function(exports, require, module) {
          #{data}
        });\n\n
        """
      else
        "#{data}"
  files:
    javascripts:
      joinTo:
        'javascripts/app.js': /^app/
        'javascripts/vendor.js': /^(bower_components|vendor)/
      order:
        before: [
          'app/whiteboard.js',
          'app/context.js',
          'app/event-target.js'
          'app/history.js'
        ]
    stylesheets:
      defaultExtension: 'scss'
      joinTo:
        'stylesheets/app.css' : /^(app|vendor|bower_components)/
      order:
        before: ['**/normalize.css']
    templates:
      precompile: true
      root: 'templates'
      defaultExtension: 'hbs'
      joinTo: 'javascripts/app.js'
