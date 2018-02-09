"use strict";

const angular = require("angular");
const _ = require("lodash");

angular.module("mixtape").factory("LinkFactory", function ($q, $http, FIREBASE, FirebaseFactory) {

    // returns loaded links by uid, newest first
    const getLinksByUid = (uid, limit) => {
        return $q((resolve, reject) => {
            $http.get(`${FIREBASE.dbUrl}/links.json?orderBy="uid"&equalTo="${uid}"`)
                .then(({ data }) => {
                    let links = Object.entries(data);
                    // sorts newest first
                    links.sort((a, b) => {
                        return +b.added - a.added;
                    });
                    // takes only the first few
                    links = links.slice(0, limit);
                    // loads each link
                    let linkPromises = links.map(link => {
                        return loadLink(link);
                    });
                    Promise.all(linkPromises)
                        .then(loadedLinks => {
                            // sorts newest first
                            loadedLinks.sort((a, b) => {
                                return +b.added - a.added;
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
                .then(({ data }) => {
                    let links = Object.entries(data);
                    let linkPromises = links.map(link => {
                        return loadLink(link);
                    });
                    Promise.all(linkPromises)
                        .then(loadedLinks => {
                            // shows newest first
                            loadedLinks.sort((a, b) => {
                                return +b.added - a.added;
                            });
                            resolve(loadedLinks);
                        });
                });
        });
    };

    // returns loaded links by music typeId, newest first
    const getLinksByMusic = typeId => {
        return $q((resolve, reject) => {
            $http.get(`${FIREBASE.dbUrl}/links.json?orderBy="music"&equalTo="${typeId}"`)
                .then(({ data }) => {
                    let links = Object.entries(data);
                    let linkPromises = links.map(link => {
                        return loadLink(link);
                    });
                    Promise.all(linkPromises)
                        .then(loadedLinks => {
                            // shows newest first
                            loadedLinks.sort((a, b) => {
                                return +b.added - a.added;
                            });
                            resolve(loadedLinks);
                        });
                });
        });
    };

    // takes an object with music/media references and replaces the references with objects
    const loadLink = link => {
        return $q((resolve, reject) => {
            if (link[1]) {
                link = link[1];
                link.key = link[0];
            }
            let mediaTypeId = link.media;
            let musicTypeId = link.music;
            FirebaseFactory.getMediaByTypeId(mediaTypeId)
                .then(media => {
                    link.media = media;
                    if (musicTypeId.split(":")[0] == "track") {
                        FirebaseFactory.getTrackByTypeId(musicTypeId)
                            .then(music => {
                                link.music = music;
                            });
                    } else {
                        // TODO: deal with playlist links
                    }
                })
                .then(music => {
                    link.music = music;
                    return FirebaseFactory.getDisplayName(link.uid);
                })
                .then(name => {
                    link.name = name;
                    resolve(link);
                });
        });
    };

    const storeNewLink = (mediaTypeId, musicTypeId, tags, uid) => {
        return $q((resolve, reject) => {
            $http.get(`${FIREBASE.dbUrl}/links.json?orderBy="uid"&equalTo="${uid}"`)
                .then(({ data }) => {
                    Object.values(data).forEach(link => {
                        if (link.media == mediaTypeId &&
                            link.music == musicTypeId) {
                            reject(`You've already mixed these. Try editing it.`);
                        }
                    });
                    if (tags == "") { tags = []; }
                    let link = {
                        added: parseInt(Date.now() / 1000),
                        media: mediaTypeId,
                        music: musicTypeId,
                        tags,
                        uid
                    };
                    $http.post(`${FIREBASE.dbUrl}/links.json`, JSON.stringify(link))
                        .then(response => resolve(response));
                });
        });
    };

    return { getLinksByUid, getLinksByMedia, getLinksByMusic, storeNewLink };
});