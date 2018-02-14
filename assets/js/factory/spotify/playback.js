"use strict";

const angular = require("angular");

angular.module("mixtape").factory("SpotifyPlaybackFactory", function ($q, $http, SpotifyAuthFactory, SPOTIFY) {
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
                    if (response.status == 204) {
                        resolve(response);
                    } else {
                        reject(response);
                    }
                })
                .catch(err => reject(err));
        });
    };
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
                    if (response.status == 204) {
                        resolve(response);
                    } else {
                        reject(response);
                    }
                })
                .catch(err => reject(err));
        });
    };

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
                if (response.status == 204) {
                    resolve(response);
                } else {
                    reject(response);
                }
            })
            .catch(err => reject(err));
    });
};

return { playTrack, playPlaylist };
});