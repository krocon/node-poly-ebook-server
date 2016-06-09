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
                baseDir: "/Users/marc/ebooks/Romane/alphabet",
                thumbsDims: [
                    {width: 105, height: 150},
                    {width: 210, height: 300},
                    {width: 315, height: 450},
                    {width: 420, height: 600}
                ],
                dimIndex: 1,
                initialFilter: '-tau krimi',
                trashDir: '/Users/marc/ebooks/trash', // if trashDir is defined, a delete button will be displayed.
                copyDir : '/Volumes/KOBOeReader' // tested with Kobo Aura H2O. Reader must be connected via USB.
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
                thumbsDims: [
                    {width: 105, height: 150},
                    {width: 210, height: 300},
                    {width: 315, height: 450},
                    {width: 420, height: 600}
                ],
                dimIndex: 1,
                initialFilter: ''
            }
        ]

    };
    server.start(options);

})();