# Mixtape take 3

[MindMeister mind map](https://mm.tt/994144307?t=3TqRJrEdLy)

Experimentation with the Spotify, TMDb, and Goodreads ~~Google Books~~ APIs.

## Goals

### API Goals

- [x] Authenticate with Spotify.
  - [x] Fetch search results for songs through Spotify API.
    - [ ] Format results nicely.
- [ ] Fetch search results for movies through TMDb API.
  - [ ] Format results nicely.
- [ ] Fetch search results for TV shows through TMDb API.
  - [ ] Format results nicely.
- [ ] ~~Fetch search results for books through Google Books API.~~
  - [ ] ~~Format results nicely.~~
- [x] Set up proxy server on Heroku to access Goodreads API.
  - [ ] Fetch results for books through Goodreads API.
  - [ ] Format results nicely.

### Firebase

- [ ] Solidify database structure.
  - [ ] Media
    - [ ] Books
    - [x] TV Shows
    - [x] Movies
  - [ ] Music
    - [x] Tracks
    - [ ] Playlists
- [ ] Pull recently linked media from database.
  - [ ] Pull all linked media from database.
- [ ] Store Spotify user data in Firebase.
  - [ ] Store Spotify user token in Local Storage.
- [ ] Allow user to favorite music or media.
- [ ] Display information relevant to user's favorite music/media.

---

## Resources

### Firebase

- [Retrieving data by REST API](https://firebase.google.com/docs/database/rest/retrieve-data)

### Spotify

#### [API docs](https://developer.spotify.com/web-api/)

- [Endpoint reference](https://developer.spotify.com/web-api/endpoint-reference/)
- [Spotify for Developers](https://beta.developer.spotify.com/dashboard/applications)
- [Interactive API console](https://developer.spotify.com/web-api/console/)

### The Movie Db

#### [API docs](https://developers.themoviedb.org/3)

- [Movie endpoints](https://developers.themoviedb.org/3/movies/get-movie-details)
- [TV show endpoints](https://developers.themoviedb.org/3/tv/get-tv-details)
- [Your API key](https://www.themoviedb.org/settings/api)

### ~~Google Books~~

~~[API docs](https://developers.google.com/books/docs/v1/reference/)~~

- ~~[Getting started](https://developers.google.com/books/docs/v1/getting_started)~~
- ~~[In-depth book search](https://developers.google.com/books/docs/v1/reference/volumes/list)~~

### Goodreads

#### [API docs](https://www.goodreads.com/api)

- [Goodreads proxy server](https://github.com/kenziebottoms/goodreads-proxy-server), Kenzie Bottoms