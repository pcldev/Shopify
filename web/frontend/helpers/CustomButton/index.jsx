import { useState, useRef, useEffect } from "react";

import { Card, ChoiceList, Icon } from "@shopify/polaris";
import { SortMinor } from "@shopify/polaris-icons";
import "./style.css";
const CustomButton = (props) => {
  const { filterStatus, handleFilterStatusChange } = props;
  const [showState, setShowState] = useState(false);
  const toggleRef = useRef(null);
  const onShowChoiceList = () => {
    setShowState(!showState);
  };

  const handleClickOutside = (event) => {
    if (toggleRef.current && !toggleRef.current.contains(event.target)) {
      setShowState(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);
  return (
    <div className="relative height-100" style={{ marginLeft: "10px" }}>
      <button
        className="btn relative height-100 overflow-hidden"
        onClick={onShowChoiceList}
      >
        <Icon source={SortMinor} color="base" />
        <span>Sort</span>
      </button>
      <div className="relative ">
        <div
          ref={toggleRef}
          className={`absolute zindex-99 card-transition  ${
            showState ? "active" : "nonactive"
          }`}
          style={{ width: "max-content", left: "-40px" }}
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
