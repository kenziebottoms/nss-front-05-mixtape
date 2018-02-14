"use strict";

const angular = require("angular");
const ngRoute = require("angular-route");

let myApp = angular.module("mixtape", [ngRoute]);

require("./router.js");
require("./constants.js");

require("./ctrl/menu");
require("./ctrl/user");
require("./ctrl/home");
require("./ctrl/search");
require("./ctrl/profile");
require("./ctrl/media/media");
require("./ctrl/media/movie");
require("./ctrl/media/tv");
require("./ctrl/media/book");
require("./ctrl/music/music");
require("./ctrl/music/track");
require("./ctrl/music/playlist");
require("./ctrl/mix");
require("./ctrl/linkCard");

require("./factory/spotify/auth");
require("./factory/spotify/track");
require("./factory/spotify/playlist");
require("./factory/vote");
require("./factory/firebase");
require("./factory/link");
require("./factory/tmdb");
require("./factory/goodreads");