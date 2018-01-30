"use strict";

const angular = require("angular");

angular.module("mixtape")
    .constant("firebase", {
        key: "AIzaSyD4H78lA3VJNn_5GBpGHsr3rhxye3V_fSs",
        url: "https://fanmix-app.firebaseio.com"
    })
    .constant("goodreads", {
        url: "http://goodreads-proxy.herokuapp.com"
    })
    .constant("spotify", {
        key: "fdcfd222077448d9b1f7f9967fc6f178",
        secret: "80f8276cd4304917bb153cc2f42a352c"
    });