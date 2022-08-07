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
import CustomEditor from "../../helpers/Editor";
import { ModalExample } from "../../helpers/Modal";
import { createMarkup } from "../../utils";
import { useNavigate, useParams } from "react-router-dom";
const EditPageComponent = (props) => {
  const {
    active,
    title,
    editor,
    setEditor,
    typeEditor,
    selected,
    options,
    handleSelectChange,
    handleChange,
    handleTextFieldChange,
    onDeletePage,
    onSubmitHandler,
    handleChangeActiveModal,
  } = props;
  const navigate = useNavigate();
  return (
    <div style={{ padding: "2rem", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          alignItems: "center",
          padding: "1.25rem 0",
        }}
      >
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <Button
            onClick={() => {
              navigate("/");
            }}
          >
            <Icon source={ArrowLeftMinor} color="base" />
          </Button>

          <Heading>Add Page</Heading>
        </div>
        <div style={{ color: "#bf0711" }}>
          {typeEditor && (
            <Button onClick={onDeletePage} monochrome outline>
              Delete
            </Button>
          )}
        </div>
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

export default EditPageComponent;
