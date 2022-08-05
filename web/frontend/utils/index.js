import { RES_PER_PAGE } from "../config";

export function createMarkup(text) {
  return { __html: text };
}

export function sortDate(array, type) {
  array.sort(function (a, b) {
    if (type === "newest") return new Date(b.date) - new Date(a.date);
    else if (type === "oldest") return new Date(b.date) + new Date(a.date);
  });
}

export function controlPaginate(arrays, pageGoTo) {
  const start = (pageGoTo - 1) * RES_PER_PAGE;
  const end = pageGoTo * RES_PER_PAGE;
  return arrays.slice(start, end);
}
