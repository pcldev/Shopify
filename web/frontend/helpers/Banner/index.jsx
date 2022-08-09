import { Banner } from "@shopify/polaris";

const CustomBanner = (props) => {
  const { content, ...otherProps } = props;
  return (
    <div {...otherProps}>
      <Banner title="There is 1 error" status="critical">
        <li>{content}</li>
      </Banner>
    </div>
  );
};

export default CustomBanner;
