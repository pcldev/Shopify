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
  if (!response.ok) throw new Error("Something went wrong!");
  const data = await response.json();
  return data;
};

export const getPageDataId = async (id, fetch) => {
  try {
    const response = await fetch(`/api/pages/${id}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error("Something went wrong!");
    const data = await response.json();
    return data;
  } catch (err) {
    return err.message;
  }
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
  if (!response.ok) throw new Error("Couldn't update page");
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
  if (!response.ok) throw new Error("Cannot Create A Page");
  const data = await response.json();
  return data;
};

export const deletePage = async (id, fetch) => {
  const response = await fetch(`/api/pages/${id}`, {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  if (!response.ok) throw new Error("Cannot Delete Page");
};

export const Page = {
  getData,
  getPageDataId,
  updatePage,
  createPage,
  deletePage,
};
