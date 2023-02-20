import { useState, useRef } from "react";
import classNames from "classnames";

import { setDB, clearDB } from "../DB/IndexedDb";

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
              accept=".json"
              style={{ display: "none" }}
              onChange={(event) => {
                let reader = new FileReader();
                reader.addEventListener("load", function (event) {
                  let result = JSON.parse(reader.result);

                  clearDB("list");
                  clearDB("sidebar");

                  const listdata = result.appData.list;
                  listdata.map((el) => {
                    setDB("list", el.id, el);
                  });

                  const sidebarData = result.appData.sidebar;
                  sidebarData.map((el) => {
                    setDB("sidebar", el.id, el);
                  });

                  importBtn(listdata, sidebarData);
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
