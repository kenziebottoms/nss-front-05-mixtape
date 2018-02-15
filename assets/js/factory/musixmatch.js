"use strict";

const angular = require("angular");

angular.module("mixtape").factory("MusixmatchFactory", function($q, $http, MUSIXMATCH) {

    // search Musixmatch tracks by title & artist and return id of first result
    let getTrackId = (title, artist) => {
        return $q((resolve, reject) => {
            $http.get(`${MUSIXMATCH.url}/track.search?q_artist=${artist}&q_track=${title}&f_has_lyrics=true&apikey=${MUSIXMATCH.key}`)
                .then(({data : {message : {body: {track_list}}}}) => {
                    resolve(track_list[0].track.track_id);
                })
                .catch(err => reject(err));
        });
    };

    // retrieves lyrics with Musixmatch id
    let getLyricsById = id => {
        return $q((resolve, reject) => {
            $http.get(`${MUSIXMATCH.url}/track.lyrics.get?track_id=${id}&apikey=${MUSIXMATCH.key}`)
                .then(({data: {message: {body: {lyrics}}}}) => {
                    resolve(lyrics);
                })
                .catch(err => reject(err));
        });
    };

    // searches track by title and artist and returns lyrics for first result
    let getLyrics = (title, artist) => {
        return $q((resolve, reject) => {
            getTrackId(title, artist)
                .then(id => {
                    return getLyricsById(id);
                })
                .then(lyrics => {
                    resolve(lyrics);
                });
        });
    };
    
    return {getLyrics};
});