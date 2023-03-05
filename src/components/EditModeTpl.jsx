import { useState, useRef } from "react";
import classNames from "classnames";

import {
  bookmarksImport,
  bookmarksImportChrome,
} from "../functions/bookmarksImport";

import "../styles/EditModeTpl.scss";

function EditModeTpl({ importBtn, backupBtn, runEditMode }) {
  const [editMode, setEditMode] = useState(false);
  const toogleEditMode = () => {
    setEditMode(!editMode);
    runEditMode();
  };
  const [backup, setBackup] = useState("");

  const inputEl = useRef(null);
  const onButtonClick = () => {
    inputEl.current.click();
  };

  return (
    <div className="edit-mode">
      {editMode && (
        <>
          <div className="importFile">
            <input
              type="file"
              ref={inputEl}
              name="file"
              accept=".json, .html"
              style={{ display: "none" }}
              onChange={(event) => {
                const type = event.target.files[0].type;

                let reader = new FileReader();
                reader.addEventListener("load", async function () {
                  if (type == "text/html") {
                    const list = await bookmarksImportChrome(reader);
                    importBtn(false, list);
                  } else {
                    const list = await bookmarksImport(reader);
                    importBtn(list.listdata, list.sidebarData);
                  }
                });

                reader.readAsText(event.target.files[0]);
              }}
            />
            <button className="btn importBtn" onClick={onButtonClick}>
              Імпортувати данні
            </button>
          </div>
          <button
            className="btn backupBtn"
            onClick={() => {
              const backupData = backupBtn();
              const backupDataFormatted = {
                appData: {
                  list: [...backupData.list],
                  sidebar: [...backupData.sidebarList],
                },
              };
              const backupDataOutput =
                "text/json;charset=utf-8," +
                encodeURIComponent(JSON.stringify(backupDataFormatted));

              const date = new Date();
              const day = date.toLocaleDateString();
              const time = date.toLocaleTimeString().slice(0, -3);

              const fileName = "bookmarksBackup-" + day + "-" + time + ".json";
              setBackup(
                <a
                  className="backupLink"
                  onClick={() => {
                    setBackup("");
                  }}
                  href={"data:" + backupDataOutput}
                  download={fileName}
                >
                  Скачати
                </a>
              );
            }}
          >
            Зробити рез. копію
          </button>
        </>
      )}
      {backup}
      <button
        className={classNames("edit-btn", { active: editMode })}
        type="button"
        onClick={toogleEditMode}
      >
        Режим редагування
      </button>
    </div>
  );
}

export default EditModeTpl;
