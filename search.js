var twitterAPI = require('node-twitter-api');
var twitter = new twitterAPI({
    consumerKey: 'Alnn9DVS5HwuGlNrKwUAtw',
    consumerSecret: 'xcZsBZDwtubjDDIsfXYYB8Y1p2nJY9gk920a4C8wDws',
    callback: 'http://agenciaunia.com/something'
});

var accessTokenKey = "182570549-oQ0DDxVQ0oNhKK4cvFYVSJ4FWcOXQf0oAIznt3CB";
var accessTokenSecret="7giyVk47AAWbz5vue8ep1iC4uWEBeAqonsf8zXGwDU55x";

twitter.search({"ulises"},accessTokenKey,accessTokenSecret, function(error, data, response){
	if (error){
		console.log(error);
	} else {
		console.log(data);
	}
});