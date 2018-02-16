"use strict";

const angular = require("angular");

angular.module("mixtape").controller("MixCtrl", function ($scope, GoodreadsFactory, TmdbFactory, SpotifyAuthFactory, $location, TMDB, SpotifyTrackFactory, FirebaseFactory, LinkFactory, $window, $routeParams, SpotifyPlaylistFactory) {

    // get active user
    SpotifyAuthFactory.getActiveUserData()
        .then(data => {
            $scope.user = data;
            // gets the link/mix id/key
            $scope.key = $routeParams.id;
            // if it's an edit page
            if ($scope.key) {
                $scope.context = "edit";
                // fetch the link
                LinkFactory.getLinkByKey($scope.key)
                    .then(link => {
                        // if user didn't create the link
                        if ($scope.user.id != link.uid) {
                            // kick em out
                            $location.path("/");
                        } else {
                            // populate page with link's contents
                            $scope.activeMedia = link.media.split(":")[0];
                            $scope.activeMusic = link.music.split(":")[0];
                            if (link.tags) {
                                $scope.tags = link.tags.join(", ");
                            } else {
                                $scope.tags = "";
                            }

                            // populate media
                            FirebaseFactory.getMediaByTypeId(link.media)
                                .then(media => {
                                    $scope.selectedMedia = media;
                                });

                            // populate music
                            if ($scope.activeMusic == "track") {
                                FirebaseFactory.getTrackById(link.music.split(":")[1])
                                    .then(music => {
                                        $scope.selectedMusic = music;
                                    });
                            } else {
                                FirebaseFactory.getPlaylistByIds(link.music.split(":")[1], link.music.split(":")[2])
                                    .then(music => {
                                        $scope.selectedMusic = music;
                                    });
                            }
                        }
                    });
            // if adding a new page
            } else {
                $scope.context = "new";
            }
        })
        // no user logged in
        .catch(err => {
            $location.path("/");
        });

    // displays 5 results for the search term in the selected medium
    $scope.searchMedia = () => {
        // only searches if the term isn't empty and a medium is selected
        if ($scope.mediaSearchTerm != "" && $scope.activeMedia) {
            $scope.results = {};
            if ($scope.activeMedia == "book") {
                GoodreadsFactory.searchByTitle($scope.mediaSearchTerm)
                    .then(results => {
                        if (results.results.length > 0) {
                            $scope.mediaResults = results.results.work.slice(0, 5);
                        } else {
                            $scope.mediaResults = false;
                        }
                    })
                    .catch(err => {
                        $scope.mediaResults = false;
                    });
            } else if ($scope.activeMedia == "tv") {
                $scope.image_prefix = TMDB.small_image_prefix;
                TmdbFactory.searchTvShowsByTitle($scope.mediaSearchTerm)
                    .then(results => {
                        if (results.results.length > 0) {
                            $scope.mediaResults = results.results.slice(0, 5);
                        } else {
                            $scope.mediaResults = false;
                        }
                    })
                    .catch(err => {
                        $scope.mediaResults = false;
                    });
            } else if ($scope.activeMedia == "movie") {
                $scope.image_prefix = TMDB.small_image_prefix;
                TmdbFactory.searchMoviesByTitle($scope.mediaSearchTerm)
                    .then(results => {
                        if (results.results.length > 0) {
                            $scope.mediaResults = results.results.slice(0, 5);
                        } else {
                            $scope.mediaResults = false;
                        }
                    })
                    .catch(err => {
                        $scope.mediaResults = false;
                    });
            }
        }
    };

    // displays 5 results for the search term in the selected music format
    $scope.searchMusic = () => {
        // only searches if term isn't empty and a music format is selected
        if ($scope.searchMusicTerm != "" && $scope.activeMusic) {
            if ($scope.activeMusic == "track") {
                SpotifyTrackFactory.searchTracksByTitle($scope.musicSearchTerm)
                    .then(results => {
                        if (results.length > 0) {
                            $scope.musicResults = results.slice(0, 5);
                        } else {
                            $scope.musicResults = false;
                        }
                    })
                    .catch(err => {
                        $scope.musicResults = false;
                    });
            } else {
                SpotifyPlaylistFactory.searchUserPlaylists($scope.user.id, $scope.musicSearchTerm, 50, 0)
                    .then(results => {
                        $scope.musicLoading = false;
                        $scope.offset = 50;
                        $scope.musicResults = results;
                    })
                    .catch(err => {
                        $scope.musicResults = false;
                        $scope.musicLoading = false;
                    });
            }
        }
    };

    // searches the next 50-count page playlists for the search term
    $scope.searchMorePlaylists = () => {
        SpotifyPlaylistFactory.searchUserPlaylists($scope.user.id, $scope.musicSearchTerm, 50, $scope.offset)
            .then(results => {
                $scope.offset += 50;
                // tags results onto the end of the existing results
                $scope.musicResults = $scope.musicResults.concat(Object.values(results));
            });
    };

    // select media and display info bigger
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

    // select music and display info bigger
    $scope.selectMusic = (id) => {
        if ($scope.activeMusic == "track") {
            SpotifyTrackFactory.getTrackById(id)
                .then(track => {
                    $scope.selectedMusic = SpotifyTrackFactory.parseApiInfo(track);
                });
        } else if ($scope.activeMusic == "playlist") {
            SpotifyPlaylistFactory.getPlaylistByIds($scope.user.id, id)
                .then(info => {
                    info.uid = $scope.user.id;
                    $scope.selectedMusic = SpotifyPlaylistFactory.parseApiInfo(info);
                });
        }
    };

    // save or submit mix
    $scope.submit = () => {
        // only if you've selected both music and media
        if ($scope.selectedMedia && $scope.selectedMusic) {
            let mediaTypeId = `${$scope.activeMedia}:${$scope.selectedMedia.id}`;
            let musicTypeId;

            // prepare musicTypeId
            if ($scope.activeMusic == "playlist") {
                musicTypeId = `playlist:${$scope.user.id}:${$scope.selectedMusic.id}`;
            } else {
                musicTypeId = `${$scope.activeMusic}:${$scope.selectedMusic.id}`;
            }
            if ($scope.tags == "" || $scope.tags == undefined) {
                $scope.tags = null;
            } else {
                $scope.tags = $scope.tags.split(",").map(string => string.trim());
            }

            // after music and media have both been stored
            Promise.all([
                FirebaseFactory.storeMusic(musicTypeId, $scope.selectedMusic),
                FirebaseFactory.storeMedia(mediaTypeId, $scope.selectedMedia)
            ])
                // create new link or patch link
                .then(response => {
                    if ($scope.context == "new") {
                        return LinkFactory.storeNewLink(mediaTypeId, musicTypeId, $scope.tags, $scope.user.id);
                    } else {
                        return LinkFactory.editLink($scope.key, mediaTypeId, musicTypeId, $scope.tags, $scope.user.id);
                    }
                })
                // success => redirect to media page
                .then(response => {
                    $window.location.href = `#!/${$scope.activeMedia}/${mediaTypeId.split(":")[1]}`;
                })
                // oh shit message
                .catch(err => {
                    Materialize.toast(err, 3000, "pink accent-2");
                });
        }
    };

    // jk
    $scope.cancel = () => {
        $window.history.back();
    };
});