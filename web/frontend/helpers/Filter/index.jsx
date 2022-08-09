import {
  Avatar,
  Card,
  Filters,
  ResourceList,
  Spinner,
  TextStyle,
} from "@shopify/polaris";
import { useCallback, useEffect, useRef, useState } from "react";
import { deletePage, Page } from "../../apimodule/Page";
import { RES_PER_PAGE } from "../../config";
import CustomButton from "../CustomButton/index";
import Skeleton from "../Skeleton";
import { useAuthenticatedFetch } from "../../hooks";
import { calculateCreatedTime, createMarkup } from "../../utils";
function ResourceListFiltersExample(props) {
  const {
    items,
    filterStatus,
    setFilterStatus,
    selectedItems,
    setSelectedItems,
    setToastMessage,
    modalActive,
    setModalActive,
    loading,
    queryValue,
    setQueryValue,
    handleFilterStatusChange,
    fetchData,
  } = props;
  const fetch = useAuthenticatedFetch();
  const handleFiltersQueryChange = (value) => {
    setQueryValue(value);
  };

  const handleQueryValueRemove = useCallback(() => setQueryValue(""), []);
  const handleFiltersStatusRemove = useCallback(() => setFilterStatus(""), []);
  const handleFiltersClearAll = useCallback(() => {
    handleQueryValueRemove();
    handleFiltersStatusRemove();
  }, [handleQueryValueRemove, handleFiltersStatusRemove]);

  const filters = [];

  const bulkActions = [
    {
      content: "Delete Pages",
      onAction: async () => {
        setModalActive(true);
      },
    },
  ];
  return (
    <div>
      <Card>
        {!loading ? (
          <ResourceList
            resourceName={{ singular: "pages", plural: "pages" }}
            filterControl={
              <div>
                <>
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
                </>
              </div>
            }
            selectedItems={selectedItems}
            onSelectionChange={setSelectedItems}
            bulkActions={bulkActions}
            items={items}
            renderItem={(item) => {
              if (!item.id) return;
              const { id, author, title, body_html, updated_at } = item;
              const media = <Avatar customer size="medium" name={author} />;
              return (
                <>
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
                          <TextStyle variation="strong">{title}</TextStyle>
                        </h3>
                        <div
                          dangerouslySetInnerHTML={createMarkup(body_html)}
                        ></div>
                        <p>{calculateCreatedTime(new Date(updated_at))}</p>
                      </div>
                    </div>
                  </ResourceList.Item>
                </>
              );
            }}
          />
        ) : (
          <p style={{ textAlign: "center", padding: "200px" }}>
            <Spinner accessibilityLabel="Spinner example" size="large" />
          </p>
        )}
      </Card>
    </div>
  );
}

export default ResourceListFiltersExample;
