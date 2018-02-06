"use strict";

const angular = require("angular");

angular.module("mixtape").factory("LinkFactory", function($q, $http, FIREBASE, FirebaseFactory) {
    const getLinksByUid = uid => {
        return $q((resolve, reject) => {
            $http.get(`${FIREBASE.dbUrl}/links.json?orderBy="uid"&equalTo="${uid}"`)
                .then(({data}) => {
                    let links = Object.entries(data);
                    let linkPromises = links.map(link => {
                        return loadLink(link);
                    });
                    Promise.all(linkPromises)
                        .then(loadedLinks => {
                            resolve(loadedLinks);
                        });
                });
        });
    };

    const loadLink = link => {
        return $q((resolve, reject) => {
            let mediaTypeId = link[1].media;
            let musicTypeId = link[1].music;
            FirebaseFactory.getMediaByTypeId(mediaTypeId)
                .then(media => {
                    link[1].media = media;
                    if (musicTypeId.split(":")[0] == "track") {
                        return FirebaseFactory.getTrackByTypeId(musicTypeId);
                    } else {
                        // TODO: deal with playlist links
                    }
                })
                .then(music => {
                    link[1].music = music;
                    resolve(link);
                });
        });
    };

    return { getLinksByUid };
});