"use strict";

const angular = require("angular");
const ngRoute = require("angular-route");

let myApp = angular.module("mixtape", [ngRoute]);

require("./router.js");
require("./constants.js");
require("./directives.js");

require("./ctrl/menu");
require("./ctrl/user");
require("./ctrl/home");
require("./ctrl/profile");
require("./ctrl/mix");
require("./ctrl/favorites");
require("./ctrl/linkCard");
require("./ctrl/media/media");
require("./ctrl/media/movie");
require("./ctrl/media/tv");
require("./ctrl/media/book");
require("./ctrl/music/music");
require("./ctrl/music/track");
require("./ctrl/music/playlist");

require("./factory/spotify/auth");
require("./factory/spotify/track");
require("./factory/spotify/playlist");
require("./factory/spotify/playback");
require("./factory/vote");
require("./factory/link");
require("./factory/subscription");
require("./factory/firebase");
require("./factory/tmdb");
require("./factory/goodreads");
require("./factory/musixmatch");