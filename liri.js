require('dotenv').config();
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var Request = require('request');
var fs = require('fs');

var keys = require('./keys');
var spotifyKey = new Spotify(keys.spotify);
var twitterKey = new Twitter(keys.twitter);

var args = process.argv.slice(2);
var command = args[0];
var search = args[1];


function myTweets() {
    var params = {
        count: '20'
    }
    twitterKey.get('statuses/user_timeline', params, function (error, tweets, response) {
        var tweetList = [];
        console.log('\n');
        console.log('Getting user tweets');
        console.log('\n----------\n');
        tweets.forEach(function (e) {
            console.log(e.created_at);
            console.log(e.text);
            console.log('\n----------\n');
        });
    });
}

function spotifySong() {
    if (search === undefined) {
        search = "The Sign Ace of Base";
    }

    console.log(`\n------------\n`);
    console.log(command);
    console.log(`\n------------\n`);

    spotifyKey
        .search({
            type: 'track',
            query: search,
            limit: 1
        })
        .then(function (response) {

            //console.log(response.tracks.items[0]);
            //console.log(response.tracks.items[0].artists[0].name);
            var artist = response.tracks.items[0].artists[0].name;
            var name = response.tracks.items[0].name;
            var preview = response.tracks.items[0].preview_url;
            var album = response.tracks.items[0].album.name;

            var query = [artist, name, preview, album];
            query.forEach(function (e) {
                if (e === null) {
                    console.log('N/A');
                }
                else {
                    console.log(e);
                }
                
            });
        })
        .catch(function (err) {
            console.log(err);
        });
}

function movieThis() {
    if (search === undefined) {
        search = 'Mr. Nobody';
    }

    console.log(`\n------------\n`);
    console.log(command);
    console.log(`\n------------\n`);

    var queryUrl = `http://www.omdbapi.com/?t=${search}&y=&plot=short&apikey=trilogy`;

    Request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            //console.log(JSON.parse(body));
            jsonBody = JSON.parse(body);

            var title = 'Title: ' + jsonBody.Title;
            var year = 'Year: ' + jsonBody.Year;
            var rating = 'IMDB Rating: ' + jsonBody.Ratings[0].Value;
            var rotten = 'RT Rating: ' + jsonBody.Ratings[1].Value;
            var language = 'Languages: ' + jsonBody.Language;
            var plot = 'Plot: ' + jsonBody.Plot;
            var actors = 'Actors: ' + jsonBody.Actors;

            var query = [title, year, rating, rotten, language, plot, actors];
            query.forEach(function (e) {
                console.log(e);
            });
        } else {
            console.log(`OMDB Error`);
        }
    });
}

function random() {
    fs.readFile('./random.txt', 'utf8', function (err, res) {
        if (err) throw err;
        var randCommand = res.split(",");
        var command = randCommand[0];
        search = randCommand[1];
        switchWrap(command);
    }); 
    
}

function switchWrap(command) {
    log();
    switch (command) {
        case 'my-tweets':
            myTweets();
            break;
        case 'spotify-this-song':
            spotifySong();
            break;
        case 'movie-this':
            movieThis();
            break;
        case 'do-what-it-says':
            random();
            break;
    }
}

function log() {
    var commandLog = `Command: ${command}, Search: ${search}\n`;
    fs.appendFile('log.txt', commandLog, function (err) {
        if (err) throw err;
        console.log(`"${commandLog}:" has been appended to log.txt`);
    });
}

switchWrap(command);