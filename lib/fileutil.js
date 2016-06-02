(function(){

    'use strict';

    var path = require('path');
    //var fs = require('fs');
    var fs = require('fs-extra');

    exports.fileutil = function(_options) {
        var options= _options;

        var moveToTrash = function moveToTrash(file, callback) {
            var baseDir = options.baseDir;
            var trashDir = options.trashDir;

            var source = path.join(baseDir, file);
            var target = path.join(trashDir, path.basename(file));

            fs.rename(source, target , function(error) {
                if (error) return callback(error);

                fs.rename(
                    source.replace('.epub', '.jpg'), // TODO alle extensions berücksichtigen!   options.bookExtensions
                    target.replace('.epub', '.jpg'), callback);
            });
        };

        var copy = function copy(file, callback) {
            try { // todo ist das nötig?
                var baseDir = options.baseDir;
                var copyDir = options.copyDir;

                var source = path.join(baseDir, file);
                var target = path.join(copyDir, path.basename(file));

                fs.copy(source, target, function (error) {
                    if (error) console.error(error);
                    callback(error);
                });

            } catch(err) {
                callback(error);
            }
        };

        var ret = {};
        ret.copy = copy;
        ret.moveToTrash = moveToTrash;
        return ret;
    };

})();