import { useState, useRef } from "react";
import { HexColorPicker } from "react-colorful";
import closeImg from "../img/close2.png";

function Form({ onCreate, onClose, editing, onEdit, selectedItem }) {
  const [href, setHref] = useState(!editing ? "" : selectedItem.href);
  const [title, setTitle] = useState(!editing ? "" : selectedItem.title);
  const [color, setColor] = useState(!editing ? "#aabbcc" : selectedItem.color);
  const [file, setFile] = useState(!editing ? false : selectedItem.icon);

  const inputEl = useRef(null);
  const onButtonClick = () => {
    // `current` указывает на смонтированный элемент `input`
    inputEl.current.click();
  };

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
              onEdit({
                href,
                title,
                color,
                icon: file,
                order: selectedItem.order,
                id: selectedItem.id,
              });
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
            {editing || file ? (
              <div className="icon" style={{ background: color }}>
                <img src={file} alt="renderImgIcon" />
              </div>
            ) : (
              ""
            )}
            <input
              type="file"
              name="image"
              ref={inputEl}
              accept=".png"
              onChange={(e) => {
                let render = new FileReader();
                render.readAsDataURL(e.target.files[0]);
                render.onload = function (e) {
                  setFile(render.result);
                };
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
