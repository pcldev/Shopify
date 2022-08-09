import { useCallback, useEffect, useRef, useState } from "react";

import { Page } from "../../apimodule/Page/index";
import HomePageComponent from "../../components/HomePageComponent";
import { RES_PER_PAGE } from "../../config";
import { useAuthenticatedFetch } from "../../hooks";

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

  const [selected, setSelected] = useState(0);
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLength, setPageLength] = useState(1);
  const [filterStatus, setFilterStatus] = useState(["newest"]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [modalActive, setModalActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");
  const [toastEror, setToastError] = useState(false);

  const [queryValue, setQueryValue] = useState("");
  const handleTabChange = (selectedTabIndex) => setSelected(selectedTabIndex);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await Page.getData(
        1,
        RES_PER_PAGE,
        queryValue,
        filterStatus,
        fetch
      );
      defaultItems = data.result.pageData;
      setItems(data.result.pageData);
      setPageLength(data.result.pageLength);
      setLoading(false);
    } catch (err) {
      setToastMessage(err.message);
      console.log(err);
    }
  }, []);

  const timer = useRef(null);
  useEffect(() => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(async () => {
      setLoading(true);
      const data = await Page.getData(
        1,
        RES_PER_PAGE,
        queryValue,
        filterStatus,
        fetch
      );
      setSelectedItems([]);
      setItems(data.result.pageData);
      setPageLength(data.result.pageLength);
      setCurrentPage(1);
      setLoading(false);
    }, 1000);
  }, [queryValue]);

  const handleFilterStatusChange = async (value) => {
    setFilterStatus(value);
    setLoading(true);
    try {
      const data = await Page.getData(
        1,
        RES_PER_PAGE,
        queryValue,
        value[0],
        fetch
      );
      setSelectedItems([]);
      setCurrentPage(1);
      setItems(data.result.pageData);
      setPageLength(data.result.pageLength);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setToastMessage(err.message);
    }
  };

  const handleChangeActiveModal = useCallback(
    () => setModalActive(!modalActive),
    [modalActive]
  );
  return (
    <HomePageComponent
      tabs={tabs}
      selected={selected}
      handleTabChange={handleTabChange}
      loading={loading}
      modalActive={modalActive}
      handleChangeActiveModal={handleChangeActiveModal}
      setModalActive={setModalActive}
      setLoading={setLoading}
      queryValue={queryValue}
      toastMessage={toastMessage}
      setToastMessage={setToastMessage}
      toastEror={toastEror}
      setToastError={setToastError}
      selectedItems={selectedItems}
      setSelectedItems={setSelectedItems}
      filterStatus={filterStatus}
      handleFilterStatusChange={handleFilterStatusChange}
      setFilterStatus={setFilterStatus}
      setQueryValue={setQueryValue}
      defaultItems={defaultItems}
      items={items}
      setItems={setItems}
      pageLength={pageLength}
      setPageLength={setPageLength}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      fetchData={fetchData}
    />
  );
}
