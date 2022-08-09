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

export const calculateCreatedTime = (timeCreated) => {
  let periods = {
    year: 365 * 30 * 24 * 60 * 60 * 1000,
    month: 30 * 24 * 60 * 60 * 1000,
    week: 7 * 24 * 60 * 60 * 1000,
    day: 24 * 60 * 60 * 1000,
    hour: 60 * 60 * 1000,
    minute: 60 * 1000,
  };
  let diff = Date.now() - timeCreated;

  for (const key in periods) {
    if (diff >= periods[key]) {
      let result = Math.floor(diff / periods[key]);
      return `${result} ${result === 1 ? key : key + "s"} ago`;
    }
  }

  return "Just now";
};
