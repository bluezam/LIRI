require("dotenv").config();
const keys = require("./keys.js");
const Spotify = require("node-spotify-api");
const spotify = new Spotify(keys.spotify);
const axios = require("axios");
const moment = require("moment");
const fs = require("fs");

let command = process.argv[2];
let search = process.argv.slice(3).join(" ");

const concertSearch = artist => {
  if (artist == undefined || null) {
    artist = "The Rolling Stones";
  };
  axios.get(
      "https://rest.bandsintown.com/artists/" +
        artist +
        "/events?app_id=codingbootcamp"
    )
    .then(function(response) {
      response.data.forEach(function(element) {
        let venue = element.venue;
        console.log("Band  Name: " + artist);
        console.log("Venue Name: " + venue.name);
        console.log("Venue City: " + venue.city + ", " + venue.country);
        console.log(
          "Event Date: " + moment(element.datetime).format("MM-DD-YYYY")
        );
        console.log("\n********************************");
        fs.appendFile(
          "log.txt",
          `| Band - ${artist}
          Venue - ${venue.name}, 
          Location - ${venue.city + ", " + venue.country}, 
          Date - ${moment(element.datetime).format("MM/DD/YYYY")}`,
          err => {
            if (err) throw err;
          }
        );
      });
      fs.appendFile(
        "log.txt",
        "]",
        err => {
          if (err) throw err;
        }
      );
    });
};

const spotSearch = song => {
  if (song === undefined || null) {
    song = "The Sign Ace of Base";
  }
  spotify.search(
    {
      type: "track",
      query: song,
      limit: 1
    },
    function(err, data) {
      if (err) {
        return console.log("Error occurred: " + err);
      }
      console.log("Song: " + data.tracks.items[0].artists[0].name);
      console.log("Band: " + data.tracks.items[0].name);
      console.log("Song Preview: " + data.tracks.items[0].preview_url);
      console.log("Album: " + data.tracks.items[0].album.name);
      fs.appendFile(
        "log.txt",
        `Song Name - ${data.tracks.items[0].artists[0].name}, 
        Artist(s) - ${data.tracks.items[0].name}, 
        Preview URL - ${data.tracks.items[0].preview_url}, 
        Album - ${data.tracks.items[0].album.name}]`,
        err => {
          if (err) throw err;
        }
      );
    }
  );
};

const movieSearch = title => {
  if (title == undefined || null) {
    title = "Mr.Nobody";
  }
  console.log("Title:---------------------------------" + title);
  axios
    .get("http://www.omdbapi.com/?t=" + title + "&y=&plot=short&apikey=trilogy")
    .then(function(response) {
      console.log("Movie Title: " + response.data.Title);
      console.log("Year Released: " + response.data.Year);
      console.log("IMDB Rating: " + response.data.Ratings[0].Value);
      console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
      console.log("Country(s): " + response.data.Country);
      console.log("Plot: " + response.data.Plot);
      console.log("Actors: " + response.data.Actors);
    });
};

const doLog = () => {
  fs.readFile("random.txt", "utf8", function(error, data) {
    if (error) {
      return console.log(error);
    }
    spotSearch(data);
  });
};

switch (command) {
  case "spotify-this-song":
    console.log("Search: " + search);
    spotSearch(search);
    break;
  case "concert-this":
    console.log("Search: " + search);
    concertSearch(search);
    break;
  case "movie-this":
    console.log("Search: " + search);
    movieSearch(search);
    break;
  case "do-what-it-says":
    console.log("Search: " + search);
    doLog();
    break;
};

fs.appendFile(
  "log.txt",
  "[" + process.argv[2] + " " + process.argv[3] + ": ",
  err => {
    if (err) throw err;
  }
);
