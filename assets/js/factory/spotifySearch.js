"use strict";

const angular = require("angular");

angular.module("mixtape").factory("SpotifySearchFactory", function($q, $http, SpotifyAuthFactory, SPOTIFY) {

    let searchTracksByTitle = (title, limit) => {
        let token = SpotifyAuthFactory.getActiveToken();
        return $q((resolve, reject) => {
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

    let getTrackById = id => {
        let token = SpotifyAuthFactory.getActiveToken();
        return $q((resolve, reject) => {
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

    let parseApiInfo = (type, data) => {
        let obj = {};
        if (type == "track") {
            obj = {
                title: data.name,
                subtitle: data.artists[0].name,
                id: data.id,
                image: data.album.images[0].url,
                small_image: data.album.images[2].url
            };
        }
        return obj;
    };

    return { searchTracksByTitle, getTrackById, parseApiInfo };
});