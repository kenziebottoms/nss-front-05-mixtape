"use strict";

const angular = require("angular");

angular.module("mixtape").factory("SpotifyPlaylistFactory", function($q, $http, SPOTIFY, SpotifyAuthFactory) {
    let getPlaylistsByUid = (uid, limit, offset) => {
        return $q((resolve, reject) => {
            let token = SpotifyAuthFactory.getActiveToken();
            $http({
                method: "GET",
                url: `${SPOTIFY.url}/users/${uid}/playlists?limit=${limit}&offset=${offset}`,
                headers: {
                    'Authorization' : `Bearer ${token}`
                }
            })
                .then(({data}) => {
                    resolve(data);
                });
        });
    };
    let searchUserPlaylists = (uid, term, limit, offset) => {
        return $q((resolve, reject) => {
            getPlaylistsByUid(uid, limit, offset)
                .then(results => {
                    let searchTerm = RegExp(term,"i");
                    let searchResults = results.items.filter(item => {
                        return searchTerm.test(item.name);
                    });
                    resolve(searchResults);
                });
        });
    };
    
    return { getPlaylistsByUid, searchUserPlaylists };
});