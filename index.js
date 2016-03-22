var UglifyJS = require("uglify-js");
var loaderUtils = require('loader-utils');

module.exports = function(source, inputSourceMap) {
    var callback = this.async();

    if (this.cacheable) {
        this.cacheable();
    }

    var opts = this.options['uglify-loader'] || {};
    // just an indicator to generate source maps, the output result.map will be modified anyway
    // tell UglifyJS2 not to emit a name by just setting outSourceMap to true
    opts.outSourceMap = !!(this.sourceMap || inputSourceMap);
    opts.inSourceMap = inputSourceMap
    opts.fromString = true;

    var result = UglifyJS.minify(source, opts);

    if (result.map) {
        var sourceFilename = loaderUtils.getRemainingRequest(this);
        var current = loaderUtils.getCurrentRequest(this);
        var sourceMap = JSON.parse(result.map);
        sourceMap.sources = [sourceFilename];
        sourceMap.file = current;
        if (inputSourceMap) {
            sourceMap.sourcesContent = inputSourceMap.sourcesContent;
        } else {
            sourceMap.sourcesContent = [source];
        }
        callback(null, result.code, sourceMap);
    } else {
        callback(null, result.code);
    }
};
