"use strict";

const angular = require("angular");

angular.module("mixtape").factory("MediaFactory", function($q, $http, FIREBASE) {
    let getRecentMedia = () => {
        return $q((resolve, reject) => {
            $http.get(`https://fanmix-app.firebaseio.com/media.json?orderBy="last_cached"&limitToFirst=20`)
                .then(data => {
                    console.log(data);
                });
        });
    };
    let getRecentMovies = limit => {
        return $q((resolve, reject) => {
            $http.get(`${FIREBASE.dbUrl}/media.json?orderBy="type"&equalTo="movie"`)
                .then(({data}) => {
                    resolve(data);
                });
        });
    };

    return {getRecentMovies};
});