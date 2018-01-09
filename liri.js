require("dotenv").config();

// Sign-in Data from keys.js
var signInKeys = require('./keys');

var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require('fs');

// Take in User Command
var command = process.argv[2];
var userInput = process.argv[3];

// Get API Keys
var spotify = new Spotify(signInKeys.spotify);
var client = new Twitter(signInKeys.twitter);

// ------- TWITTER -------
// Twitter Parameters
var params = {
    screen_name: 'ajbrolly',
    include_rts: true,
    count: 20
};
var tweetNumber = 0;

// COMMAND: my-tweets
if (command === 'my-tweets') {
    runTwitter();
}

// Function to run Twitter search
function runTwitter() {
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            // Log tweet data
            for (var i = 0; i < tweets.length; i++) {
                tweetNumber++
                console.log('------------------------------')
                console.log(tweetNumber + '. ' + tweets[i].created_at + '\n' + tweets[i].text);
                console.log('------------------------------')
            }
        }
    });
}


// ------- SPOTIFY -------
// Spotify Parameters
var resultNumber = 0;
var artistArr = []

// COMMAND: spotify-this-song
if (command === 'spotify-this-song') {
    runSpotify();
};

// Function to run Spotify search
function runSpotify() {
    spotify.search({
        type: 'track',
        query: userInput,
        limit: 5
    })
        .then(function (response) {
            var result = response.tracks.items;
            for (var j = 0; j < result.length; j++) {
                resultNumber++
                console.log('------------------------------\n' + resultNumber + '. ')
                console.log('Artist: ' + result[j].artists.name);
                console.log('Song Name: ' + result[j].name);
                console.log('Preview Song: ' + result[j].external_urls.spotify);
                console.log('Album: ' + result[j].album.name);
                console.log('------------------------------')
            }
        })
        .catch(function (err) {
            console.log(err);
        });
}


// ------- OMDB -------
// OMDB Parameters
var queryURL = "https://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=trilogy";

// COMMAND: movie-this
if (command === 'movie-this') {
    runOMDB();
}

// Function to run OMDB search
function runOMDB() {
    request(queryURL, function (error, response, body) {
        var movie = JSON.parse(body);
        if (!error) {
            console.log('------------------------------');
            console.log('Title: ' + movie.Title + '\nYear of Release: ' + movie.Released + '\nIMDB Rating: ' + movie.imdbRating + '\nRotten Tomatoes Rating: ' + movie.Ratings[1].Value + '\nCountry Where Produced: ' + movie.Country + '\nLanguage of the Movie: ' + movie.Language + '\nPlot: ' + movie.Plot + '\nActors: ' + movie.Actors);
            console.log('------------------------------');
        } else if (userInput === '') {
            userInput = 'Mr Nobody';
        } else {
            // Print the error if one occurred
            console.log('error:', error);
            console.log('body:', body);
        }
    });
}


// ------- FS -------
// COMMAND: do-what-it-says
if (command === 'do-what-it-says') {
    fs.readFile('random.txt', 'utf8', function (error, data) {
        if (error) {
            console.log(error);
        }
        if (command === 'do-what-it-says') {
            var dataArr = data.split(',');
            command = dataArr[0];
            userInput = dataArr[1];
            console.log(userInput);
            if (command === 'movie-this') {
                runOMDB();
            }
            if (command === 'spotify-this-song') {
                runSpotify();
            }
            if (command === 'my-tweets') {
                runTwitter();
            }
        }
    })
};