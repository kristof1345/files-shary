import React from "react";

const RetrievedFile = ({ file, supabase }) => {
  const downloadFile = async () => {
    const { data, error } = await supabase.storage
      .from("uploads")
      .download("main/" + file.name);

    if (error) {
      console.error("Error uploading file:", error);
    }

    return data;
  };

  function saveFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || "download";
    a.click();
  }

  async function handleDownload() {
    const fileBlob = await downloadFile();
    if (fileBlob) {
      saveFile(fileBlob, "your-filename");
    }
  }

  async function handleDelete(e) {
    const { data, error } = await supabase.storage
      .from("uploads")
      .remove(["main/" + file.name]);

    if (error) {
      console.error("Error uploading file:", error);
    } else {
      let parent = e.target.parentNode;
      parent.remove();
    }
  }

  return (
    <div className="shared-file">
      <button onClick={handleDownload} className="download">
        download
      </button>
      <button onClick={(e) => handleDelete(e)} className="delete">
        delete
      </button>
      {file.name}
    </div>
  );
};

export default RetrievedFile;
