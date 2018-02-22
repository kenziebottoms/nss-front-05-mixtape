"use strict";

const angular = require("angular");
const _ = require("lodash");

angular.module("mixtape").factory("LinkFactory", function ($q, $http, FIREBASE, FirebaseFactory) {

    // promises recent links, unique by media, sorts them newest first
    let getRecentLinks = limit => {
        return $q((resolve, reject) => {
            $http.get(`${FIREBASE.url}/links.json?orderBy="added"&limitTo=${limit}`)
                .then(({ data }) => {
                    data = Object.entries(data);
                    // collapses [key, value] into value: { key: ... }
                    let links = data.map(link => {
                        link[1].key = link[0];
                        return link[1];
                    });
                    // removes oldest duplicate media
                    links = _.sortBy(links, l => -l.added); // reverse sort by added
                    links = _.uniqBy(links, 'media'); // eliminate second/third/etc. instances of same values
                    // loads links
                    let linkPromises = links.map(link => {
                        return loadLink(link);
                    });
                    return Promise.all(linkPromises);
                })
                .then(loadedLinks => {
                    // sort by date added
                    loadedLinks = _.sortBy(loadedLinks, "added");
                    // sort by newest first
                    loadedLinks.reverse();
                    resolve(loadedLinks);
                })
                .catch(err => reject(err));
        });
    };

    // promises loaded links by a given user, newest first
    let getLinksByUid = (uid, limit) => {
        return $q((resolve, reject) => {
            $http.get(`${FIREBASE.url}/links.json?orderBy="uid"&equalTo="${uid}"`)
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

    // promises list of all loaded links connected to a given media item
    let getLinksByMedia = typeId => {
        return $q((resolve, reject) => {
            $http.get(`${FIREBASE.url}/links.json?orderBy="media"&equalTo="${typeId}"`)
                .then(({ data }) => {
                    let links = Object.entries(data);
                    // loads links
                    let linkPromises = links.map(link => {
                        return loadLink(link, true);
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

    // promises list of all loaded links connected to given music item
    let getLinksByMusic = typeId => {
        return $q((resolve, reject) => {
            $http.get(`${FIREBASE.url}/links.json?orderBy="music"&equalTo="${typeId}"`)
                .then(({ data }) => {
                    let links = Object.entries(data);
                    // loads all links
                    let linkPromises = links.map(link => {
                        return loadLink(link, true);
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

    // takes an object with a reference to music
    // promises an object with a music object as a property
    let loadMusic = link => {
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

    // takes an object with a reference to media
    // promises an object with a media object as a property
    let loadMedia = link => {
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

    // takes an object with music & media references
    // promises an object with a music & media objects as properties
    // NOTE: username = true/false, whether or not to fetch user's display_name
    let loadLink = (link, username) => {
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

    // checks for existing duplicate links, then posts new link
    let storeNewLink = (mediaTypeId, musicTypeId, tags, uid) => {
        return $q((resolve, reject) => {
            $http.get(`${FIREBASE.url}/links.json?orderBy="uid"&equalTo="${uid}"`)
                .then(({ data }) => {
                    // checks for existing link between given media & music
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
                    $http.post(`${FIREBASE.url}/links.json`, JSON.stringify(link))
                        .then(response => resolve(response));
                });
        });
    };

    // patches existing link with data
    let editLink = (key, mediaTypeId, musicTypeId, tags, uid) => {
        return $q((resolve, reject) => {
            if (tags == "") { tags = []; }
            let link = {
                added: parseInt(Date.now() / 1000),
                media: mediaTypeId,
                music: musicTypeId,
                tags,
                uid
            };
            $http.patch(`${FIREBASE.url}/links/${key}.json`, JSON.stringify(link))
                .then(response => resolve(response));
        });
    };

    // promises link object by key
    let getLinkByKey = key => {
        return $q((resolve, reject) => {
            $http.get(`${FIREBASE.url}/links/${key}.json`)
                .then(({ data }) => {
                    resolve(data);
                });
        });
    };

    // deletes link by key
    let deleteLink = key => {
        return $q((resolve, reject) => {
            $http.delete(`${FIREBASE.url}/links/${key}.json`)
                .then(result => resolve(result))
                .catch(err => reject(err));
        });
    };

    return { getLinksByUid, getLinksByMedia, getLinksByMusic, storeNewLink, getLinkByKey, editLink, deleteLink, getRecentLinks, loadMusic, loadMedia };
});