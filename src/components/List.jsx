import { useState, useRef } from "react";
import classNames from "classnames";
import addImg from "../img/add.png";

function List({
  list,
  isLoaded,
  onRemove,
  dragStart,
  dragEnter,
  dragLeave,
  drag,
  viewAddForm,
  editFrom,
  backupBtn,
  importBtn,
}) {
  const [editMode, setEditMode] = useState(false);
  const toogleEditMode = () => setEditMode(!editMode);
  const [backup, setBackup] = useState("");

  const inputEl = useRef(null);
  const onButtonClick = () => {
    inputEl.current.click();
  };

  return !isLoaded ? (
    <h1>Завантаження...</h1>
  ) : (
    <article>
      <div className={classNames("list", { editing: editMode })}>
        {list
          .sort((a, b) => a.order - b.order)
          .map((el) => {
            return (
              <div
                className="item"
                key={el.id}
                draggable={editMode ? true : false}
                style={{ background: el.color }}
                // drag
                onDragStart={(e) => {
                  dragStart(e.target, el);
                }}
                onDragEnter={(e) => {
                  dragEnter(e.target, el);
                }}
                onDragLeave={(e) => {
                  dragLeave(e.target, el);
                }}
                onDragEnd={drag}
                // drag
              >
                <a href={el.href}>
                  <div className="icon">
                    <img src={el.icon} alt="icon" />
                  </div>
                  <span>{el.title}</span>
                </a>
                {editMode && (
                  <>
                    <button
                      className="close"
                      onClick={() => {
                        onRemove(el, el.icon);
                        // доступ до елемента
                        // кожерынг
                        // калбеки
                      }}
                    ></button>
                    <button
                      className="settings"
                      onClick={() => {
                        editFrom(el);
                      }}
                    ></button>
                    <div className="move"></div>
                  </>
                )}
              </div>
            );
          })}
        <div className="item item-new" onClick={viewAddForm}>
          <img src={addImg} alt="add" />
        </div>
      </div>
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
                  importBtn(event);
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

                const date = new Date();
                const day = date.toLocaleDateString();
                const time = date.toLocaleTimeString().slice(0, -3);

                const fileName =
                  "bookmarksBackup-" + day + "-" + time + ".json";
                setBackup(
                  <a
                    className="backupLink"
                    onClick={() => {
                      setBackup("");
                    }}
                    href={"data:" + backupData}
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
    </article>
  );
}

export default List;
