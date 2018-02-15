"use strict";

const angular = require("angular");

angular.module("mixtape").factory("MusixmatchFactory", function($q, $http, MUSIXMATCH) {
    // search tracks by title & artist
    let searchTracks = (title, artist) => {
        return $q((resolve, reject) => {
            $http.get(`${MUSIXMATCH.url}/track.search?q_artist=${artist}&q_track=${title}&f_has_lyrics=true&apikey=${MUSIXMATCH.key}`)
                .then(({data}) => {
                    resolve(data);
                })
                .catch(err => reject(err));
        });
    };
    
    return {searchTracks};
});