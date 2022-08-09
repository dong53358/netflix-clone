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

  vote_average: number;
}

export interface IGetDetailMovies {
  backdrop_path: string;
  poster_path: string;
  genres: [id: number, name: string];
  id: string;
  title: string;
  overview: string;
  runtime: number;
}

export interface IGetVideosResult {
  id: number;
  results: IVideo[];
}

export interface IVideo {
  key: string;
  name: string;
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
