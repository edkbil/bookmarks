import { useState, useEffect } from "react";
import classNames from "classnames";

import Tile from "./Tile";
import EditModeTpl from "./EditModeTpl";

import bdList from "../DB/db.json";
import { getDB, setDB, removeDB } from "../DB/IndexedDb";

import "../styles/List.scss";
import addImg from "../img/add.png";

import {
  handleDragStart,
  handleDragEnter,
  handleDragLeave,
  handleDrag,
} from "../functions/dragAndDrop";

function List({ list, viewAddForm, editFrom, backupBtn, importBtn }) {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    getDB("list").then((res) => {
      setIsLoaded(true);
      if (res.length == 0) {
        let addToList = bdList.appData.list;
        addToList.map((e) => {
          setDB("list", e.id, e);
        });
        list.updateList(addToList);
      } else {
        list.updateList(res);
      }
    });
  }, []);

  const [editMode, setEditMode] = useState(false);
  const toogleEditMode = () => setEditMode(!editMode);

  function onRemove(item) {
    const confirmItemRemove = window.confirm("Точно видалити?");

    if (confirmItemRemove) {
      let newList = [...list.list];
      newList = newList.filter((listItem) => listItem.id !== item.id);

      removeDB("list", item.id).then(() => {
        list.updateList(newList);
      });
    }
  }

  const dragStart = (el, item) => handleDragStart(el, item);
  const dragEnter = (el, item) => handleDragEnter(el, item);
  const dragLeave = (el) => handleDragLeave(el);
  const drag = async () => {
    const draggedList = await handleDrag(list.list);
    list.updateList(draggedList);
  };

  return !isLoaded ? (
    <h1>Завантаження...</h1>
  ) : (
    <article>
      <div className={classNames("list", { editing: editMode })}>
        {list.list
          .sort((a, b) => a.order - b.order)
          .map((el) => {
            return (
              <Tile
                item={el}
                key={el.id}
                runOnRemove={onRemove}
                runEditFrom={editFrom}
                ifEditMode={editMode}
                dragSet={{ dragStart, dragEnter, dragLeave, drag }}
              />
            );
          })}
        <div className="item item-new" onClick={viewAddForm}>
          <img src={addImg} alt="add" />
        </div>
      </div>
      <EditModeTpl
        importBtn={importBtn}
        backupBtn={backupBtn}
        runEditMode={toogleEditMode}
      />
    </article>
  );
}

export default List;
