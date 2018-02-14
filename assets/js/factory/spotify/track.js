"use strict";

const angular = require("angular");

angular.module("mixtape").factory("SpotifyTrackFactory", function($q, $http, SpotifyAuthFactory, SPOTIFY) {

    // returns Spotify search query on title
    let searchTracksByTitle = (title, limit) => {
        return $q((resolve, reject) => {
            let token = SpotifyAuthFactory.getActiveToken();
            $http({
                method: "GET",
                url: `${SPOTIFY.url}/search?q=title:${encodeURI(title)}&type=track&limit=${limit ? limit : "20"}`,
                headers: {
                    'Authorization' : `Bearer ${token}`
                }
            })
                .then(({data}) => resolve(data.tracks.items))
                .catch(err => reject(err));
        });
    };

    // returns Spotify info on given track;
    let getTrackById = id => {
        return $q((resolve, reject) => {
            let token = SpotifyAuthFactory.getActiveToken();
            $http({
                method: "GET",
                url: `${SPOTIFY.url}/tracks/${id}`,
                headers: {
                    'Authorization' : `Bearer ${token}`
                }
            })
                .then(({data}) => resolve(data))
                .catch(err => reject(err));
        });
    };

    // formats Spotify track data into what we put into Firebase
    let parseApiInfo = data => {
        let obj = {
            title: data.name,
            subtitle: data.artists[0].name,
            id: data.id,
            image: data.album.images[0].url,
            small_image: data.album.images[1].url
        };
        return obj;
    };

    return { searchTracksByTitle, getTrackById, parseApiInfo };
});