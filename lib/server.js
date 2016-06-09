(function () {
    'use strict';

    var express = require('express');
    var path = require('path');
    // var ecomic = require('ecomic');
    var dirscanner = require('./dirscanner.js').dirscanner;
    var fileutil = require('./fileutil.js').fileutil;
    // var sendmail = require('./sendmail.js').sendmail;
    // var grabBuchDe = require('./grabbuchde.js');

    exports.start = function (options) {
        var app = express();

        /*
        var baseDir = options.baseDir;
        var bookExtensions = options.bookExtensions ? options.bookExtensions : ['.epub'];
        var trashDir = options.trashDir;
        var copyDir = options.copyDir;
        var cacheFile = options.cacheFile;
        var mailService = new sendmail(options);

        var deletable = !!options.deletable;
*/
        var clientRoot = options.clientRoot;
        var port = options.port | app.get('port') | process.env.PORT | 3000;
        app.set('port', port);
        app.set('json spaces', 0); // 0 for production
        // app.use('/', express.static('../client'));
        app.use('/', express.static(clientRoot));

        // config as json:
        app.get('/init.json', function (req, res) {
            res.json(options);
        });
        /*

        // grab additional info from internet:
        app.get('/grab', function (req, res) {
            grabBuchDe.grab(req.query.s, function (error, o) {
                if (!error) res.send(o);
            });
        });
        
        // not used at the moment:
        // app.get('/admin/createthumbs', function (req, res) {
        //     var glob = [];
        //     for (var i = 0; i < options.bookExtensions.length; i++) {
        //         glob.push(options.bookExtensions[i]);
        //     }
        //     var g =  options.baseDir + '/**       /*' + '+(' + glob.join('|') + ')';
        //     console.info(g);
        //     try {
        //         ecomic.extractCoverGlob(g, {
        //             overwrite: false,
        //             quite: true,
        //             tmpDir: options.tmpDir,
        //             outputs: [
        //                 {nameExtension: "", dimension: [420, 600]} // TODO abc.epub -> abc.jpg
        //             ]
        //         }, function (err, files) {
        //             if (err) return console.error(err);
        //             res.send(err);
        //         });
        //     } catch (e) {
        //         res.send(e);
        //     }
        // });
        
        if (copyDir) {
            app.use('/copy', function (req, res) {
                var epub = decodeURI(req.url); //  "/Romane/alphabet/deu/A/Ablow, Keith - Kalt, Kaltes Herz [Krimi].epub"
                console.log('copy', epub);
                fu.copy(epub, function(error){
                    res.send(error);
                });
            });
        }

        if (mailService.isSendAttachmentEnabled()) {
            app.use('/sendattachment', function (req, res) {
                var epub = decodeURI(req.url);
                console.log('sending attachment', epub);
                mailService.sendAttachment(epub, function (error) {
                    res.send(error);
                });
            });
        }

        if (mailService.isSendLinkEnabled()) {
            app.use('/sendlink', function (req, res) {
                var epub = decodeURI(req.url);
                console.log('sending link', epub);
                mailService.sendLink(epub, function (error) {
                    res.send(error);
                });
            });
        }
        if (deletable) {
            app.use('/delete', function (req, res) { // req.headers.referer http://91.11.227.203/
                if (req.headers.referer.indexOf('localhost') === -1) return res.send('Error: Access denied!');
                var epub = decodeURI(req.url); //
                // move to trash:
                fu.moveToTrash(epub, function (error) {
                    if (error) console.error('error', error);
                    res.send(error);
                });
            });
        }
*/


        var dss = [];
        var fus = [];
        for (var i=0; i< options.sections.length; i++){
            (function(i){
                var addIdx = function(s){
                    return i + '/' + s;
                };
                var section = options.sections[i];
                var ds = new dirscanner();
                ds.scan(section.baseDir, section.bookExtensions, section.cacheFile);
                var fu = new fileutil(options);
                dss.push(ds);
                fus.push(fu);

                // array of ebooks (full path):
                app.get('/' + i + '/files.json', function (req, res) {
                    res.json(ds.getFiles().map(addIdx).sort());
                });
                app.use('/' + i + '/file', express.static(section.baseDir));
                app.use('/' + i + '/img', express.static(section.baseDir));
                app.get('/' + i + '/info', function (req, res) {
                    res.send(ds.getInfo());
                });
                app.use('/' + i + '/delete', function (req, res) { // req.headers.referer http://91.11.227.203/
                    if (req.headers.referer.indexOf('localhost') === -1) return res.send('Error: Access denied!');
                    var epub = decodeURI(req.url);
                    fu.moveToTrash(epub, section, function (error) {
                        if (error) {
                            console.error('error', error);
                            res.send(error);

                        } else {
                            var idx = ds.getFiles().indexOf('file' + epub);
                            console.info('epub i', idx);
                            if (idx > -1) ds.getFiles().splice(idx, 1);
                            res.send('');
                        }
                    });
                });
                app.use('/' + i + '/copy', function (req, res) { // req.headers.referer http://91.11.227.203/
                    //if (req.headers.referer.indexOf('localhost') === -1) return res.send('Error: Access denied!');
                    var epub = decodeURI(req.url);
                    console.log('copy', epub);
                    fu.copy(epub, section, function(error){
                        res.send(error);
                    });
                });
            })(i);
        }


        // Handle 404
        app.use(function (req, res) {
            //console.info('404', req.originalUrl);
            res.sendFile(path.resolve(clientRoot + '/img/blank.gif'));
        });

        var server = app.listen(port, function (error) {
            if (error) console.error(error);
            var host = server.address().address;
            var now = new Date();

            console.log('Server app');
            console.log('   ...started   at : %s', now);

            // console.log('   ...read         : %s', baseDir);
            // console.log('   ...ext          : %s', bookExtensions);
            // console.log('   ...copyDir      : %s', copyDir);
            // if (deletable) console.log('   ...trash        : %s', trashDir);
            // if (cacheFile) console.log('   ...cacheFile    : %s', cacheFile);
            // console.log('   ...send attachment enabled  : %s', mailService.isSendAttachmentEnabled());
            // console.log('   ...send link enabled        : %s', mailService.isSendLinkEnabled());
            console.log('   ...listening at : http://%s:%s', host.replace('::', 'localhost'), port);
        });
    };

})();