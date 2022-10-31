const API_KEY = process.env.REACT_APP_API_KEY;
const BASE_PATH = "https://api.themoviedb.org/3/";

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;

  vote_average: number;
}

export interface IGetDetailMovies {
  backdrop_path: string;
  poster_path: string;
  genres: IGenres[];
  id: string;
  title: string;
  overview: string;
  runtime: number;
  release_date: string;
}
export interface IGetDetailTvs {
  backdrop_path: string;
  poster_path: string;
  genres: IGenres[];
  id: string;
  name: string;
  overview: string;
  first_air_date: string;
  number_of_episodes: number;
  number_of_seasons: number;
}
export interface IGenres {
  id: number;
  name: string;
}

export interface IGetVideosResult {
  id: number;
  results: IVideo[];
  success: boolean;
}

export interface IVideo {
  key: string;
  name: string;
}

export interface IGetTvResult {
  page: number;
  results: ITv[];
  total_pages: number;
  total_results: number;
}

export interface ITv {
  backdrop_path: string;
  poster_path: string;
  first_air_date: string;
  id: number;
  name: string;
  overview: string;
  vote_average: number;
}

export interface ISearch {
  page: number;
  results: ISearchData[];
  known_for: ISearchData[];
  total_pages: number;
  total_results: number;
}

export interface ISearchData {
  backdrop_path: string;
  poster_path: string;
  id: number;
  name: string;
  title: string;
  overview: string;
  vote_average: number;
  media_type: string;
}

export interface ICast {
  id: number;
  cast: ICastIn[];
}

export interface ICastIn {
  id: number;
  name: string;
  profile_path: string;
  character: string;
  credit_id: string;
}

export function getMovies(kind: string) {
  return fetch(
    `${BASE_PATH}movie/${kind}?api_key=${API_KEY}&language=ko&page=1&region=kr`
  ).then((response) => response.json());
}

export function getMovieDetails(id: string) {
  return fetch(`${BASE_PATH}movie/${id}?api_key=${API_KEY}&language=ko`).then(
    (response) => response.json()
  );
}

//토르id : 616037
export function getMovieVedio(moiveId: string) {
  return fetch(
    `${BASE_PATH}movie/${moiveId}/videos?api_key=${API_KEY}&language=ko`
  ).then((response) => response.json());
}
export function getMovieVedio2(moiveId: string) {
  return fetch(`${BASE_PATH}movie/${moiveId}/videos?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getTvs(kind: string) {
  return fetch(`${BASE_PATH}tv/${kind}?api_key=${API_KEY}`).then((response) =>
    response.json()
  );
}

export function getTvDetails(id: string) {
  return fetch(`${BASE_PATH}tv/${id}?api_key=${API_KEY}&language=ko`).then(
    (response) => response.json()
  );
}
export function getTvVedio(tvId: string) {
  return fetch(`${BASE_PATH}tv/${tvId}/videos?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}
export function getTvVedio2(tvId: string) {
  return fetch(`${BASE_PATH}tv/${tvId}/videos?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function search(query: string) {
  return fetch(
    `${BASE_PATH}search/multi?api_key=${API_KEY}&query=${query}`
  ).then((response) => response.json());
}

export function castMovie(movieId: string) {
  return fetch(
    `${BASE_PATH}movie/${movieId}/credits?api_key=${API_KEY}&language=ko`
  ).then((response) => response.json());
}
export function castTv(tvId: string) {
  return fetch(
    `${BASE_PATH}tv/${tvId}/credits?api_key=${API_KEY}&language=ko`
  ).then((response) => response.json());
}
