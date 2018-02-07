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
    const getTvShowById = id => {
        return $q((resolve, reject) => {
            $http.get(`${TMDB.url}/tv/${id}?api_key=${TMDB.key}`)
                .then(({data}) => {
                    resolve(data);
                });
        });
    };

    // takes raw data from an API call and returns data ready for Firebase
    const parseApiInfo = (type, data) => {
        let media = {
            year: data.release_date.slice(0,4),
            title: data.title,
            image: data.poster_path
        };
        return media;
    };

    return {searchMoviesByTitle, getMovieById, getTvShowById, parseApiInfo};
});