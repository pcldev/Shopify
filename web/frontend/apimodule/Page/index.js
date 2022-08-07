export const getData = async (page, limit, queryValue, sort, fetch) => {
  const response = await fetch(
    `/api/pages?` +
      new URLSearchParams({
        limit,
        page,
        queryValue,
        sort,
      })
  );
  const data = await response.json();
  return data;
};

export const getPageDataId = async (id, fetch) => {
  const response = await fetch(`api/pages/${id}`, {
    method: "get",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  const data = await response.json();
  return data;
};

export const updatePage = async (id, title, body_html, fetch) => {
  const response = await fetch(`/api/pages/${id}`, {
    method: "put",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ title, body_html }),
  });

  const data = await response.json();
  return data;
};

export const createPage = async (title, body_html, fetch) => {
  const response = await fetch(`/api/pages`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ title, body_html }),
  });
  const data = await response.json();
  return data;
};

export const Page = {
  getData,
  getPageDataId,
  updatePage,
  createPage,
};
