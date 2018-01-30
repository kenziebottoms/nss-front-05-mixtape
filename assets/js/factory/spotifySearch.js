"use strict";

const angular = require("angular");

angular.module("mixtape").factory("SpotifySearchFactory", function($q, $http) {
    let searchTracksByTitle = (title, limit) => {
        let key = require("../keys").spotify_public;
        return $q((resolve, reject) => {
            $http.get(`https://api.spotify.com/v1/search?q=title:${encodeURI(title)}&type=track&limit=${limit ? limit : "20"}`,
                {
                    'Authorization' : `Bearer ${key}`
                })
                .then(response => resolve(response))
                .catch(err => reject(err));
        });
    };

    return { searchTracksByTitle };
});