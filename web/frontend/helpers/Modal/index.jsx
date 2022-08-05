import { Button, Modal, TextContainer } from "@shopify/polaris";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export function ModalExample(props) {
  const navigate = useNavigate();
  const { active, handleChange } = props;
  return (
    <div>
      <Modal
        activator={props.children}
        open={active}
        onClose={handleChange}
        title="You have unsaved changes"
        primaryAction={{
          content: "Leave Page",
          onAction: () => {
            navigate("/");
          },
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: handleChange,
          },
        ]}
      >
        <Modal.Section>
          <TextContainer>
            <p>If you leave this page, all unsaved changes will be lost.</p>
          </TextContainer>
        </Modal.Section>
      </Modal>
    </div>
  );
}
