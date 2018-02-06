"use strict";

const angular = require("angular");

angular.module("mixtape").factory("FirebaseFactory", function($q, $http, FIREBASE) {
    let getRecentMedia = () => {
        return $q((resolve, reject) => {
            $http.get(`${FIREBASE.dbUrl}/media.json?orderBy="last_cached"&limitToFirst=20`)
                .then(data => {
                    console.log(data);
                });
        });
    };
    
    let getMediaByType = (type, limit) => {
        return $q((resolve, reject) => {
            $http.get(`${FIREBASE.dbUrl}/media.json?orderBy="type"&equalTo="${type}"&limitToFirst=${limit}`)
                .then(({data}) => {
                    resolve(data);
                });
        });
    };

    let getMediaByTypeId = typeId => {
        return $q((resolve, reject) => {
            $http.get(`${FIREBASE.dbUrl}/media/${typeId}.json`)
                .then(({data}) => {
                    resolve(data);
                });
        });
    };

    let getTrackByTypeId = typeId => {
        return $q((resolve, reject) => {
            let id = typeId.split(":")[1];
            $http.get(`${FIREBASE.dbUrl}/tracks/${id}.json`)
                .then(({data}) => {
                    resolve(data);
                });
        });
    };

    const storeUserData = (username, data) => {
        return $q((resolve, reject) => {
            $http.put(`${FIREBASE.dbUrl}/users/${username}.json`, data)
                .then(response => resolve(response));
        });
    };

    const getUserData = username => {
        return $q((resolve, reject) => {
            $http.get(`${FIREBASE.dbUrl}/users/${username}.json`)
                .then(response => resolve(response));
        });
    };

    return {getMediaByType, getMediaByTypeId, getTrackByTypeId, storeUserData, getUserData};
});