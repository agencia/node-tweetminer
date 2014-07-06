var twitterAPI = require('node-twitter-api');
var format = require('util').format;
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


var search_parameters = {"q":"4sq com", "count":"100"};
var timer = setInterval(function(){
	twitter.search(search_parameters,accessTokenKey,accessTokenSecret, function(error, data, response){
		if (error){
			console.log(error);
		} else {
			//console.log(data);
			var i = 0;
			for (var index in data.statuses){
				var urls = data.statuses[index]["entities"]["urls"];
				//console.log(urls[urls.length - 1]["expanded_url"]);
				pool.insert({"url":urls[urls.length - 1]["expanded_url"]});
				
				search_parameters["max_id"] = (search_parameters["max_id"] > data.statuses[index]["id"] || !search_parameters["max_id"]) ? data.statuses[index]["id"] : search_parameters["max_id"];
				i++;
			}
			//search_parameters["max_id"] = data.search_metadata.max_id;
			//console.log("max_id: " + search_parameters["max_id"]);
			if(i < 100){
				clearInterval(timer);
				console.log("Finish!!!!");
			}
		}
	});
}
, 10000);

	db.close();