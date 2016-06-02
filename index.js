(function () {

    "use strict";

    module.exports = pes.convert = pes;

    pes.start = function start(options) {
        var server = require('./lib/server.js');
        server.start(options);
    };

    pes();

    function pes() {

    }

})();