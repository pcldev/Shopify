import { Button, Card, Heading, Tabs } from "@shopify/polaris";
import ResourceListFiltersExample from "../../commons/Filter/index";
import CustomPagination from "../../helpers/Pagination";
import { useNavigate } from "react-router-dom";
const HomePageComponent = (props) => {
  const navigate = useNavigate();
  const { tabs, selected, handleTabChange, ...otherProps } = props;
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
      <Card>
        <div>
          <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
            <ResourceListFiltersExample {...otherProps} />
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
