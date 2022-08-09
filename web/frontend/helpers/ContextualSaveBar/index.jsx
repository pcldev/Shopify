import { Frame, ContextualSaveBar } from "@shopify/polaris";
import { useNavigate } from "react-router-dom";
const ContextTualSaveBar = (props) => {
  const { onClick, title, editor } = props;
  const navigate = useNavigate();
  return (
    <div style={{ height: "100px" }}>
      <Frame
        logo={{
          width: 124,
          contextualSaveBarSource:
            "https://cdn.shopify.com/s/files/1/0446/6937/files/jaded-pixel-logo-gray.svg?6215648040070010999",
        }}
      >
        <ContextualSaveBar
          alignContentFlush
          message="Unsaved changes"
          saveAction={{
            disabled: title.trim() === "" && editor.trim() === "",
            onAction: () => onClick(),
          }}
          discardAction={{
            onAction: () => navigate("/"),
          }}
        />
      </Frame>
    </div>
  );
};

export default ContextTualSaveBar;
