//require the dotenv file so that the keys are loaded into the application for use!
require('dotenv').config();

//require the NPM packages for twitter, spotify, request, and fs (for logging purposes)
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

//function for pulling tweets from api
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

// function to look up songs on spotify
function spotifySong() {
    if (search === undefined) {
        search = "The Sign Ace of Base";
    }
//console log the responses
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

// vars for responses including artists, name of track, preview, and album information
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

//function to look up movie titles through OMDB API
function movieThis() {
    if (search === undefined) {
        search = 'Mr. Nobody';
    }

    console.log(`\n------------\n`);
    console.log(command);
    console.log(`\n------------\n`);

    //OMBD api query URL with my OMBD API key.
    var queryUrl = `http://www.omdbapi.com/?t=${search}&y=&plot=short&apikey=e0f54de4`;

    Request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            jsonBody = JSON.parse(body);
//vars for the title, year, imdb rating, rotten tomatoes rating, languages in the film, plot, and actors for the specific movie that you are looking up.
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

//function to call the random txt file
function random() {
    fs.readFile('./random.txt', 'utf8', function (err, res) {
        if (err) throw err;
        var randCommand = res.split(",");
        var command = randCommand[0];
        search = randCommand[1];
        switchWrap(command);
    }); 
    
}

//commands that the user can enter to interface with the application
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

//function to write to the log the users inputs and the application's outputs.
function log() {
    var commandLog = `Command: ${command}, Search: ${search}\n`;
    fs.appendFile('log.txt', commandLog, function (err) {
        if (err) throw err;
        console.log(`"${commandLog}:" has been appended to log.txt`);
    });
}

switchWrap(command);