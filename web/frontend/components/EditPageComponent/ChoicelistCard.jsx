import { Card, ChoiceList } from "@shopify/polaris";
const ChoicelistCard = (props) => {
  const { selected, handleChange } = props;
  return (
    <div className="col-2">
      <Card title="Visibility" sectioned>
        <ChoiceList
          title="Visibility"
          choices={[
            {
              label: "Visible (as of 8/3/2022, 2:47 PM GMT+7)",
              value: "visible",
            },
            { label: "Hidden", value: "hidden" },
          ]}
          selected={selected}
          onChange={handleChange}
        />
      </Card>
    </div>
  );
};

export default ChoicelistCard;
