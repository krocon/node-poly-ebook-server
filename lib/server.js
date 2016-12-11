(function () {
    'use strict';

    var express = require('express');
    var path = require('path');
    var dirscanner = require('./dirscanner.js').dirscanner;
    var fileutil = require('./fileutil.js').fileutil;
    var sendmail = require('./sendmail.js').sendmail;

    exports.start = function (options) {
        var app = express();

        var clientRoot = options.clientRoot;
        var port = options.port;
        if (!port) port = app.get('port');
        if (!port) port = process.env.PORT;
        if (!port) port = 3000;

        app.set('port', port);
        app.set('json spaces', 0); // 0 for production
        app.use('/', express.static(clientRoot));

        // config as json:
        app.get('/init.json', function (req, res) {
            res.json(options);
        });

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

                if (section.trashDir) {
                    app.use('/' + i + '/delete', function (req, res) {
                        if (req.headers.referer.indexOf('localhost') === -1) return res.send('Error: Access denied!');
                        var epub = decodeURI(req.url);
                        console.info('server: delete() ', epub);
                        fu.moveToTrash(epub, section, function (error) {
                            if (error) {
                                console.error('error', error);
                                res.send({
                                    file: epub,
                                    method: 'delete',
                                    error: error,
                                    msg: 'Could not delete file ' + epub
                                });

                            } else {
                                var idx = ds.getFiles().indexOf('file' + epub);
                                console.info('epub i', idx);
                                if (idx > -1) ds.getFiles().splice(idx, 1);
                                res.send({
                                    file: epub,
                                    method: 'delete',
                                    error: false,
                                    msg: 'Deleted successfully: ' + epub
                                });
                            }
                        });
                    });
                }

                if (section.copyDir) {
                    app.use('/' + i + '/copy', function (req, res) {
                        //if (req.headers.referer.indexOf('localhost') === -1) return res.send('Error: Access denied!');
                        var epub = decodeURI(req.url);
                        console.log('copy', epub);
                        fu.copy(epub, section, function (error) {
                            if (error) console.error('error', error);
                            res.send({
                                file: epub,
                                method: 'copy',
                                error: error,
                                msg: (error ? 'Could not copy: ' : 'Copied successfully: ') + epub
                            });
                        });
                    });
                }

                var sendLinkVisible = !!(section.sendOptions && section.sendOptions.sendlink);
                var sendAttachmentVisible = !!(section.sendOptions && section.sendOptions.sendattachment);
                if (sendLinkVisible || sendAttachmentVisible) {
                    var mailService = new sendmail(section);

                    if (mailService.isSendAttachmentEnabled()) {
                        app.use('/' + i + '/sendattachment', function (req, res) {
                            var epub = decodeURI(req.url);
                            console.log('sending attachment', epub);
                            mailService.sendAttachment(epub, function (error) {
                                if (error) console.error('error', error);
                                res.send({
                                    file: epub,
                                    method: 'sendattachment',
                                    error: error,
                                    msg: (error ? 'Could not send as link: ' : 'Sent successfully: ') + epub
                                });
                            });
                        });
                    }

                    if (mailService.isSendLinkEnabled()) {
                        app.use('/' + i + '/sendlink', function (req, res) {
                            var epub = decodeURI(req.url);
                            console.log('sending link', epub);
                            mailService.sendLink(epub, function (error) {
                                if (error) console.error('error', error);
                                res.send({
                                    file: epub,
                                    method: 'copy',
                                    error: error,
                                    msg: (error ? 'Could not send as link: ' : 'Sent successfully: ') + epub
                                });
                            });
                        });
                    }
                }
            })(i);
        }


        // Handle 404
        app.use(function (req, res) {
            res.sendFile(path.resolve(clientRoot + '/img/blank.gif'));
        });

        var server = app.listen(port, function (error) {
            if (error) console.error(error);
            var host = server.address().address;
            var now = new Date();

            console.log('Server app');
            console.log('   ...started   at : %s', now);
            console.log('   ...listening at : http://%s:%s', host.replace('::', 'localhost'), port);
        });
    };

})();