import { Card, Filters, ResourceList } from "@shopify/polaris";
import { useCallback, useEffect, useRef, useState } from "react";
import CustomButton from "../../helpers/CustomButton/index";
import Item from "./Item";
import { Avatar, TextStyle } from "@shopify/polaris";
import CustomPagination from "../../helpers/Pagination";
import { Page } from "../../apimodule/Page";
import { RES_PER_PAGE } from "../../config";
import { useAuthenticatedFetch } from "../../hooks";
function ResourceListFiltersExample(props) {
  const {
    items,
    setItems,
    defaultItems,
    currentPage,
    setCurrentPage,
    queryValue,
    setQueryValue,
  } = props;
  const fetch = useAuthenticatedFetch();
  // const [queryValue, setQueryValue] = useState("");
  const [filterStatus, setFilterStatus] = useState(["newest"]);
  const newItems = items.slice(0, 5);

  const handleFiltersQueryChange = (value) => {
    setQueryValue(value);
  };

  const handleFilterStatusChange = useCallback((value) => {
    setFilterStatus(value);
  }, []);

  const timer = useRef(null);
  useEffect(() => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    if (queryValue.trim() === "") {
      setItems(defaultItems);
      return;
    }
    timer.current = setTimeout(async () => {
      const data = await Page.getData(1, RES_PER_PAGE, queryValue, fetch);
      setItems(data.pageData);
      setCurrentPage(1);
    }, 1000);
  }, [queryValue]);

  useEffect(() => {
    let newItems = items;
    if (filterStatus[0] === "newest") {
      newItems = items.sort((a, b) => {
        return new Date(a.updated_at) - new Date(b.updated_at);
      });
    } else if (filterStatus[0] === "oldest") {
      newItems = items.sort((a, b) => {
        return new Date(b.updated_at) - new Date(a.updated_at);
      });
    } else if (filterStatus[0] === "az") {
      newItems = items.sort((a, b) => {
        return a.title.localeCompare(b.title);
      });
    } else if (filterStatus[0] === "za") {
      newItems = items.sort((a, b) => {
        return b.title.localeCompare(a.title);
      });
    }
    setItems(newItems);
  }, [filterStatus]);

  const handleQueryValueRemove = useCallback(() => setQueryValue(""), []);
  const handleFiltersStatusRemove = useCallback(() => setFilterStatus(""), []);
  const handleFiltersClearAll = useCallback(() => {
    handleQueryValueRemove();
    handleFiltersStatusRemove();
  }, [handleQueryValueRemove, handleFiltersStatusRemove]);

  const filters = [];

  return (
    <div>
      <Card>
        <ResourceList
          resourceName={{ singular: "pages", plural: "pages" }}
          filterControl={
            <div>
              <Filters
                queryValue={queryValue}
                filters={filters}
                onQueryChange={handleFiltersQueryChange}
                onQueryClear={handleQueryValueRemove}
                onClearAll={handleFiltersClearAll}
              >
                <CustomButton
                  filterStatus={filterStatus}
                  handleFilterStatusChange={handleFilterStatusChange}
                />
              </Filters>
            </div>
          }
          items={items}
          renderItem={(item) => {
            const { id, author, title, updated_at } = item;
            const media = <Avatar customer size="medium" name={author} />;

            return (
              <ResourceList.Item
                url={`/editPage/${id}`}
                id={id}
                media={media}
                accessibilityLabel={`View details for ${author}`}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div>
                    <h3>
                      <TextStyle variation="strong">
                        {author || "Shopify"}
                      </TextStyle>
                    </h3>
                    <div>{title}</div>
                    <p>{new Date(updated_at).toISOString().substring(0, 10)}</p>
                  </div>
                </div>
              </ResourceList.Item>
            );
          }}
        />
      </Card>
    </div>
  );
}

export default ResourceListFiltersExample;
