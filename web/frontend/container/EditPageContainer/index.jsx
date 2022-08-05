import {
  Button,
  Card,
  ChoiceList,
  Heading,
  Icon,
  Select,
  TextField,
} from "@shopify/polaris";
import { ArrowLeftMinor } from "@shopify/polaris-icons";
import { useCallback, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CustomEditor from "../../helpers/Editor";
import { ModalExample } from "../../helpers/Modal";
import { createMarkup } from "../../utils";

import { useAuthenticatedFetch } from "../../hooks";

const EditPageContainer = () => {
  const navigate = useNavigate();
  const params = useParams();
  console.log(params);
  const [title, setTitle] = useState("");
  const [editor, setEditor] = useState("");

  const [selected, setSelected] = useState(["hidden"]);
  const [active, setActive] = useState(false);

  const handleChangeActiveModal = useCallback(
    () => setActive(!active),
    [active]
  );
  const handleChange = useCallback((value) => setSelected(value), []);
  const handleTextFieldChange = useCallback((value) => setTitle(value), []);

  const handleSelectChange = useCallback((value) => setSelected(value), []);
  const [isLoading, setIsLoading] = useState(true);
  const fetch = useAuthenticatedFetch();

  const onSubmitHandler = async () => {
    if (params.id && params.id !== "id") {
      const response = await fetch(`/api/pages/${params.id}`, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          title: title,
          body_html: editor,
        }),
      });
      if (!response.ok) throw new Error("Cannot Create Page");
      navigate("/", { replace: true });
      const data = await response.json();
    } else {
      const response = await fetch("/api/pages", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          title: title,
          body_html: editor,
        }),
      });
      if (!response.ok) throw new Error("Cannot Create Page");

      navigate("/", { replace: true });
      const data = await response.json();
    }
  };

  const options = [
    { label: "Default Page", value: "default" },
    { label: "Contact", value: "contact" },
  ];

  const onGetPage = useCallback(async () => {
    if (!params.id) return;
    const response = await fetch(`/api/pages/${params.id}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const data = await response.json();
    setTitle(data.pageData.title || "");
    setEditor(data.pageData.body_html || "");
  }, []);

  useEffect(() => {
    onGetPage();
  }, [onGetPage]);

  return (
    <div style={{ padding: "2rem", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          padding: "1.25rem 0",
        }}
      >
        <Button
          onClick={() => {
            navigate("/");
          }}
        >
          <Icon source={ArrowLeftMinor} color="base" />
        </Button>

        <Heading>Add Page</Heading>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem" }}>
        <div className="col-1">
          <Card sectioned>
            <TextField
              value={title}
              onChange={handleTextFieldChange}
              label="Title"
              placeholder="e.g. Contact us, Sizing chart, FAQS"
              autoComplete="false"
            />
            <p style={{ marginTop: "10px" }}>Content</p>
            <CustomEditor editor={editor} setEditor={setEditor} />
          </Card>

          <Card
            sectioned
            title="Search engine listing preview"
            actions={[{ content: "Edit Page Web SEO" }]}
          >
            {title.trim() === "" && editor.trim() === "" && (
              <p>
                Add a title and description to see how this Page might appear in
                a search engine listing
              </p>
            )}

            {editor.trim() !== "" && title.trim() !== "" && (
              <div>
                <p style={{ color: "#1a0dab" }}>{title}</p>
                <p>https://phanconglong2906store.myshopify.com/pages/{title}</p>
                <div dangerouslySetInnerHTML={createMarkup(editor)}></div>
              </div>
            )}
          </Card>
        </div>
        <div className="col-2">
          <Card title="Visibility" sectioned>
            <ChoiceList
              title="Visibility"
              choices={[
                {
                  label: "Visible (as of 8/3/2022, 2:47 PM GMT+7)",
                  value: "visible",
                },
                { label: "Hidden", value: "hidden" },
              ]}
              selected={selected}
              onChange={handleChange}
            />
          </Card>
          <Card title="Online store" sectioned>
            <Select
              label="Default Page"
              options={options}
              onChange={handleSelectChange}
              value={selected}
            />
            <p style={{ padding: "1rem 0" }}>
              Assign a template from your current theme to define how the page
              is displayed.
            </p>
          </Card>
        </div>
      </div>
      <br />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "1.25rem 0",
        }}
      >
        <ModalExample active={active} handleChange={handleChangeActiveModal}>
          <Button onClick={handleChangeActiveModal}>Cancel</Button>
        </ModalExample>
        <Button primary onClick={onSubmitHandler}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default EditPageContainer;
