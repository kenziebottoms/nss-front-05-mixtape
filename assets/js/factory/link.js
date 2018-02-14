"use strict";

const angular = require("angular");
const _ = require("lodash");

angular.module("mixtape").factory("LinkFactory", function ($q, $http, FIREBASE, FirebaseFactory) {

    // gets $limit recent links, unique by media, sorts them newest first
    const getRecentLinks = limit => {
        return $q((resolve, reject) => {
            $http.get(`${FIREBASE.dbUrl}/links.json?orderBy="added"&limitTo=${limit}`)
                .then(({ data }) => {
                    data = Object.entries(data);
                    let links = data.map(link => {
                        link[1].key = link[0];
                        return link[1];
                    });
                    links = _.uniqBy(links, 'media');
                    let linkPromises = links.map(link => {
                        return loadLink(link);
                    });
                    return Promise.all(linkPromises);
                })
                .then(loadedLinks => {
                    loadedLinks = _.sortBy(loadedLinks, "added");
                    loadedLinks.reverse();
                    resolve(loadedLinks);
                })
                .catch(err => reject(err));
        });
    };

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

    // takes a link object with a reference to music
    // returns a link object with a music object as a property
    const loadMusic = link => {
        return $q((resolve, reject) => {
            let typeId = link.music;
            let type = typeId.split(":")[0];
            if (type == "track") {
                let type = typeId.split(":")[0];
                let id = typeId.split(":")[1];
                FirebaseFactory.getTrackById(id)
                    .then(track => {
                        link.music = track;
                        link.music.type = type;
                        resolve(link);
                    })
                    .catch(err => reject(err));
            } else if (type == "playlist") {
                let uid = typeId.split(":")[1];
                let id = typeId.split(":")[2];
                FirebaseFactory.getPlaylistByIds(uid, id)
                    .then(playlist => {
                        link.music = playlist;
                        link.music.type = type;
                        link.music.ownerId = uid;
                        link.music.prefix = `user/${uid}/`;
                        resolve(link);
                    })
                    .catch(err => reject(err));
            } else {
                reject("not a valid music type");
            }
        });
    };

    // takes a link object with a reference to media
    // returns a link object with a media object as a property
    const loadMedia = link => {
        return $q((resolve, reject) => {
            let typeId = link.media;
            FirebaseFactory.getMediaByTypeId(typeId)
                .then(media => {
                    link.media = media;
                    resolve(link);
                })
                .catch(err => reject(err));
        });
    };

    // takes a link object with music & media references
    // returns a link object with a music & media objects as properties
    // NOTE: username = true/false, whether or not to fetch user's display_name
    const loadLink = (link, username) => {
        return $q((resolve, reject) => {
            if (link[1]) {
                link[1].key = link[0];
                link = link[1];
            }
            loadMedia(link)
                .then(mediaLink => {
                    return loadMusic(mediaLink);
                })
                .then(loadedLink => {
                    if (username) {
                        FirebaseFactory.getDisplayName(loadedLink.uid)
                            .then(name => {
                                loadedLink.name = name;
                                resolve(loadedLink);
                            });
                    } else {
                        resolve(loadedLink);
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
            if (tags == "") { tags = []; }
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
                .then(({ data }) => {
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

    return { getLinksByUid, getLinksByMedia, getLinksByMusic, storeNewLink, getLinkByKey, editLink, deleteLink, getRecentLinks };
});