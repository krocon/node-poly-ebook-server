(function () {
    "use strict";

    var server = require('./index.js');
    var options = {
        title: "Ebooks",
        clientRoot: __dirname + '/client/build/bundled',
        port: 9000,
        
        sectionIndex: 0,
        sections: [
            {
                label: "Epub",
                bookExtensions: ['.epub'],
                baseDir: "/Users/marc/ebooks/Romane/alphabet",
                thumbsDims: [
                    {width: 105, height: 150},
                    {width: 210, height: 300},
                    {width: 315, height: 450},
                    {width: 420, height: 600}
                ],
                dimIndex: 1,
                initialFilter: '-categories krimi'
            },
            {
                label: "Comic",
                baseDir: '/Volumes/data/ebooks/comics/_deu',
                bookExtensions: [".cbz", ".cbr"],
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
                baseDir: '/Volumes/data/ebooks/Magazine',
                bookExtensions: ['.pdf'],
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
                baseDir: "/Volumes/video/Filme",
                thumbsDims: [
                    {width: 100, height: 150},
                    {width: 200, height: 300},
                    {width: 300, height: 450}
                ],
                dimIndex: 0,
                initialFilter: ''
            },
            {
                label: "Serien",
                bookExtensions: ['.mkv','.avi'],
                baseDir: "/Volumes/video/Serien",
                thumbsDims: [
                    {width: 100, height: 150},
                    {width: 200, height: 300},
                    {width: 300, height: 450}
                ],
                dimIndex: 0,
                initialFilter: ''
            }
        ]

    };
    server.start(options);

})();