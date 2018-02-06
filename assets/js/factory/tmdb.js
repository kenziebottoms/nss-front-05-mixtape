"use strict";

const angular = require("angular");

angular.module("mixtape").factory("TmdbFactory", function($q, $http, TMDB) {
    const searchMoviesByTitle = title => {
        return $q((resolve, reject) => {
            $http.get(`${TMDB.url}/search/movie?api_key=${TMDB.key}&query=${title}`)
                .then(results => resolve(results));
        });
    };
    const getMovieById = id => {
        return $q((resolve, reject) => {
            $http.get(`${TMDB.url}/movie/${id}?api_key=${TMDB.key}`)
                .then(({data}) => {
                    resolve(data);
                });
        });
    };

    return {searchMoviesByTitle, getMovieById};
});