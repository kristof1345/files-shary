import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import RetrievedFile from "./components/retrievedFile";

const key = import.meta.env.VITE_DB_KEY;
const url = import.meta.env.VITE_DB_URL;

const supabase = createClient(url, key);

function App() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    retrieveLast();
  }, []);

  const getFile = () => {
    let field = document.getElementById("inputGroupFile01");
    return field.files[0];
  };

  const uploadFile = async () => {
    let file = getFile();
    console.log(file);

    if (!file) {
      console.error("No file selected!");
      return;
    }

    const { data, error } = await supabase.storage
      .from("uploads")
      .upload("main/" + file.name + "_" + uuidv4(), file);

    if (error) {
      console.error("Error uploading file:", error);
    } else {
      console.log("File:", data);
      retrieveLast();
    }
  };

  const retrieveLast = async () => {
    const { data, error } = await supabase.storage
      .from("uploads")
      .list("main", {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });
    if (error) {
      console.error("Error uploading file:", error);
    } else {
      setFiles(data);
    }
  };

  return (
    <>
      <div id="upload-form-holder">
        <form>
          <input
            id="inputGroupFile01"
            type="file"
            className="custom-file-input"
          />
        </form>
        <button onClick={uploadFile} id="share">
          Share
        </button>
      </div>
      <div id="reciever">
        {files.length > 0
          ? files.map((file) => (
              <RetrievedFile key={file.name} file={file} supabase={supabase} />
            ))
          : null}
      </div>
    </>
  );
}

export default App;
