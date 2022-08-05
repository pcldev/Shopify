import { ResourceList } from "@shopify/polaris";
import { Avatar } from "@shopify/polaris";
import { TextStyle } from "@shopify/polaris";

const Item = (props) => {
  const { id, author, title, updated_at } = props.item;
  const media = <Avatar customer size="medium" name={author} />;

  return (
    <ResourceList.Item
      url={`/editPage/${id}`}
      id={id}
      media={media}
      accessibilityLabel={`View details for ${author}`}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <h3>
            <TextStyle variation="strong">{author || "Shopify"}</TextStyle>
          </h3>
          <div>{title}</div>
          <p>{new Date(updated_at).toISOString().substring(0, 10)}</p>
        </div>
      </div>
    </ResourceList.Item>
  );
};

export default Item;
