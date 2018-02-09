"use strict";

const angular = require("angular");

angular.module("mixtape").controller("EditLinkCtrl", function($scope, GoodreadsFactory, TmdbFactory, SpotifyAuthFactory, $location, TMDB, SpotifyTrackFactory, FirebaseFactory, $q, LinkFactory, $window, $routeParams) {
    $scope.key = $routeParams.id;
    SpotifyAuthFactory.getActiveUserData()
        .then(data => {
            $scope.uid = data.username;

            LinkFactory.getLinkByKey($scope.key)
                .then(link => {
                    if (link.uid != $scope.uid) {
                        $location.path("/");
                    } else {
                        $scope.activeMedia = link.media.split(":")[0];
                        $scope.activeMusic = link.music.split(":")[0];
                        $scope.tags = link.tags.join(", ");
                        FirebaseFactory.getMediaByTypeId(link.media)
                            .then(media => {
                                $scope.selectedMedia = media;
                            });
                        FirebaseFactory.getTrackByTypeId(link.music)
                            .then(music => {
                                $scope.selectedMusic = music;
                            });
                    }
                });
        })
        .catch(err => {
            $location.path("/");
        });

    $scope.searchMedia = () => {
        if ($scope.mediaSearchTerm != "" && $scope.activeMedia) {
            $scope.results = {};
            if ($scope.activeMedia == "book") {
                GoodreadsFactory.searchByTitle($scope.mediaSearchTerm)
                    .then(results => {
                        $scope.mediaResults = results.results.work.slice(0,5);
                    });
            } else if ($scope.activeMedia == "tv") {
                $scope.image_prefix = TMDB.small_image_prefix;
                TmdbFactory.searchTvShowsByTitle($scope.mediaSearchTerm)
                    .then(results => {
                        $scope.mediaResults = results.results.slice(0,5);
                    });
            } else if ($scope.activeMedia == "movie") {
                $scope.image_prefix = TMDB.small_image_prefix;
                TmdbFactory.searchMoviesByTitle($scope.mediaSearchTerm)
                    .then(results => {
                        $scope.mediaResults = results.results.slice(0,5);
                    });
            }
        }
    };

    $scope.searchMusic = () => {
        if ($scope.searchMusicTerm != "" && $scope.activeMusic) {
            if ($scope.activeMusic == "track") {
                SpotifyTrackFactory.searchTracksByTitle($scope.musicSearchTerm)
                    .then(results => {
                        $scope.musicResults = results.slice(0,5);
                    });
            }
        }
    };

    $scope.selectMedia = (id) => {
        if ($scope.activeMedia == "tv") {
            TmdbFactory.getTvShowById(id)
                .then(show => {
                    $scope.selectedMedia = TmdbFactory.parseApiInfo("tv", show);
                });
        } else if ($scope.activeMedia == "movie") {
            TmdbFactory.getMovieById(id)
                .then(movie => {
                    $scope.selectedMedia = TmdbFactory.parseApiInfo("movie", movie);
                });
        } else if ($scope.activeMedia == "book") {
            GoodreadsFactory.getBookById(id)
                .then(book => {
                    $scope.selectedMedia = GoodreadsFactory.parseApiInfo(book);
                });
        }
    };

    $scope.selectMusic = (id) => {
        if ($scope.activeMusic == "track") {
            SpotifyTrackFactory.getTrackById(id)
                .then(track => {
                    $scope.selectedMusic = SpotifyTrackFactory.parseApiInfo("track", track);
                });
        }
    };

    $scope.submit = () => {
        if ($scope.selectedMedia && $scope.selectedMusic) {
            let mediaTypeId = `${$scope.activeMedia}:${$scope.selectedMedia.id}`;
            let musicTypeId = `${$scope.activeMusic}:${$scope.selectedMusic.id}`;
            let promises = [];
            promises.push(FirebaseFactory.storeMedia(mediaTypeId, $scope.selectedMedia));
            promises.push(FirebaseFactory.storeMusic(musicTypeId, $scope.selectedMusic));
            Promise.all(promises)
                .then(response => {
                    return LinkFactory.editLink($scope.key, mediaTypeId, musicTypeId, $scope.tags.trim().split(","), $scope.uid);
                })
                .then(response => {
                    $window.location.href = `#!/${$scope.activeMedia}/${mediaTypeId.split(":")[1]}`;
                })
                .catch(err => {
                    Materialize.toast(err, 3000, "pink accent-2");
                });
        }
    };
});