"use strict";

const angular = require("angular");

angular.module("mixtape").factory("FirebaseFactory", function($q, $http, FIREBASE) {
    
    // returns a list of $limit media items of given type
    let getMediaByType = (type, limit) => {
        return $q((resolve, reject) => {
            $http.get(`${FIREBASE.dbUrl}/media.json?orderBy="type"&equalTo="${type}"&limitToFirst=${limit}`)
                .then(({data}) => {
                    resolve(data);
                });
        });
    };

    // returns a piece of media by the given type and id
    let getMediaByTypeId = typeId => {
        return $q((resolve, reject) => {
            $http.get(`${FIREBASE.dbUrl}/media/${typeId}.json`)
                .then(({data}) => {
                    resolve(data);
                });
        });
    };

    // returns details of track with given id
    let getTrackByTypeId = typeId => {
        return $q((resolve, reject) => {
            let id = typeId.split(":")[1];
            $http.get(`${FIREBASE.dbUrl}/tracks/${id}.json`)
                .then(({data}) => {
                    resolve(data);
                });
        });
    };

    // stores data about the current active user in Firebase
    const storeUserData = (username, data) => {
        return $q((resolve, reject) => {
            $http.put(`${FIREBASE.dbUrl}/users/${username}.json`, data)
                .then(response => resolve(response));
        });
    };

    // gets data about the given user
    const getUserData = username => {
        return $q((resolve, reject) => {
            $http.get(`${FIREBASE.dbUrl}/users/${username}.json`)
                .then(response => resolve(response));
        });
    };

    // gets the display_name of the given user
    const getDisplayName = username => {
        return $q((resolve, reject) => {
            $http.get(`${FIREBASE.dbUrl}/users/${username}/display_name.json`)
                .then(({data}) => resolve(data));
        });
    };

    // updates catched info and updates last_cached timestamp
    const cacheInfo = (typeId, data) => {
        return $q((resolve, reject) => {
            data.last_cached = parseInt(Date.now()/1000);
            $http.patch(`${FIREBASE.dbUrl}/media/${typeId}.json`, data)
                .then(response => {
                    resolve(response);
                })
                .catch(err => reject(err));
        });
    };

    const storeMedia = (typeId, data) => {
        return $q((resolve, reject) => {
            data.type = typeId.split(":")[0];
            data.last_cached = parseInt(Date.now()/1000);
            $http.put(`${FIREBASE.dbUrl}/media/${typeId}.json`, data)
                .then(response => {
                    resolve(response);
                })
                .catch(err => reject(err));
        });
    };

    const storeMusic = (typeId, data) => {
        return $q((resolve, reject) => {
            if (typeId.split(":")[0] == "track") {
                data.last_cached = parseInt(Date.now()/1000);
                $http.put(`${FIREBASE.dbUrl}/tracks/${typeId.split(":")[1]}.json`, data)
                    .then(response => {
                        resolve(response);
                    })
                    .catch(err => reject(err));
            }
        });
    };

    return {getMediaByType, getMediaByTypeId, getTrackByTypeId, storeUserData, getUserData, getDisplayName, cacheInfo, storeMedia, storeMusic};
});