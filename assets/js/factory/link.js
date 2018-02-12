"use strict";

const angular = require("angular");

angular.module("mixtape").factory("LinkFactory", function ($q, $http, FIREBASE, FirebaseFactory) {

    // returns loaded links by uid, newest first
    const getLinksByUid = (uid, limit) => {
        return $q((resolve, reject) => {
            $http.get(`${FIREBASE.dbUrl}/links.json?orderBy="uid"&equalTo="${uid}"`)
                .then(({ data }) => {
                    let links = Object.entries(data);
                    // sorts newest first
                    links = links.sort((a, b) => {
                        return +b[1].added - a[1].added;
                    });
                    // takes only the first few
                    links = links.slice(0, limit);
                    // loads each link
                    let linkPromises = links.map(link => {
                        return loadLink(link, false);
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
                        return loadLink(link, true);
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
                        return loadLink(link, true);
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
    // username = true/false, whether or not to fetch user's display_name
    const loadLink = (link, username) => {
        return $q((resolve, reject) => {
            if (link[1]) {
                link[1].key = link[0];
                link = link[1];
            }
            let mediaTypeId = link.media;
            let musicTypeId = link.music;
            FirebaseFactory.getMediaByTypeId(mediaTypeId)
                .then(media => {
                    link.media = media;
                    if (musicTypeId.split(":")[0] == "track") {
                        FirebaseFactory.getTrackById(musicTypeId.split(":")[1])
                            .then(music => {
                                link.music = music;
                                link.music.type = "track";
                            });
                    } else {
                        FirebaseFactory.getPlaylistByIds(musicTypeId.split(":")[1], musicTypeId.split(":")[2])
                            .then(music => {
                                link.music = music;
                                link.music.type = "playlist";
                                link.music.prefix = `user/${musicTypeId.split(":")[1]}/`;
                            });
                    }
                })
                .then(music => {
                    link.music = music;
                    if (username) {
                        FirebaseFactory.getDisplayName(link.uid)
                            .then(name => {
                                link.name = name;
                                resolve(link);
                            });
                    } else {
                        resolve(link);
                    }
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

    const editLink = (key, mediaTypeId, musicTypeId, tags, uid) => {
        return $q((resolve, reject) => {
            let link = {
                added: parseInt(Date.now() / 1000),
                media: mediaTypeId,
                music: musicTypeId,
                tags,
                uid
            };
            $http.patch(`${FIREBASE.dbUrl}/links/${key}.json`, JSON.stringify(link))
                .then(response => resolve(response));
        });
    };

    // gets link by key
    let getLinkByKey = key => {
        return $q((resolve, reject) => {
            $http.get(`${FIREBASE.dbUrl}/links/${key}.json`)
                .then(({data}) => {
                    resolve(data);
                });
        });
    };

    // removes link by key
    let deleteLink = key => {
        return $q((resolve, reject) => {
            $http.delete(`${FIREBASE.dbUrl}/links/${key}.json`)
                .then(result => resolve(result))
                .catch(err => reject(err));
        });
    };

    return { getLinksByUid, getLinksByMedia, getLinksByMusic, storeNewLink, getLinkByKey, editLink, deleteLink };
});