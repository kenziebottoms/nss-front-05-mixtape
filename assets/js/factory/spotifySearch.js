"use strict";

const angular = require("angular");

angular.module("mixtape").factory("SpotifySearchFactory", function($q, $http, SpotifyAuthFactory) {
    let searchTracksByTitle = (title, limit) => {
        let token = SpotifyAuthFactory.getActiveToken();
        return $q((resolve, reject) => {
            $http({
                method: "GET",
                url: `https://api.spotify.com/v1/search?q=title:${encodeURI(title)}&type=track&limit=${limit ? limit : "20"}`,
                headers: {
                    'Authorization' : `Bearer ${token}`
                }
            })
                .then(({data}) => resolve(data.tracks.items))
                .catch(err => reject(err));
        });
    };

    return { searchTracksByTitle };
});