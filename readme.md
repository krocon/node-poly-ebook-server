# poly-ebook-server

WebApp (Client/Server) for own ebook content: comics, pdfs and epubs (cbr,cbz,cb7,epub,pdf,...).

This tool serves ebooks of given directories (and their sub directories).
Depending on the bookExtensions option one can show comics, ebooks or something else.
If for a book (abc.cbr) a thumb file exists (abc.jpg), the thumb will be displayed instead of it's name.

In the browser: all books are displayed in a thumb view. This view is optimized for a large number of books (Polymer iron-list).
With help of a simple text input one can filter the list of the books.
One can download a book, can send it (as link or attachment), or delete it (move to a predefined trash folder).
An epub can be read online (in the browser).

Technology: Server based on node.js, client based on Google Polymer.

![screen]((https://cloud.githubusercontent.com/assets/11378781/16347460/26cfa874-3a4d-11e6-9739-14b3b464b3f0.png))

## Preamble

I use this tool to get an overview to my ebooks. With my iPad and Android tablet I can grabble my hole collection. An ebook is downloaded to the tablet with a simple click.
In a later version I will integrate an online view, an internet search (to fetch book detail information), a toggle view (groupimg books) and so on. Feel free to give me feedback!

Second reason for coding this is learning Google Polymer [#UseThePlatform](https://www.polymer-project.org).

## Getting started


### ebook-cover-generator
This tool doesn't generate thumbs of your ebooks.
If you want to do this, you can use [ebook-cover-generator](https://www.npmjs.com/package/ebook-cover-generator).
On Mac OS X I recommend this tool: [cover-generator-by-quicklook](https://www.npmjs.com/package/cover-generator-by-quicklook).

## Installation

Create an empty folder. Open your shell (console) and navigate to this folder. Enter:
> npm i poly-ebook-server

A directory named *node_modules* is created with some sub folders. Navigate to *node_modules/poly-ebook-server*:
> cd node_modules/poly-ebook-server

Edit node start file (dev.js or prod.js) and adapt the configuration:
> open dev.js

Start app with:
> node dev.js

In case of an error have a look at *clientRoot: __dirname + '/../client(/build/bundled)'* and the *baseDir:...*.

## Usage (script)
```js
var server = require('poly-ebook-server');
server.start(options<Object>);
```

### Examples

#### Example with 3 start directories
This is an example for three different ebook types. In the json structure we have three sections (see below).
Each section will be rendered as a tab in the browser. Each section has a start directory.
All files in this directory and it's sub directories which fits to the file extension(s), will be displayed below the corresponding tab. If for a file a jpg exist, this will be display in the selected dimension (thumbsDims and dimIndex). The user has the possibility to change the thumb size at runtime.

In case of an error have a look at clientRoot: __dirname + '/../client'.

```js
(function () {
  "use strict";

  var server = require('./index-js');
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
        initialFilter: 'krimi -kill',
        epubReader: true, // activates online epub reader
        trashDir: '/Users/marc/ebooks/trash', // if trashDir is defined, a delete button will be displayed.
        copyDir : '/Volumes/KOBOeReader', // tested with Kobo Aura H2O. Reader must be connected via USB.
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

```



