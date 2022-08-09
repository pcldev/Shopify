import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Page } from "../../apimodule/Page";
import EditPageComponent from "../../components/EditPageComponent";

import { useAuthenticatedFetch } from "../../hooks";

const EditPageContainer = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [title, setTitle] = useState("");
  const [isValid, setIsValid] = useState(true);

  const [editor, setEditor] = useState("");
  const [typeEditor, setTypeEditor] = useState(false);
  const [data, setData] = useState({});
  const [selected, setSelected] = useState(["hidden"]);
  const [active, setActive] = useState(false);

  const [toastMessage, setToastMessage] = useState("");
  const [toastError, setToastError] = useState(false);
  const fetch = useAuthenticatedFetch();

  const handleChangeActiveModal = useCallback(
    () => setActive(!active),
    [active]
  );
  const handleChange = useCallback((value) => setSelected(value), []);
  const handleTextFieldChange = useCallback((value) => {
    if (value.trim() !== "") {
      setIsValid(true);
    }
    setTitle(value);
  }, []);

  const handleSelectChange = useCallback((value) => setSelected(value), []);

  const onSubmitHandler = async () => {
    if (title.trim() === "") {
      setIsValid(false);
      return;
    }
    if (params.id && params.id !== "id") {
      setTypeEditor(true);
      try {
        const data = await Page.updatePage(params.id, title, editor, fetch);
        setTypeEditor(false);

        setData(data.pageData);

        setToastMessage("Update page successfully");
        setToastError(false);

        setTimeout(() => {
          navigate("/", { replace: true });
        }, 2000);
      } catch (err) {
        setToastMessage(err.message);
        setToastError(true);
        console.log(err.message);
      }
    } else {
      try {
        const data = await Page.createPage(title, editor, fetch);
        setToastMessage("Create page successfully");
        setToastError(false);
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 2000);
      } catch (err) {
        setToastMessage(err.message);
        setToastError(true);
        console.log(err.message);
      }
    }
  };

  const options = [
    { label: "Default Page", value: "default" },
    { label: "Contact", value: "contact" },
  ];

  const onGetPage = useCallback(async () => {
    if (!params.id || params.id === "id") return;
    setTypeEditor(true);
    try {
      const data = await Page.getPageDataId(params.id, fetch);
      setTitle(data.pageData.title || "");
      setEditor(data.pageData.body_html || "");

      setToastError(false);
    } catch (err) {
      setToastMessage("Something went wrong");
      setToastError(true);
      console.log(err.message);
    }
  }, []);

  useEffect(() => {
    onGetPage();
  }, [onGetPage]);

  const onDeletePage = useCallback(async () => {
    try {
      await Page.deletePage(params.id, fetch);
      setToastMessage("Delete Page Successfully");
      setToastError(false);
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 2000);
    } catch (err) {
      setToastMessage("Cannot Delete Page");
      setToastError(true);
      console.log(err.message);
    }
  }, []);

  return (
    <EditPageComponent
      active={active}
      title={title}
      isValid={isValid}
      setIsValid={setIsValid}
      editor={editor}
      typeEditor={typeEditor}
      setEditor={setEditor}
      selected={selected}
      options={options}
      toastMessage={toastMessage}
      setToastMessage={setToastMessage}
      toastError={toastError}
      handleSelectChange={handleSelectChange}
      handleChange={handleChange}
      handleTextFieldChange={handleTextFieldChange}
      onDeletePage={onDeletePage}
      onSubmitHandler={onSubmitHandler}
      handleChangeActiveModal={handleChangeActiveModal}
    />
  );
};

export default EditPageContainer;
