var express = require('express')
    , http = require('http')
    , scrape = require("./lib/webscrape");

var app = express();

var port = process.env.PORT || 3000;
var ip = process.env.IP || "127.0.0.1";

app.configure(function () {
    app.set('port', port);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.set('view options', {layout: false});
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use('/static', express.static(__dirname + '/public', {maxAge: 86400000}));
});

app.configure('development', function () {
    app.use(express.errorHandler());
});

//Routes
app.get('/', function (req, res) {
    if (req.query.u) {
        var url = req.query.u;
        scrape.getLinks(url, function (links) {
            //res.setHeader("Content-Type", "text/javascript");
            //for(var link in links){
            //    res.write();
            // }
            res.render("list", {links: links, url: url});
        });
    } else {
        res.sendfile(__dirname + '/public/index.html');
    }
});

app.listen(port, ip);