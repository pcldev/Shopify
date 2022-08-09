import { Modal, TextContainer } from "@shopify/polaris";

export function ModalExample(props) {
  const {
    active,
    action,
    handleChange,
    title,
    destructiveContent,
    description,
  } = props;
  return (
    <div>
      <Modal
        activator={props.children}
        open={active}
        onClose={handleChange}
        title={title}
        primaryAction={{
          destructive: true,
          content: destructiveContent,
          onAction: () => {
            action();
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
            <p>{description}</p>
          </TextContainer>
        </Modal.Section>
      </Modal>
    </div>
  );
}
