import { Button, Card, Heading, Tabs } from "@shopify/polaris";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ResourceListFiltersExample from "../../commons/Filter/index";
import CustomPagination from "../../helpers/Pagination";
import { RES_PER_PAGE } from "../../config";
import { useAuthenticatedFetch } from "../../hooks";
import { Page } from "../../apimodule/Page/index";
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

  const [queryValue, setQueryValue] = useState("");
  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    []
  );
  console.log("rat toang");
  const fetchData = useCallback(async () => {
    console.log("yaui");
    const data = await Page.getData(1, RES_PER_PAGE, queryValue, fetch);
    const responseitem = data.pageData.sort((a, b) => {
      return new Date(a.updated_at) - new Date(b.updated_at);
    });
    defaultItems = responseitem;
    console.log("huhu");
    setItems(responseitem);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Heading>Pages</Heading>
        <Button
          onClick={() => {
            navigate("/editPage/id");
          }}
          primary
        >
          Add Page
        </Button>
      </div>
      <br />
      {items && (
        <Card>
          <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
            <ResourceListFiltersExample
              queryValue={queryValue}
              setQueryValue={setQueryValue}
              defaultItems={defaultItems}
              items={items}
              setItems={setItems}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </Tabs>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "20px",
            }}
          >
            <CustomPagination
              queryValue={queryValue}
              defaultItems={defaultItems}
              items={items}
              setItems={setItems}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </Card>
      )}
    </div>
  );
}
