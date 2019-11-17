var Twit = require('twit');
const express = require('express');
const app = express();
const server = require('http').Server(app);
var io = require('socket.io')(server);
var fs = require('fs');

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

io.on('connection', function(socket) {

    T.get('search/tweets', { q: 'TheTweetOfGod', count: 100 }, function(err, data, response) {
      var tweetArray=[];
        for (let index = 0; index < data.statuses.length; index++) {
            const tweet = data.statuses[index];
            let customTweet = {
                created_at: tweet.created_at,
                id: tweet.id,
                text: tweet.text
            }
            tweetArray.push(customTweet);
        }     
        io.emit('allTweet',tweetArray)
    })

    var stream = T.stream('statuses/filter', { track: '#coding', language: 'en' })

    stream.on('tweet', function (tweet) {
        io.emit('tweet',{ 'tweet': tweet });
    })
});

var T = new Twit({
  consumer_key:         'oDvyHQl4wWO84Jcm6SelK58no',
  consumer_secret:      'vKRMxB5kGhd85Esh0hNkvFLnNPFJRfCCzW5R35v58Q21UjliNK',
  access_token:         '4049924489-A41wgzQnc4Zt2UBnGTMO0E2A2YkgDwwsYbl5fkV',
  access_token_secret:  'L0TiAWUMf7VXDmecdFRZohnFd2E6z40Wd6Ec1hGD1dEzG',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
});

// listen for requests :)
const listener = server.listen(3000, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});