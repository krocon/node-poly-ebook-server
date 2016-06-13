(function(){

    'use strict';

    var path = require('path');
    var fs = require('fs-extra');

    exports.fileutil = function() {

        var moveToTrash = function moveToTrash(file, options, callback) {
            var baseDir = options.baseDir;
            var trashDir = options.trashDir;

            var source = path.join(baseDir, file);
            var target = path.join(trashDir, path.basename(file));

            fs.move(source, target , function(error) {
                if (error) return callback(error);

                fs.move(
                    source.substr(0, source.lastIndexOf('.')) + '.jpg',
                    target.substr(0, target.lastIndexOf('.')) + '.jpg', function(){
                        callback();
                    });
            });
        };

        var copy = function copy(file, options, callback) {
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
                callback(err);
            }
        };

        var ret = {};
        ret.copy = copy;
        ret.moveToTrash = moveToTrash;
        return ret;
    };

})();