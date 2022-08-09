import { Pagination } from "@shopify/polaris";
import { Page } from "../../apimodule/Page/index";
import { RES_PER_PAGE } from "../../config";
import { useAuthenticatedFetch } from "../../hooks";
const CustomPagination = (props) => {
  const fetch = useAuthenticatedFetch();
  const {
    setLoading,
    filterStatus,
    setItems,
    queryValue,
    currentPage,
    setCurrentPage,
    pageLength,
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
    setItems(data.result.pageData);
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
    setItems(data.result.pageData);
    setCurrentPage(currentPage + 1);
    setLoading(false);
  };
  return (
    <div>
      <Pagination
        hasPrevious={currentPage > 1}
        onPrevious={onPreviousHandle}
        hasNext={currentPage < pageLength}
        onNext={onNextHandle}
        label={currentPage}
      />
    </div>
  );
};

export default CustomPagination;
