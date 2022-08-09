import { Frame, Toast } from "@shopify/polaris";
import { useCallback, useState } from "react";
import "./style.css";
export function ToastExample(props) {
  const { message, error, setMessage } = props;

  const toggleActive = () => {
    setMessage("");
  };

  const toastMarkup =
    message.trim() !== "" ? (
      <Toast
        content={message}
        error={error ? true : false}
        onDismiss={toggleActive}
        duration={1500}
      />
    ) : null;

  return (
    <div style={{ height: "0px" }}>
      <Frame>{toastMarkup}</Frame>
    </div>
  );
}
