"use strict";

const angular = require("angular");

angular.module("mixtape").controller("LinkCtrl", function ($scope, GoodreadsFactory, TmdbFactory, SpotifyAuthFactory, $location, TMDB, SpotifyTrackFactory, FirebaseFactory, LinkFactory, $window, $routeParams, SpotifyPlaylistFactory) {

    // get active user
    SpotifyAuthFactory.getActiveUserData()
        .then(data => {
            $scope.user = data;
            $scope.key = $routeParams.id;
            // if it's an edit page
            if ($scope.key) {
                $scope.context = "edit";
                // grab the link
                LinkFactory.getLinkByKey($scope.key)
                    .then(link => {
                        // if user didn't create the link
                        if ($scope.user.id != link.uid) {
                            $location.path("/");
                        } else {
                            // populate page with existing link's contents
                            $scope.activeMedia = link.media.split(":")[0];
                            $scope.activeMusic = link.music.split(":")[0];
                            if (link.tags) {
                                $scope.tags = link.tags.join(", ");
                            } else {
                                $scope.tags = "";
                            }
                            FirebaseFactory.getMediaByTypeId(link.media)
                                .then(media => {
                                    $scope.selectedMedia = media;
                                });
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

    // takes the search term and the search medium and displays 5 results
    $scope.searchMedia = () => {
        if ($scope.mediaSearchTerm != "" && $scope.activeMedia) {
            $scope.results = {};
            if ($scope.activeMedia == "book") {
                GoodreadsFactory.searchByTitle($scope.mediaSearchTerm)
                    .then(results => {
                        $scope.mediaResults = results.results.work.slice(0, 5);
                    });
            } else if ($scope.activeMedia == "tv") {
                $scope.image_prefix = TMDB.small_image_prefix;
                TmdbFactory.searchTvShowsByTitle($scope.mediaSearchTerm)
                    .then(results => {
                        $scope.mediaResults = results.results.slice(0, 5);
                    });
            } else if ($scope.activeMedia == "movie") {
                $scope.image_prefix = TMDB.small_image_prefix;
                TmdbFactory.searchMoviesByTitle($scope.mediaSearchTerm)
                    .then(results => {
                        $scope.mediaResults = results.results.slice(0, 5);
                    });
            }
        }
    };

    // takes the search term and the search medium and displays 5 results
    $scope.searchMusic = () => {
        if ($scope.searchMusicTerm != "" && $scope.activeMusic) {
            if ($scope.activeMusic == "track") {
                SpotifyTrackFactory.searchTracksByTitle($scope.musicSearchTerm)
                    .then(results => {
                        $scope.musicResults = results.slice(0, 5);
                    });
            } else {
                SpotifyPlaylistFactory.searchUserPlaylists($scope.user.id, $scope.musicSearchTerm, 50, 0)
                    .then(results => {
                        $scope.musicResults = results;
                        $scope.offset = 50;
                    });
            }
        }
    };

    // searches the next batch of 50 playlists for the search term
    $scope.searchMorePlaylists = () => {
        SpotifyPlaylistFactory.searchUserPlaylists($scope.user.id, $scope.musicSearchTerm, 50, $scope.offset)
            .then(results => {
                $scope.offset += 50;
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

    // submit mix
    $scope.submit = () => {
        // if you've picked music and media
        if ($scope.selectedMedia && $scope.selectedMusic) {
            let mediaTypeId = `${$scope.activeMedia}:${$scope.selectedMedia.id}`;
            let musicTypeId = `${$scope.activeMusic}:${$scope.selectedMusic.id}`;
            let promises = [];
            // store the media by itself
            promises.push(FirebaseFactory.storeMedia(mediaTypeId, $scope.selectedMedia));
            if (musicTypeId.split(":")[0] == "playlist") {
                musicTypeId = `${$scope.user.id}:${musicTypeId.split(":")[1]}`;
            }
            if ($scope.activeMusic == "playlist") {
                musicTypeId = `playlist:${musicTypeId}`;
            }
            // store music by itself
            promises.push(FirebaseFactory.storeMusic(musicTypeId, $scope.selectedMusic));

            // after music and media have been stored
            Promise.all(promises)
                .then(response => {
                    if ($scope.context == "new") {
                        // create new link
                        return LinkFactory.storeNewLink(mediaTypeId, musicTypeId, $scope.tags.trim().split(","), $scope.user.id);
                        // patch existing link
                    } else {
                        return LinkFactory.editLink($scope.key, mediaTypeId, musicTypeId, $scope.tags.trim().split(","), $scope.user.id);
                    }
                })
                // success => redirect ot media page
                .then(response => {
                    $window.location.href = `#!/${$scope.activeMedia}/${mediaTypeId.split(":")[1]}`;
                })
                // oh shit message
                .catch(err => {
                    Materialize.toast(err, 3000, "pink accent-2");
                });
        }
    };

    $scope.cancel = () => {
        $window.history.back();
    };
});