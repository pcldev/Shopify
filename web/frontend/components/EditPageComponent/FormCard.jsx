import { Card, TextField } from "@shopify/polaris";
import CustomEditor from "../../helpers/Editor";
import { createMarkup } from "../../utils";
const FormCard = (props) => {
  const { title, editor, setEditor, isValid, handleTextFieldChange } = props;
  return (
    <div
      className="col-1"
      style={{ flexBasis: "calc((100% - 1.25rem) * 3 / 5)" }}
    >
      <Card sectioned>
        <form id="formPage">
          <TextField
            value={title}
            error={!isValid}
            focused={!isValid}
            onChange={handleTextFieldChange}
            label="Title"
            placeholder="e.g. Contact us, Sizing chart, FAQS"
            autoComplete="false"
            requiredIndicator={true}
          />
          {!isValid && <p style={{ color: "red" }}>Title can't be blank</p>}
          <p style={{ marginTop: "10px" }}>Content</p>
          <CustomEditor editor={editor} setEditor={setEditor} />
        </form>
      </Card>

      <Card
        sectioned
        title="Search engine listing preview"
        actions={[{ content: "Edit Page Web SEO" }]}
      >
        {title.trim() === "" && editor.trim() === "" && (
          <p>
            Add a title and description to see how this Page might appear in a
            search engine listing
          </p>
        )}

        {editor.trim() !== "" && title.trim() !== "" && (
          <div>
            <p style={{ color: "#1a0dab" }}>{title}</p>
            <a href={`${window.location.ancestorOrigins[0]}/${title}`}>
              {window.location.ancestorOrigins[0]}/{title}
            </a>
            <div dangerouslySetInnerHTML={createMarkup(editor)}></div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default FormCard;
