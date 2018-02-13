# Mixify

Mixify is a platform on which to share playlists inspired by works of fiction and the individual tracks thereof.

## Run locally

```bash
git clone git@github.com:kenziebottoms/nss-front-capstone-mixify.git
cd nss-front-capstone-mixify
npm install
grunt
```

## Goals

- [x] User can add tracks (songs) and existing Spotify playlists to pieces of media (books, movies, TV shows) and tag them.
- [x] User can up- or downvote other people’s media-music links.
- [x] User can select a track and view pieces of media commonly linked to it.
- [x] User can select a movie, TV show, or book and view pieces of music commonly linked to it.

### Stretch Goals
- [ ] User can play song or playlist from the web app.
- [ ] User can view song lyrics for individual tracks.
- [ ] User receives notifications when others vote on their mixes or follow them.
- [ ] User can subscribe to media and other users, causing relevant activity to populate their activity feed.

## Resources

- [MindMeister mind map](https://mm.tt/994144307?t=3TqRJrEdLy)
- [Angular $controller inheritance](https://stackoverflow.com/questions/18461263/can-an-angularjs-controller-inherit-from-another-controller-in-the-same-module)

### APIs

- Firebase
  - [Retrieving data by REST API](https://firebase.google.com/docs/database/rest/retrieve-data)
- Spotify
  - [API docs](https://developer.spotify.com/web-api/)
  - [Endpoint reference](https://developer.spotify.com/web-api/endpoint-reference/)
  - [Spotify for Developers](https://beta.developer.spotify.com/dashboard/applications)
  - [Interactive API console](https://developer.spotify.com/web-api/console/)
- The Movie Database
  - [API docs](https://developers.themoviedb.org/3)
  - [Movie endpoints](https://developers.themoviedb.org/3/movies/get-movie-details)
  - [TV show endpoints](https://developers.themoviedb.org/3/tv/get-tv-details)
  - [Your API key](https://www.themoviedb.org/settings/api)
- Goodreads
  - [API docs](https://www.goodreads.com/api)
  - [Goodreads proxy server](https://github.com/kenziebottoms/goodreads-proxy-server), Kenzie Bottoms
- [Musixmatch](https://developer.musixmatch.com/)
  - [API docs](https://developer.musixmatch.com/documentation)