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
require("./ctrl/movie");
require("./ctrl/tv");
require("./ctrl/book");
require("./ctrl/link");
require("./ctrl/track");

require("./factory/spotify/auth");
require("./factory/spotify/track");
require("./factory/firebase");
require("./factory/link");
require("./factory/tmdb");
require("./factory/goodreads");