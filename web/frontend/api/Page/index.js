import { useAuthenticatedFetch } from "../../hooks";
const fetch = useAuthenticatedFetch();
export const getData = async (page, limit, queryValue) => {
  console.log("hey");
  const response = await fetch(
    `/api/pages?` +
      new URLSearchParams({
        limit,
        page,
        queryValue,
      })
  );
  const data = await response.json();
  console.log(data);
  return data;
};

export const Page = {
  getData: getData,
};
