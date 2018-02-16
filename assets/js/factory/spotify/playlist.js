"use strict";

const angular = require("angular");

angular.module("mixtape").factory("SpotifyPlaylistFactory", function($q, $http, SPOTIFY, SpotifyAuthFactory) {

    // promises the first 50 playlists belonging to active user
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

    // fetches the next 50 playlists belonging to active user and searches their names by regex
    let searchUserPlaylists = (uid, term, limit, offset) => {
        return $q((resolve, reject) => {
            getPlaylistsByUid(uid, limit, offset)
                .then(results => {
                    if (results.total == 0) {
                        reject();
                    }
                    let searchTerm = RegExp(term,"i");
                    let searchResults = results.items.filter(item => {
                        return searchTerm.test(item.name);
                    });
                    resolve(searchResults);
                });
        });
    };

    // returns Spotify info on playlist with given ownerId and id
    let getPlaylistByIds = (uid, playlistId) => {
        return $q((resolve, reject) => {
            let token = SpotifyAuthFactory.getActiveToken();
            $http({
                method: "GET",
                url: `${SPOTIFY.url}/users/${uid}/playlists/${playlistId}`,
                headers: {
                    'Authorization' : `Bearer ${token}`
                }
            })
                .then(({data}) => {
                    resolve(data);
                });
        });
    };

    // formats raw Spotify playlist data into what we put into Firebase
    let parseApiInfo = data => {
        let obj = {
            title: data.name,
            subtitle: `${data.tracks.total} tracks`,
            id: data.id,
            image: data.images[0].url,
            small_image: data.images[0].url,
            uid: data.owner.id
        };
        return obj;
    };
    
    return { getPlaylistsByUid, searchUserPlaylists, getPlaylistByIds, parseApiInfo };
});