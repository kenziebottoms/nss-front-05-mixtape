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
    });