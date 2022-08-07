import { Card, TextContainer } from "@shopify/polaris";
import "./style.css";

const Skeleton = () => {
  return (
    <Card sectioned>
      <TextContainer>
        <div className="skeleton">
          <div className="user"></div>

          <div className="block-line">
            <div className="line"></div>
            <div className="line"></div>
          </div>
        </div>
      </TextContainer>
    </Card>
  );
};

export default Skeleton;
