import { useState } from "react";
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
}) {
  const [editMode, setEditMode] = useState(false);
  const toogleEditMode = () => setEditMode(!editMode);

  return !isLoaded ? (
    <h1>Завантаження...</h1>
  ) : (
    <div>
      <nav>
        <li>
          <a href="chrome://settings/">settings</a>
        </li>
        <li>
          <a href="chrome://apps/">apps</a>
        </li>
        <li>
          <a href="https://docs.google.com/document/u/0/">document</a>
        </li>
        <li>
          <a href="https://drive.google.com/drive/my-drive">my-drive</a>
        </li>
        <li>
          <a href="extensions/" target="_blank">
            extensions
          </a>
        </li>
        <li>
          <a href="chrome://bookmarks/?id=2">bookmarks</a>
        </li>
      </nav>
      <article>
        <div className={classNames("list", { editing: editMode })}>
          {list
            .sort((a, b) => a.order - b.order)
            .map((el) => {
              return (
                <div
                  className="item draggable"
                  key={el.id}
                  draggable="true"
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
                  // onDragEnd={(e) => {
                  onDragEnd={drag}
                  // drag
                >
                  <a target="_blank" href={el.href}>
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
          <button
            className={classNames({ active: editMode })}
            type="button"
            onClick={toogleEditMode}
          >
            Режим редагування
          </button>
        </div>
      </article>
    </div>
  );
}

export default List;
