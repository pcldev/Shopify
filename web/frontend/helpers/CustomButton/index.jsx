import { useState } from "react";

import { Button, Card, ChoiceList, Icon } from "@shopify/polaris";
import { SortMinor } from "@shopify/polaris-icons";
import "./style.css";
const CustomButton = (props) => {
  const { filterStatus, handleFilterStatusChange } = props;
  const [showState, setShowState] = useState(false);
  const onShowChoiceList = () => {
    setShowState(!showState);
  };
  return (
    <div className="relative ">
      <Button className="relative overflow-hidden" onClick={onShowChoiceList}>
        <Icon source={SortMinor} color="base" />
        <span>Sort</span>
      </Button>
      <div className="relative ">
        <div
          className={`absolute zindex-99 card-transition  ${
            showState ? "active" : "nonactive"
          }`}
        >
          <Card>
            <div style={{ padding: "10px" }}>
              <ChoiceList
                title="Visibility"
                titleHidden
                choices={[
                  { label: "Newest update", value: "newest" },
                  { label: "Oldest update", value: "oldest" },
                  { label: "Title A-Z", value: "az" },
                  { label: "Title Z-A", value: "za" },
                ]}
                selected={filterStatus || []}
                onChange={handleFilterStatusChange}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomButton;
