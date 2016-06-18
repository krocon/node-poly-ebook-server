(function () {
    "use strict";

    var server = require('./index.js');
    var options = {
        title: "Ebooks",
        clientRoot: __dirname + '/client',
        port: 8081,
        
        sectionIndex: 0,
        sections: [
            {
                label: "Epub",
                bookExtensions: ['.epub'],
                // baseDir: "/Users/marc/ebooks/Romane/alphabet",
                baseDir: "/Users/marc/ebooks",
                thumbsDims: [
                    {width: 105, height: 150},
                    {width: 210, height: 300},
                    {width: 315, height: 450},
                    {width: 420, height: 600}
                ],
                dimIndex: 1,
                initialFilter: '-tau krimi',
                epubReader: true,
                trashDir: '/Users/marc/ebooks/trash', // if trashDir is defined, a delete button will be displayed.
                // copyDir : '/Volumes/KOBOeReader', // tested with Kobo Aura H2O. Reader must be connected via USB.
                copyDir : '/Users/marc/ebooks/copy', // tested with Kobo Aura H2O. Reader must be connected via USB.
                sendOptions: {
                    sendattachment: {
                        title: 'Send book',
                        transport : 'smtps://USER@gmail.com:PASSW@smtp.gmail.com', // see https://www.npmjs.com/package/nodemailer
                        from: 'ABC@gmail.com',    // sender address
                        to: 'ABC@gmail.com',      // list of receivers
                        subject: 'poly ebook server' // Subject line
                    },
                    sendlink: {
                        title: '@getpocket',
                        transport : 'smtps://USER@gmail.com:PASSW@smtp.gmail.com',
                        from: 'ABC@gmail.com',   // sender address
                        to: 'add@getpocket.com', // list of receivers
                        subject: 'filename'      // Subject line
                    }
                } // null -> send buttons are hidden
            },
            {
                label: "Comic",
                bookExtensions: [".cbz", ".cbr"],
                baseDir: "/Volumes/2TB/jdownload/_comics",
                thumbsDims: [
                    {width: 83, height: 150},
                    {width: 196, height: 300},
                    {width: 329, height: 450},
                    {width: 392, height: 600}
                ],
                dimIndex: 1,
                initialFilter: "bill"
            },
            {
                label: "Magazine",
                bookExtensions: ['.pdf'],
                baseDir: "/Volumes/2TB/jdownload/_magazine",
                trashDir: '/Volumes/2TB/jdownload',
                thumbsDims: [
                    {width: 105, height: 150},
                    {width: 210, height: 300},
                    {width: 315, height: 450},
                    {width: 420, height: 600}
                ],
                dimIndex: 1,
                initialFilter: ''
            },
            {
                label: "Movies",
                bookExtensions: ['.mkv','.avi'],
                baseDir: "/Volumes/2TB/jdownload/_movies",
                thumbsDims: [
                    {width: 100, height: 150},
                    {width: 200, height: 300},
                    {width: 300, height: 450}
                ],
                dimIndex: 1,
                initialFilter: ''
            }
            // {
            //     label: "Mov2",
            //     bookExtensions: ['.mkv','.avi'],
            //     baseDir: "/Volumes/video/Filme/201x/2015",
            //     thumbsDims: [
            //         {width: 100, height: 150},
            //         {width: 200, height: 300},
            //         {width: 300, height: 450}
            //     ],
            //     dimIndex: 0,
            //     initialFilter: ''
            // }
        ]

    };
    server.start(options);

})();