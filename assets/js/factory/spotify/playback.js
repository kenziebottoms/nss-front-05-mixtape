"use strict";

const angular = require("angular");

angular.module("mixtape").factory("SpotifyPlaybackFactory", function ($q, $http, SpotifyAuthFactory, SPOTIFY) {

    // tell Spotify to play given track for active user
    let playTrack = id => {
        return $q((resolve, reject) => {
            let token = SpotifyAuthFactory.getActiveToken();
            $http({
                method: "PUT",
                url: `${SPOTIFY.url}/me/player/play`,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                data: {
                    "uris": [
                        `spotify:track:${id}`
                    ]
                }
            })
                .then(response => {
                    // 204 means "it worked, spotify is playing that"
                    if (response.status == 204) {
                        resolve(response);
                    } else {
                        reject(response);
                    }
                })
                .catch(err => reject(err));
        });
    };

    // tell Spotify to play given playlist for active user
    let playPlaylist = (uid, id) => {
        return $q((resolve, reject) => {
            let token = SpotifyAuthFactory.getActiveToken();
            $http({
                method: "PUT",
                url: `${SPOTIFY.url}/me/player/play`,
                headers: {
                    'Authorization' : `Bearer ${token}`
                },
                data: {
                    "context_uri": `spotify:user:${uid}:playlist:${id}`
                }
            }).then(response => {
                    // 204 means "it worked, spotify is playing that"
                    if (response.status == 204) {
                        resolve(response);
                    } else {
                        reject(response);
                    }
                })
                .catch(err => reject(err));
        });
    };

    // tells Spotify to turn off shuffle for active user
    let turnOffShuffle = () => {
        return $q((resolve, reject) => {
            let token = SpotifyAuthFactory.getActiveToken();
            $http({
                method: "PUT",
                url: `${SPOTIFY.url}/me/player/shuffle?state=false`,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                    // 204 means "it worked, spotify turned off shuffle"
                    if (response.status == 204) {
                        resolve(response);
                    } else {
                        reject(response);
                    }
                })
                .catch(err => reject(err));
        });
    };

    return { playTrack, playPlaylist, turnOffShuffle };
});