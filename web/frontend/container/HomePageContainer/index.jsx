import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { RES_PER_PAGE } from "../../config";
import { useAuthenticatedFetch } from "../../hooks";
import { Page } from "../../apimodule/Page/index";
import HomePageComponent from "../../components/HomePageComponent";

const tabs = [
  {
    id: "all-customers-1",
    content: "All",
    accessibilityLabel: "All customers",
    panelID: "all-customers-content-1",
  },
];

let defaultItems = [];
export default function HomePageContainer() {
  const fetch = useAuthenticatedFetch();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(0);
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState(["newest"]);
  const [loading, setLoading] = useState(false);

  const [queryValue, setQueryValue] = useState("");
  const handleTabChange = (selectedTabIndex) => setSelected(selectedTabIndex);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const data = await Page.getData(
      1,
      RES_PER_PAGE,
      queryValue,
      filterStatus,
      fetch
    );
    const responseitem = data.pageData.sort((a, b) => {
      return new Date(a.updated_at) - new Date(b.updated_at);
    });
    defaultItems = responseitem;
    setItems(responseitem);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterStatusChange = async (value) => {
    setFilterStatus(value);
    setLoading(true);
    setCurrentPage(1);
    const response = await Page.getData(
      currentPage,
      RES_PER_PAGE,
      queryValue,
      value[0],
      fetch
    );
    const data = response.pageData;
    setItems(data);
    setLoading(false);
  };
  return (
    <HomePageComponent
      tabs={tabs}
      selected={selected}
      handleTabChange={handleTabChange}
      loading={loading}
      setLoading={setLoading}
      queryValue={queryValue}
      filterStatus={filterStatus}
      handleFilterStatusChange={handleFilterStatusChange}
      setFilterStatus={setFilterStatus}
      setQueryValue={setQueryValue}
      defaultItems={defaultItems}
      items={items}
      setItems={setItems}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
    />
  );
}
