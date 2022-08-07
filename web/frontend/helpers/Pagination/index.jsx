import { Pagination } from "@shopify/polaris";
import { Page } from "../../apimodule/Page/index";
import { RES_PER_PAGE } from "../../config";
import { useAuthenticatedFetch } from "../../hooks";
const CustomPagination = (props) => {
  const fetch = useAuthenticatedFetch();
  const {
    loading,
    setLoading,
    filterStatus,
    defaultItems,
    items,
    setItems,
    queryValue,
    currentPage,
    setCurrentPage,
  } = props;

  const onPreviousHandle = async () => {
    setLoading(true);
    const page = currentPage - 1;
    const data = await Page.getData(
      page,
      RES_PER_PAGE,
      queryValue,
      filterStatus,
      fetch
    );
    setItems(data.pageData);
    setCurrentPage(currentPage - 1);
    setLoading(false);
  };
  const onNextHandle = async () => {
    setLoading(true);
    const page = currentPage + 1;
    const data = await Page.getData(
      page,
      RES_PER_PAGE,
      queryValue,
      filterStatus,
      fetch
    );
    setItems(data.pageData);
    setCurrentPage(currentPage + 1);
    setLoading(false);
  };
  return (
    <div>
      <Pagination
        hasPrevious={currentPage > 1}
        onPrevious={onPreviousHandle}
        hasNext={currentPage <= +Math.ceil(items.length / RES_PER_PAGE) + 1}
        onNext={onNextHandle}
        label={currentPage}
      />
    </div>
  );
};

export default CustomPagination;
