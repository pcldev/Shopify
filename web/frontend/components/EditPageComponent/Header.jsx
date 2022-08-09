import { Button, Heading, Icon } from "@shopify/polaris";
import { ArrowLeftMinor } from "@shopify/polaris-icons";
import { useNavigate } from "react-router-dom";
const Header = (props) => {
  const {
    onDeletePage,
    typeEditor,
    active,
    handleChangeActiveModal,
    onHandleChangeModal,
    title,
  } = props;
  const navigate = useNavigate();
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "1rem",
        alignItems: "center",
        padding: "1.25rem 0",
      }}
    >
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <Button
          onClick={() => {
            navigate("/");
          }}
        >
          <Icon source={ArrowLeftMinor} color="base" />
        </Button>

        <Heading>Add Page</Heading>
      </div>
      <div style={{ color: "#bf0711" }}>
        {typeEditor && (
          <div>
            <Button
              onClick={onHandleChangeModal.bind(
                null,
                "Delete Page",
                onDeletePage,
                "Delete Page",
                `Delete “${title}”? This can't be undone.`
              )}
              monochrome
              outline
            >
              Delete
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
