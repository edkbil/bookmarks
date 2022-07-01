import { useState, useRef } from "react";
import { HexColorPicker } from "react-colorful";
import { importIcons } from "../modules/importIcons.js";
import closeImg from "../img/close2.png";

function Form({ onCreate, onClose, editing, onEdit, selectedItem }) {
  const [href, setHref] = useState(!editing ? "" : selectedItem.href);
  const [title, setTitle] = useState(!editing ? "" : selectedItem.title);
  const [color, setColor] = useState(!editing ? "#aabbcc" : selectedItem.color);
  const [file, setFile] = useState();
  const [renderImgIcon, setRenderImgIcon] = useState(false);

  const inputEl = useRef(null);
  const onButtonClick = () => {
    // `current` указывает на смонтированный элемент `input`
    inputEl.current.click();
  };

  let editIconResult = "";
  if (editing) {
    const editIconProceed = importIcons(
      require.context("../../images", false, /\.(png|jpe?g|svg)$/)
    );
    editIconResult = editIconProceed[selectedItem.icon];
  }
  const [editIcon, srtEditIcon] = useState(
    !editing ? "" : <img src={editIconResult} alt="icon" />
  );

  const [changeFile, setChangeFile] = useState(false);

  return (
    <div>
      <div className="overlay">
        <form
          onSubmit={function (e) {
            e.preventDefault();

            if (!editing) {
              onCreate({ href, title, color, icon: file });

              setHref("");
              setTitle("");
            } else {
              if (!changeFile) {
                onEdit({
                  id: selectedItem.id,
                  href,
                  title,
                  color,
                  icon: selectedItem.icon,
                });
              } else {
                onEdit([
                  {
                    oldIcon: selectedItem.icon,
                  },
                  {
                    id: selectedItem.id,
                    title,
                    href,
                    color,
                    icon: file,
                    order: selectedItem.order,
                  },
                ]);
              }
            }
          }}
          className="add-form"
          style={{ width: 300, margin: "auto" }}
        >
          <div className="hide-form" onClick={onClose}>
            <img src={closeImg} alt="closeImg" />
          </div>
          <input
            placeholder="Ім'я"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          ></input>
          <input
            placeholder="Ссилка"
            type="text"
            value={href}
            onChange={(e) => setHref(e.target.value)}
          ></input>
          <HexColorPicker color={color} onChange={setColor} />
          <div className="fileWrap">
            <button className="getFile" onClick={onButtonClick} type="button">
              Зображення
            </button>

            {editing && (
              <div className="icon" style={{ background: color }}>
                <button
                  className="trash"
                  type="button"
                  onClick={() => {
                    srtEditIcon("");
                  }}
                ></button>
                {editIcon}
              </div>
            )}

            {renderImgIcon && (
              <div className="icon" style={{ background: color }}>
                <button
                  className="trash"
                  type="button"
                  onClick={() => {
                    setRenderImgIcon(false);
                  }}
                ></button>
                <img src={renderImgIcon} alt="renderImgIcon" />
              </div>
            )}

            <input
              type="file"
              name="image"
              ref={inputEl}
              accept=".png"
              onChange={(e) => {
                let render = new FileReader();
                render.onload = function (e) {
                  if (!editing) {
                    setRenderImgIcon(e.target.result);
                  } else {
                    srtEditIcon(<img src={e.target.result} alt="icon" />);
                    setChangeFile(true);
                  }
                };
                render.readAsDataURL(e.target.files[0]);
                setFile(e.target.files[0]);
              }}
            ></input>
          </div>
          <button type="submit">
            {!editing ? "Додати" : "Зберегти зміни"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Form;
