var request = require('request');
var cheerio = require('cheerio');
var S = require('string');
function recUrl(arr, main) {
    if (arr.length > 0) {
        var key = arr.splice(0, 1);
        if (!main[key])main[key] = {};
        return recUrl(arr, main[key]);
    }
    return null;
}
module.exports = {
    getLinks: function (urli, callback) {
        var url = urli || 'http://www.google.com';
        request(url, function (err, respa, body) {
            if (err) {
                console.log(err);
                throw err;
            }
            var resp = [];
            var $ = cheerio.load(body);
            $('a').each(function (i, ahref) {
                if (ahref.attribs && ahref.attribs.href) {
                    var str = "";
                    var text = ahref.children[0] && ahref.children[0].data ? ahref.children[0].data : "NA";
                    if (S(ahref.attribs.href).startsWith("/")) {//for relative urls
                        str = url + ahref.attribs.href;
                    } else {
                        str = ahref.attribs.href;
                    }
                    //console.log("About to push link " + str + " against " + text);
                    resp.push({link: str, text: text});
                }
            });
            if (callback) {
                //console.log("In callback");
                callback(resp);
            }
        });
    }
};