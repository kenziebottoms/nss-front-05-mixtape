"use strict";

const angular = require("angular");

angular.module("mixtape")
    .constant("FIREBASE", {
        key: "AIzaSyD4H78lA3VJNn_5GBpGHsr3rhxye3V_fSs",
        dbUrl: "https://fanmix-app.firebaseio.com"
    })
    .constant("GOODREADS", {
        url: "http://goodreads-proxy.herokuapp.com"
    })
    .constant("SPOTIFY", {
        key: "fdcfd222077448d9b1f7f9967fc6f178",
        secret: "80f8276cd4304917bb153cc2f42a352c",
        url: "https://api.spotify.com/v1"
    })
    .constant("TMDB", {
        image_prefix: "https://image.tmdb.org/t/p/w400_and_h600_bestv2",
        url: "https://api.themoviedb.org/3",
        key: "d7208980a35f7aef364e81fcb05147a4"
    });