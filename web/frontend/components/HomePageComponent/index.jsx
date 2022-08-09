import { Button, Card, Heading, Tabs } from "@shopify/polaris";
import ResourceListFiltersExample from "../../helpers/Filter";
import CustomPagination from "../../helpers/Pagination";
import { useNavigate } from "react-router-dom";
import { ToastExample } from "../../helpers/Toast";
import { ModalExample } from "../../helpers/Modal";
import { useAuthenticatedFetch } from "../../hooks";
import { Page } from "../../apimodule/Page";
const HomePageComponent = (props) => {
  const navigate = useNavigate();
  const {
    tabs,
    selected,
    handleTabChange,
    toastMessage,
    toastError,
    setToastMessage,
    modalActive,
    setModalActive,
    handleChangeActiveModal,
    ...otherProps
  } = props;
  const fetch = useAuthenticatedFetch();

  const onDeletePageHandle = async () => {
    try {
      await Promise.all(
        props.selectedItems.map(
          async (selectedItem) => await Page.deletePage(selectedItem, fetch)
        )
      );
      props.setSelectedItems([]);
      setToastMessage("Delete Selected Items Successfully");
      handleChangeActiveModal();
      await props.fetchData();
    } catch (err) {
      console.log(err.message);
      setToastMessage("Cannot Delete Selected Items");
      handleChangeActiveModal();
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <ToastExample
        message={toastMessage}
        error={toastError}
        setMessage={setToastMessage}
      />
      <ModalExample
        title={`Delete ${props.selectedItems.length} pages`}
        action={onDeletePageHandle}
        active={modalActive}
        handleChange={handleChangeActiveModal}
        destructiveContent={`Delete ${props.selectedItems.length} pages`}
        description="Deleted pages cannot be recovered. Do you still want to continue?"
      />

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
      <Card>
        <div>
          <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
            <ResourceListFiltersExample
              setToastMessage={setToastMessage}
              modalActive={modalActive}
              setModalActive={setModalActive}
              {...otherProps}
            />
          </Tabs>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "20px",
            }}
          >
            <CustomPagination {...otherProps} />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default HomePageComponent;
