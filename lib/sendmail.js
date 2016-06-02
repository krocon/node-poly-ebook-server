(function () {

    'use strict';

    var path = require('path');
    var fs = require('fs-extra');
    var cheerio = require("cheerio");
    var request = require("request");
    var nodemailer = require('nodemailer');


    exports.sendmail = function (_options) {
        var options = _options;
        var sendOptions = options ? options.sendOptions : null;
        var sendattachment = sendOptions ? sendOptions.sendattachment: null;
        var sendlink = sendOptions ? sendOptions.sendlink: null;
        var transporterAttachment = sendattachment ? nodemailer.createTransport(sendattachment.transport) : null;
        var transporterLink = sendlink ? nodemailer.createTransport(sendlink.transport) : null;
        var myIp = null;


        var isSendLinkEnabled = function isSendLinkEnabled(){
            return transporterLink !== null;
        };

        var isSendAttachmentEnabled = function isSendAttachmentEnabled(){
            return transporterAttachment !== null;
        };

        var sendAttachment = function sendAttachment(file, callback) {
            if (!transporterAttachment) return console.error('Error: sendmail (attachment) is not ready, but sendAttachment() is called.');

            var baseDir = options.baseDir;
            var source = path.join(baseDir, file);
            var filename = path.basename(file);

            var mailOptions = {
                from: sendattachment.from,
                to: sendattachment.to,
                subject: sendattachment.subject.replace('filename', path.basename(file)),
                text: filename, // plaintext body
                //html: '', // html body
                attachments: [{
                    'filename': filename,
                    'content': fs.createReadStream(source)
                }]
            };

            // send mail with defined transport object
            transporterAttachment.sendMail(mailOptions, function (error, info) {
                if (error) console.error(error);
                callback(error);
            });
        };

        var sendLink = function sendLink(file, callback) {
            if (!transporterLink) return console.error('Error: sendmail (link) is not ready, but sendLink() is called.');

            var mailOptions = {
                from: sendlink.from,
                to: sendlink.to,
                subject: sendlink.subject.replace('filename', path.basename(file)),
                text: 'http://' + getMyIp() + '/file' + encodeURI(file)
            };

            // send mail with defined transport object
            transporterLink.sendMail(mailOptions, function (error, info) {
                if (error) console.error(error);
                callback(error);
            });
        };


        var init = function init(){
            request({
                url: 'http://myexternalip.com/json'
            }, function (error, response, body) {
                if (error) return console.error(error);
                myIp = JSON.parse(body).ip;
                console.log('   ...my ext ip    : %s', myIp);
            });

        };

        var getMyIp = function getMyIp(){
            return myIp;
        };


        init();


        var ret = {};
        ret.isSendLinkEnabled = isSendLinkEnabled;
        ret.isSendAttachmentEnabled = isSendAttachmentEnabled;
        ret.getMyIp = getMyIp;
        ret.sendAttachment = sendAttachment;
        ret.sendLink = sendLink;
        return ret;
    };

})();