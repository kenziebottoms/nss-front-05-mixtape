"use strict";

const angular = require("angular");
const _ = require("lodash");

angular.module("mixtape").factory("LinkFactory", function($q, $http, FIREBASE, FirebaseFactory) {

    // returns loaded links by uid, newest first
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
                            // shows newest first
                            loadedLinks.sort((a,b) => {
                                return +b[1].added - a[1].added;
                            });
                            resolve(loadedLinks);
                        });
                });
        });
    };

    // returns loaded links by media typeId, newest first
    const getLinksByMedia = typeId => {
        return $q((resolve, reject) => {
            $http.get(`${FIREBASE.dbUrl}/links.json?orderBy="media"&equalTo="${typeId}"`)
                .then(({data}) => {
                    let links = Object.entries(data);
                    let linkPromises = links.map(link => {
                        return loadLink(link);
                    });
                    Promise.all(linkPromises)
                        .then(loadedLinks => {
                            // shows newest first
                            loadedLinks.sort((a,b) => {
                                return +b[1].added - a[1].added;
                            });
                            resolve(loadedLinks);
                        });
                });
        });
    };

    // takes an object with music/media references and replaces the references with objects
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
                    return FirebaseFactory.getDisplayName(link[1].uid);
                })
                .then(name => {
                    link[1].name = name;
                    resolve(link);
                });
        });
    };
    
    const storeNewLink = (mediaTypeId, musicTypeId, tags, uid) => {
        return $q((resolve, reject) => {
            let link = {
                added: parseInt(Date.now()/1000),
                media: mediaTypeId,
                music: musicTypeId,
                uid
            };
            $http.post(`${FIREBASE.dbUrl}/links.json`, JSON.stringify(link))
                .then(response => resolve(response));
        });
    };

    return { getLinksByUid, getLinksByMedia, storeNewLink };
});