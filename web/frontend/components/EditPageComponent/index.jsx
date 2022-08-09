import { Button } from "@shopify/polaris";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Banner from "../../helpers/Banner";
import ContextTualSaveBar from "../../helpers/ContextualSaveBar";
import { ModalExample } from "../../helpers/Modal";
import { ToastExample } from "../../helpers/Toast";
import ChoicelistCard from "./ChoicelistCard";
import FormCard from "./FormCard";
import Header from "./Header";
const EditPageComponent = (props) => {
  const {
    active,
    title,
    isValid,
    setIsValid,
    editor,
    setEditor,
    typeEditor,
    selected,
    options,
    toastMessage,
    setToastMessage,
    error,
    handleSelectChange,
    handleChange,
    handleTextFieldChange,
    onDeletePage,
    onSubmitHandler,
    handleChangeActiveModal,
  } = props;
  const navigate = useNavigate();
  const [modalState, setModalState] = useState({});
  const onHandleChangeModal = (
    title,
    action,
    destructiveContent,
    description
  ) => {
    handleChangeActiveModal();
    setModalState({
      title,
      action,
      description,
      destructiveContent,
    });
  };

  return (
    <div style={{ padding: "2rem", margin: "0 auto" }}>
      <ContextTualSaveBar
        onClick={onSubmitHandler}
        title={title}
        editor={editor}
      />
      <ToastExample
        message={toastMessage}
        error={error}
        setMessage={setToastMessage}
      />
      <ModalExample
        title={modalState.title}
        active={active}
        action={modalState.action}
        handleChange={handleChangeActiveModal}
        destructiveContent={modalState.destructiveContent}
        description={modalState.description}
      />
      <Header
        active={active}
        handleChange={handleChange}
        onDeletePage={onDeletePage}
        typeEditor={typeEditor}
        handleChangeActiveModal={handleChangeActiveModal}
        onHandleChangeModal={onHandleChangeModal}
        title={title}
      />
      {!isValid && (
        <Banner style={{ margin: "20px 0" }} content={"Title can't be blank"} />
      )}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1.25rem",
        }}
      >
        <FormCard
          title={title}
          editor={editor}
          setEditor={setEditor}
          isValid={isValid}
          handleTextFieldChange={handleTextFieldChange}
        />
        <ChoicelistCard selected={selected} handleChange={handleChange} />
      </div>
      <br />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "1.25rem 0",
        }}
      >
        <Button
          onClick={onHandleChangeModal.bind(
            null,
            "You have unsaved changes",
            () => {
              navigate("/");
            },
            "Leave Page",
            "You will loss your changes!"
          )}
        >
          Cancel
        </Button>

        <Button
          disabled={title.trim() === "" && editor.trim() === ""}
          form="formPage"
          submit={true}
          primary
          onClick={onSubmitHandler}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default EditPageComponent;
