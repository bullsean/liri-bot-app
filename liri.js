require("dotenv").config();
var fs = require("fs");
var axios = require("axios");
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var moment = require("moment");

var spotify = new Spotify(keys.spotify);

var command = process.argv[2];
var keyword = process.argv.slice(3).join(' ');


switch (command) {
    case 'concert-this':
        concert();
        break;
    case 'spotify-this-song':
        music();
        break;
    case 'movie-this':
        movie();
        break;
    case 'do-what-it-says':
        random();
        break;
    default:
        console.log('Please submit a valid request')
}

function concert() {
    var BandsQueryURL = 'https://rest.bandsintown.com/artists/' + keyword + '/events?app_id=codingbootcamp';

    axios.get(BandsQueryURL).then(
        function (response) {
            for (var i = 0; i < response.data.length; i++) {
                console.log(response.data[i].venue.name);
                console.log(response.data[i].venue.city);
                console.log(moment(response.data[i].datetime).format('MM/DD/YYYY LT'));
                console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
            }
        },

        function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an object that comes back with details pertaining to the error that occurred.
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log("Error", error.message);
            }
            console.log(error.config);
        }

    )
};

function movie() {

    if (command === 'movie-this' && process.argv[3] === undefined) {
        keyword = 'Mr. Nobody';
    };

    var OMDBqueryUrl = "http://www.omdbapi.com/?t=" + keyword + "&y=&plot=short&apikey=trilogy";

    axios.get(OMDBqueryUrl).then(
        function (response) {
            console.log('Title: ' + response.data.Title);
            console.log('Year: ' + response.data.Year);
            console.log('IMBD Rating: ' + response.data.imdbRating);
            console.log('Rotten Tomatoes Rating: ' + response.data.Ratings[1].Value);
            console.log('Country: ' + response.data.Country);
            console.log('Language: ' + response.data.Language);
            console.log('Plot: ' + response.data.Plot);
            console.log('Actors: ' + response.data.Actors);
        },

        function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an object that comes back with details pertaining to the error that occurred.
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log("Error", error.message);
            }
            console.log(error.config);
        }


    );



}

function music() {
    if (command === 'spotify-this-song' && process.argv[3] === undefined) {
        keyword = 'The Sign';
    };

    spotify.search({ type: 'track', query: keyword, limit: 1 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log('Artist(s): ' + data.tracks.items[0].artists[0].name)
        console.log('Song Name: ' + data.tracks.items[0].name)
        console.log('Preview Link: ' + data.tracks.items[0].preview_url)
        console.log('Album: ' + data.tracks.items[0].album.name)
        // console.log(data.tracks.items)
        // console.log(data);
    });
}

function random() {

    fs.readFile("./random.txt", "utf8", function (error, data) {

        if (error) {
            return console.log(error);
        }

        // console.log(data);
        var dataArr = data.split(",");
        // console.log(dataArr);
        if (dataArr[0] === 'spotify-this-song') {
            keyword = dataArr[1];
            music();
        } else if (dataArr[0] === 'concert-this') {
            keyword = dataArr[1];
            concert();
        } else if (dataArr[0] === 'movie-this') {
            keyword = dataArr[1];
            movie();
        } else {
            console.log('So sorry, I\'ll need a real command to do that')
        }

    });
}
