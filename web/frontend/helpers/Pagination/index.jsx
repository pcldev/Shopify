import { Pagination } from "@shopify/polaris";
import { Page } from "../../api/Page";
import { RES_PER_PAGE } from "../../config";
import { useAuthenticatedFetch } from "../../hooks";
const CustomPagination = (props) => {
  const fetch = useAuthenticatedFetch();
  const { defaultItems, items, setItems, currentPage, setCurrentPage } = props;

  const onPreviousHandle = async () => {
    const page = currentPage - 1;
    const data = await Page.getData(page, RES_PER_PAGE, queryValue);
    setItems(data.pageData);
    setCurrentPage(currentPage - 1);
  };
  const onNextHandle = async () => {
    const page = currentPage + 1;
    const data = await Page.getData(page, RES_PER_PAGE, queryValue);
    setItems(data.pageData);
    setCurrentPage(currentPage + 1);
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
