const API_KEY = "5c5750bf608396f58f7a40244eee6470";
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
}

export interface IGetTopMovies {
  page: number;
  results: ITopMovies[];
  total_pages: number;
  total_results: number;
}

export interface ITopMovies {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

export interface IGetUpcomingMovies {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IUpcomingMovie[];
  total_pages: number;
  total_results: number;
}

interface IUpcomingMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

export interface IGetVideosResult {
  id: number;
  results: IVideo[];
}

export interface IVideo {
  key: string;
  name: string;
}

export function getNowPlayMovies() {
  return fetch(`${BASE_PATH}movie/now_playing?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getTopRateMovies() {
  return fetch(`${BASE_PATH}movie/top_rated?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getUpcomingMovies() {
  return fetch(`${BASE_PATH}movie/upcoming?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

//토르id : 616037
export function getMovieVedio(moiveId: string) {
  return fetch(`${BASE_PATH}movie/${moiveId}/videos?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}
