(function () {
    'use strict';

    var request = require("request");
    var cheerio = require("cheerio");
    var Entities = require('html-entities').XmlEntities;

    var entities = new Entities();
    var re2 = /^[\s]+|[\s]+$/g;

    var getSecondTd = function getSecondTd($, firstColumn){
        var tr = $('td:contains(' + firstColumn + ')').closest('tr');
        var t = tr.children().last().text();
        if (t !== null) {
            return normalize(t.replace(re2, ''));
        }
        return null;
    };

    var getOpenGraphTag = function getOpenGraphTag(html, key){
        var found = new RegExp('^.*"og:' + key + '"\\s+content="(.*)".*$', 'gm').exec(html);
        if (found === null) return null;

        var xml = found[1];
        if (xml === 'ISBN . ') return null;
        return entities.decode(xml);
    };

    var getImg = function getImg(html){
        var s = getOpenGraphTag(html, 'image');
        if (!s) return null;
        return s.replace(/-\d\d\//g, '-00/');
    };

    var normalize = function normalize(s) {
        if (!s) return null;
        return s.replace(re2, '');
        //return entities.decode('&#xFFFD;  ' + s.replace(re2, ''));
    };

    exports.grab = function (s, callback) {
        var url = 'http://www.buch.de/shop/home/suche/?sq=' + s.replace(re2, '');
        console.log(url);

        request({
            url: url
        }, function (error, response, body) {
            if (error) return callback(error, null);
            var html = body.toString('latin');

            if (html.indexOf('Ihre Suche nach')> -1) return callback('no hit', null);

            html = entities.decode(html);
            var $ = cheerio.load(html, {
                normalizeWhitespace: false,
                xmlMode: false,
                decodeEntities: false
            });
            console.log($('span.oProductTitle').html());
            var ret = {
                desc: getOpenGraphTag(html, 'description'),
                buchdeUrl: getOpenGraphTag(html, 'url'),
                buchdeImg: getImg(html),
                pages: getSecondTd($, 'Seitenzahl'),
                age: getSecondTd($, 'Altersempfehlung'),
                lang: getSecondTd($, 'Sprache'),
                publisher: getSecondTd($, 'Verlag'),
                isbn13: getSecondTd($, 'ISBN'),
                ean: getSecondTd($, 'EAN'),
                releaseDate: getSecondTd($, 'Erscheinungsdatum'),
                author: normalize($('.oAuthorLink').html()),
                authorPortrait: normalize($('.cTypePortrait').html()),
                title: getOpenGraphTag(html, 'title'), //normalize($('.oProductTitle').html()),
                subtitle: normalize($('.oSubTitle').html())
            };
            console.log(ret); // todo weg
            callback(false, ret);
        });
    };


})();