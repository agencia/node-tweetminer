var twitterAPI = require('node-twitter-api');
var format = require('util').format;
var request = require("request");
var async = require('async');
var urlExpander = require('expand-url');

var twitter = new twitterAPI({
    consumerKey: 'Alnn9DVS5HwuGlNrKwUAtw',
    consumerSecret: 'xcZsBZDwtubjDDIsfXYYB8Y1p2nJY9gk920a4C8wDws',
    callback: 'http://agenciaunia.com/something'
});

var accessTokenKey = "182570549-oQ0DDxVQ0oNhKK4cvFYVSJ4FWcOXQf0oAIznt3CB";
var accessTokenSecret="7giyVk47AAWbz5vue8ep1iC4uWEBeAqonsf8zXGwDU55x";
var monk = require('monk');
var db = monk('localhost:27017/todos_tweets');
var pool = db.get("url");
var expanded = db.get("expanded");

var counter=0;
var q = async.queue(function (shortUrl, callback) {
    urlExpander.expand(shortUrl, function(err, longUrl){
        counter++;
        //console.log(counter+": "+longUrl);
        var fsq_params	= longUrl.split("/");
        var fsq_keys	= fsq_params[fsq_params.length-1].split('?');
        var fsq_checkinid = fsq_keys[0];
        var fsq_signature = null;
        if(fsq_keys.length > 1){
        	var lastvars = fsq_keys[1].split('&');
        	var almost_signature = lastvars[0].split('=');
        	if(almost_signature[1].length > 3){
            	fsq_signature = almost_signature[1];
            }
    	}
        expanded.insert({"longurl" : longUrl, "4sqr_checkinid" : fsq_checkinid, "fsq_signature": fsq_signature});
        callback();
    });
}, 50);

q.drain = function() {
    console.log(counter);
    console.log('all urls have been processed');
}


var search_parameters = {"q":"4sq com", "count":"100"};
var timer = setInterval(function(){
	twitter.search(search_parameters,accessTokenKey,accessTokenSecret, function(error, data, response){
		if (error){
			console.log(error);
				clearInterval(timer);
		} else {
			//console.log(data);
			var i = 0;
			for (var index in data.statuses){
				var urls = data.statuses[index]["entities"]["urls"];
				//console.log(urls[urls.length - 1]["expanded_url"]);
				//pool.insert({"url":urls[urls.length - 1]["expanded_url"]});
				q.push(urls[urls.length - 1]["expanded_url"], function (errr) {console.log(errr);});
				search_parameters["max_id"] = (search_parameters["max_id"] > data.statuses[index]["id"] || !search_parameters["max_id"]) ? data.statuses[index]["id"] : search_parameters["max_id"];
				i++;
			}
			//search_parameters["max_id"] = data.search_metadata.max_id;
			//console.log("max_id: " + search_parameters["max_id"]);
			if(i < 1){
				clearInterval(timer);
				console.log("Finish!!!!");
			}
		}
	});
}
, 4000);

	db.close();