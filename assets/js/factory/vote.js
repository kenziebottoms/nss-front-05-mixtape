"use strict";

const angular = require("angular");

angular.module("mixtape").factory("VoteFactory", function($q, $http, FIREBASE, SpotifyAuthFactory) {
    let upvote = (linkId, uid) => {
        // TODO: check if user has already upvoted it
        return $q((resolve, reject) => {
            let vote = {
                added: parseInt(Date.now()/1000),
                uid: uid,
                linkId: linkId
            };
            $http.post(`${FIREBASE.dbUrl}/votes.json`, JSON.stringify(vote))
                .then(response => resolve(response))
                .catch(err => reject(err));
        });
    };
    return { upvote };
});