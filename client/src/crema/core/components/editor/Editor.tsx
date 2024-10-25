import React from "react";
import EditorQuillToolbar, { formats } from "./EditorQuillToolbar";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

type EditorProps = {
  readOnly?: boolean;
  value: string;
  placeholder?: string;
  handleOnEditorChange?: (content: any) => void;
};

const Editor: React.FC<EditorProps> = ({
  readOnly,
  value,
  placeholder,
  handleOnEditorChange,
}) => {
  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }, { font: [] }], //{ size: [] }
        ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
        [{ align: ["right", "center", "justify"] }],
        [{ color: [] }, { background: [] }],
        [{ script: "sub" }, { script: "super" }],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "+1" },
          { indent: "-1" },
        ],
        ["link", "image", "video", "undo", "redo"],
      ],
    },
    history: {
      delay: 500,
      maxStack: 100,
      userOnly: true,
    },
  };
  // Render
  return (
    <div className="tt-text-editor">
      {/* <EditorQuillToolbar readOnly={readOnly || false} /> */}
      <ReactQuill
        className={`${readOnly ? "tt-text-editor-display" : ""}`}
        theme={"snow"}
        value={value}
        onChange={handleOnEditorChange}
        placeholder={placeholder || "Write something awesome..."}
        modules={modules}
        formats={formats}
        readOnly={readOnly || false}
      />
    </div>
  );
};

export default Editor;
