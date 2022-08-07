import { useCallback, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Page } from "../../apimodule/Page";
import EditPageComponent from "../../components/EditPageComponent";

import { useAuthenticatedFetch } from "../../hooks";

const EditPageContainer = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [title, setTitle] = useState("");
  const [editor, setEditor] = useState("");
  const [typeEditor, setTypeEditor] = useState(false);
  const [data, setData] = useState({});
  const [selected, setSelected] = useState(["hidden"]);
  const [active, setActive] = useState(false);

  const handleChangeActiveModal = useCallback(
    () => setActive(!active),
    [active]
  );
  const handleChange = useCallback((value) => setSelected(value), []);
  const handleTextFieldChange = useCallback((value) => setTitle(value), []);

  const handleSelectChange = useCallback((value) => setSelected(value), []);
  const fetch = useAuthenticatedFetch();

  const onSubmitHandler = async () => {
    if (params.id && params.id !== "id") {
      setTypeEditor(true);
      const data = await Page.updatePage(params.id, title, editor, fetch);
      setTypeEditor(false);
      navigate("/", { replace: true });
      setData(data.pageData);
    } else {
      const data = await Page.createPage(title, editor, fetch);
      navigate("/", { replace: true });
    }
  };

  const options = [
    { label: "Default Page", value: "default" },
    { label: "Contact", value: "contact" },
  ];

  const onGetPage = useCallback(async () => {
    if (!params.id || params.id === "id") return;
    const data = await Page.getPageDataId(params.id, fetch);
    setTitle(data.pageData.title || "");
    setEditor(data.pageData.body_html || "");
  }, []);

  useEffect(() => {
    onGetPage();
  }, [onGetPage]);

  const onDeletePage = useCallback(async () => {
    const response = await fetch(`/api/pages/${params.id}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    if (!response.ok) throw new Error("Cannot Delete Page");

    navigate("/", { replace: true });
  }, []);

  return (
    <EditPageComponent
      active={active}
      title={title}
      editor={editor}
      typeEditor={typeEditor}
      setEditor={setEditor}
      selected={selected}
      options={options}
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
