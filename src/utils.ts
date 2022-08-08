export function makeImagePath(id: string, format?: string) {
  return `https://image.tmdb.org/t/p/${format ? format : "original"}/${id}`;
}

export function makeImagePath2(id: string, format?: string) {
  return `https://image.tmdb.org/t/p/${format ? format : "original"}/${id}`;
}

export function makeTrailerPath(key?: string) {
  return `https://www.youtube.com/embed/${key}?showinfo=0&enablejsapi=1&origin=http://localhost:3000`; //localhost 제거
}
