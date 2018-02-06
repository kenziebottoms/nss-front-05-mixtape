"use strict";

const angular = require("angular");

angular.module("mixtape").factory("LinkFactory", function($q, $http, FIREBASE) {
    const getLinksByUid = uid => {
        return $q((resolve, reject) => {
            $http.get(`${FIREBASE.dbUrl}/links.json?orderBy="uid"&equalTo="${uid}"`)
                .then(({data}) => {
                    resolve(data);
                });
        });
    };

    return { getLinksByUid };
});