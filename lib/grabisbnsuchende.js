(function () {
    'use strict';

    var request = require("request");
    var cheerio = require("cheerio");
    var Entities = require('html-entities').XmlEntities;
    var path = require('path');


    var getDescription = function getDescription(html){
        var re = /<meta\s*name="description"\s*content="(.*)"\s*\/>/gm;
        var found = re.exec(html);
        if (found === null) return null;

        var xml = found[1];
        if (xml === 'ISBN . ') return null;
        var entities = new Entities();
        var txt = entities.decode(xml);
        return txt;
    };

    var getIsbn = function getIsbn(html){
        var re = />ISBN\s+(\d*)</gm;
        var found = re.exec(html);
        if (found === null) return null;

        var xml = found[1];
        var entities = new Entities();
        var txt = entities.decode(xml);
        return txt;
    };

    exports.grab = function (f, callback) {
        var name = path.basename(f)
            .replace(/\.epub/g, '')
            .replace(/\s*\[.*?\]\s*/ig, '');

        var url = 'http://www.isbn-suchen.de/search.php5?q=' + name;
        console.log(url);

        request({
            url: url

        }, function (error, response, body) {
            if (error) return cb();

            var html = body.toString('utf8');
            //var $ = cheerio.load(html);

            var desc = getDescription(html);
            var isbn = getIsbn(html);

            console.log('desc', desc);
            console.log('isbn', isbn);
            callback({isbn: isbn, desc: desc})

        });
    };


})();