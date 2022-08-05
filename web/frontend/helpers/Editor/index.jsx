import { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import "./style.css";
import { createMarkup } from "../../utils";
export default function CustomEditor(props) {
  const { editor, setEditor } = props;

  return (
    <>
      <Editor
        value={editor}
        apiKey="qagffr3pkuv17a8on1afax661irst1hbr4e6tbv888sz91jc"
        onEditorChange={(newValue, editor) => setEditor(newValue)}
        init={{
          height: 160,
          menubar: false,
          plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table paste code help ",
          ],
          toolbar:
            "blocks bold italic underline addunorderedlist aligncenter " +
            " bullist link | undo redo ",

          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
          branding: false,
          statusbar: false,

          setup: (editor) => {
            editor.ui.registry.addButton("redo", {
              icon: "rotate-left",
              onAction: (_) => {},
            });
            editor.getContent({ format: "text" });
          },
        }}
      />
      <div dangerouslySetInnerHTML={createMarkup(editor)}></div>
    </>
  );
}
