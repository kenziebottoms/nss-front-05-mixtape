"use strict";

const angular = require("angular");

angular.module("mixtape").factory("SpotifySearchFactory", function($q, $http, SpotifyUserFactory) {
    let searchTracksByTitle = (title, limit) => {
        let token = SpotifyUserFactory.getActiveToken();
        return $q((resolve, reject) => {
            $http({
                method: "GET",
                url: `https://api.spotify.com/v1/search?q=title:${encodeURI(title)}&type=track&limit=${limit ? limit : "20"}`,
                headers: {
                    'Authorization' : `Bearer ${token}`
                }
            })
                .then(response => resolve(response))
                .catch(err => reject(err));
        });
    };

    return { searchTracksByTitle };
});