"use strict";

const angular = require("angular");

angular.module("mixtape").factory("VoteFactory", function($q, $http, FIREBASE) {

    // set the given user's vote on the given link to value
    let vote = (linkId, uid, value) => {
        return $q((resolve, reject) => {
            let vote = {
                added: parseInt(Date.now()/1000),
                uid,
                linkId,
                value
            };
            $http.put(`${FIREBASE.url}/votes/${uid}:${linkId}.json`, JSON.stringify(vote))
                .then(response => resolve(response))
                .catch(err => reject(err));
        });
    };

    // promises the value of the given user's vote on the given link
    let getVote = (linkId, uid) => {
        return $q((resolve, reject) => {
            $http.get(`${FIREBASE.url}/votes/${uid}:${linkId}/value.json`)
                .then(({data}) => resolve(data))
                .catch(err => reject(err)); 
        });
    };

    // set user's vote on link to 1
    let upvote = (linkId, uid) => {
        return vote(linkId, uid, 1);
    };
    // set user's vote on link to -1
    let downvote = (linkId, uid) => {
        return vote(linkId, uid, -1);
    };
    // remove user's vote on link
    let unvote = (linkId, uid) => {
        return $q((resolve, reject) => {
            $http.delete(`${FIREBASE.url}/votes/${uid}:${linkId}.json`)
                .then(({data}) => resolve(data))
                .catch(err => reject(err)); 
        });
    };

    // integrate the vote into a link object
    let loadVote = (link, uid) => {
        return $q((resolve, reject) => {
            if (link.uid != uid) {
                getVote(link.key, uid)
                    .then(vote => {
                        link.vote = vote;
                        resolve(link);
                    });
            } else {
                resolve(link);
            }
        });
    };

    return { upvote, downvote, unvote, getVote, loadVote };
});