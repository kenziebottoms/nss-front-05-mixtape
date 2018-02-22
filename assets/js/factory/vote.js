"use strict";

const angular = require("angular");
const _ = require("lodash");

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

    // promises the sum of all votes on given link
    let getVoteTotal = linkId => {
        return $q((resolve, reject) => {
            $http.get(`${FIREBASE.url}/votes.json?orderBy="linkId"&equalTo="${linkId}"`)
                .then(({data}) => resolve(score(data)))
                .catch(err => reject(err)); 
        });
    };

    // returns sum of the values of the given vote objects
    let score = votes => {
        return _.sumBy(Object.values(votes), "value");
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

    // integrate current user's vote and score into a link object
    let loadVote = (link, uid) => {
        return $q((resolve, reject) => {
            // get vote total/score
            getVoteTotal(link.key)
                .then(total => {
                    link.score = total;
                    // if current user is not this link's author
                    if (link.uid != uid) {
                        // get current user's vote
                        return getVote(link.key, uid);
                    } else {
                        resolve(link);
                    }
                })
                .then(vote => {
                    link.vote = vote;
                    resolve(link);
                });
        });
    };

    return { upvote, downvote, unvote, getVote, loadVote, getVoteTotal };
});