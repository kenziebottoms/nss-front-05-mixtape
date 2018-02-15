"use strict";

const angular = require("angular");

angular.module("mixtape")
    .constant("FIREBASE", {
        key: "AIzaSyD4H78lA3VJNn_5GBpGHsr3rhxye3V_fSs",
        url: "https://fanmix-app.firebaseio.com"
    })
    .constant("GOODREADS", {
        url: "http://mixify-proxy.herokuapp.com/gr",
        key: "tFNCKRwqZ35i7OyfOa7QA"
    })
    .constant("SPOTIFY", {
        key: "8dedd7214f254759b902f644594cd667",
        secret: "51fac66079624211b1a93ff0363a6359",
        url: "https://api.spotify.com/v1"
    })
    .constant("TMDB", {
        image_prefix: "https://image.tmdb.org/t/p/w400_and_h600_bestv2",
        small_image_prefix: "http://image.tmdb.org/t/p/w185",
        url: "https://api.themoviedb.org/3",
        key: "d7208980a35f7aef364e81fcb05147a4"
    })
    .constant("MUSIXMATCH", {
        url: "http://mixify-proxy.herokuapp.com/mm",
        key: "5c7575fabfc4c38a7527bdb8298a1915"
    });