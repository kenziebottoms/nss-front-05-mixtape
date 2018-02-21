"use strict";

const angular = require("angular");
const _ = require("lodash");

angular.module("mixtape").factory("SubscriptionFactory", function($q, $http, FIREBASE) {

    // adds a subscription between given media and user
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

    // adds a subscription between given media and user
    let subscribeMusic = (typeId, uid) => {
        return $q((resolve, reject) => {
            let sub = { uid, music: typeId };
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
                    let key = _.findKey(data, ["media", typeId]);
                    if (key) {
                        let sub = data[key];
                        sub.key = key;
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

    // promises the subscription object if the sub exists, rejects otherwise
    let isSubscribedMusic = (typeId, uid) => {
        return $q((resolve, reject) => {
            $http.get(`${FIREBASE.url}/subs.json?orderBy="uid"&equalTo="${uid}"`)
                .then(({data}) => {
                    let key = _.findKey(data, ["music", typeId]);
                    if (key) {
                        let sub = data[key];
                        sub.key = key;
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

    // deletes subscription by key
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

    return { subscribeMedia, subscribeMusic, isSubscribedMedia, isSubscribedMusic, unsubscribe };
});