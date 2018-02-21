"use strict";

const angular = require("angular");

angular.module("mixtape").factory("SubscriptionFactory", function($q, $http, FIREBASE) {
    let subscribeMedia = (typeId, uid) => {
        return $q((resolve, reject) => {
            let sub = { uid, media: typeId };
            $http.post(`${FIREBASE.url}/subs.json`, sub)
                .then(response => {
                    if (response.status == 200) {
                        resolve(response.data);
                    } else {
                        reject();
                    }
                })
                .catch(err => {
                    resolve(err);
                });
        });
    };

    // promises the subscription object if the sub exists, rejects otherwise
    let isSubscribedMedia = (typeId, uid) => {
        return $q((resolve, reject) => {
            $http.get(`${FIREBASE.url}/subs.json?orderBy="uid"&equalTo="${uid}"`)
                .then(({data}) => {
                    let sub = Object.values(data);
                    if (sub.length > 0) {
                        // assigns the key as a property to the new anonymous object
                        sub = sub[0];
                        sub.key = Object.keys(data)[0];
                        resolve(sub);
                    } else {
                        reject();
                    }
                })
                .catch(err => {
                    reject(err);
                });
        });
    };

    let unsubscribe = key => {
        return $q((resolve, reject) => {
            $http.delete(`${FIREBASE.url}/subs/${key}.json`)
                .then(response => {
                    resolve(response);
                })
                .catch(err => {
                    reject(err);
                });
        });
    };

    return { subscribeMedia, isSubscribedMedia, unsubscribe };
});