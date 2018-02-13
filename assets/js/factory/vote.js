"use strict";

const angular = require("angular");

angular.module("mixtape").factory("VoteFactory", function($q, $http, FIREBASE, SpotifyAuthFactory) {
    let vote = (linkId, uid, value) => {
        return $q((resolve, reject) => {
            let vote = {
                added: parseInt(Date.now()/1000),
                uid,
                linkId,
                value
            };
            $http.put(`${FIREBASE.dbUrl}/votes/${uid}:${linkId}.json`, JSON.stringify(vote))
                .then(response => resolve(response))
                .catch(err => reject(err));
        });
    };

    let getVote = (linkId, uid) => {
        return $q((resolve, reject) => {
            $http.get(`${FIREBASE.dbUrl}/votes/${uid}:${linkId}/value.json`)
                .then(({data}) => resolve(data))
                .catch(err => reject(err)); 
        });
    };

    let upvote = (linkId, uid) => {
        return vote(linkId, uid, 1);
    };
    let downvote = (linkId, uid) => {
        return vote(linkId, uid, -1);
    };
    let unvote = (linkId, uid) => {
        return $q((resolve, reject) => {
            $http.delete(`${FIREBASE.dbUrl}/votes/${uid}:${linkId}/value.json`)
                .then(({data}) => resolve(data))
                .catch(err => reject(err)); 
        });
    };
    return { upvote, downvote, unvote, getVote };
});