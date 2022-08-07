import {
  Avatar,
  Card,
  Filters,
  ResourceList,
  TextStyle,
} from "@shopify/polaris";
import { useCallback, useEffect, useRef } from "react";
import { Page } from "../../apimodule/Page";
import { RES_PER_PAGE } from "../../config";
import CustomButton from "../../helpers/CustomButton/index";
import Skeleton from "../../helpers/Skeleton";
import { useAuthenticatedFetch } from "../../hooks";
function ResourceListFiltersExample(props) {
  const {
    items,
    setItems,
    filterStatus,
    setFilterStatus,
    defaultItems,
    loading,
    setLoading,
    currentPage,
    setCurrentPage,
    queryValue,
    setQueryValue,
    handleFilterStatusChange,
  } = props;
  const fetch = useAuthenticatedFetch();
  const handleFiltersQueryChange = (value) => {
    setQueryValue(value);
  };

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
      setLoading(true);
      const data = await Page.getData(
        1,
        RES_PER_PAGE,
        queryValue,
        filterStatus,
        fetch
      );
      setItems(data.pageData);
      setCurrentPage(1);
      setLoading(false);
    }, 1000);
  }, [queryValue]);

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
              <div>
                {!loading ? (
                  <ResourceList.Item
                    url={`/editPage/${id}`}
                    id={id}
                    media={media}
                    accessibilityLabel={`View details for ${author}`}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <h3>
                          <TextStyle variation="strong">
                            {author || "Shopify"}
                          </TextStyle>
                        </h3>
                        <div>{title}</div>
                        <p>
                          {new Date(updated_at).toISOString().substring(0, 10)}
                        </p>
                      </div>
                    </div>
                  </ResourceList.Item>
                ) : (
                  <Skeleton />
                )}
              </div>
            );
          }}
        />
      </Card>
    </div>
  );
}

export default ResourceListFiltersExample;
