import { useState, useRef } from "react";
import { HexColorPicker } from "react-colorful";

import {
  createInList,
  createInSidebarList,
  editInListForm,
  editInSidebarListForm,
} from "../functions/form";

import closeImg from "../img/close2.png";

function Form({
  list,
  changeShowAddForm,
  onClose,
  editing,
  selectedItem,
  editingSidebar,
  runToogleAddForm,
}) {
  const [href, setHref] = useState(!editing ? "" : selectedItem.href);
  const [title, setTitle] = useState(!editing ? "" : selectedItem.title);
  const [color, setColor] = useState(!editing ? "#aabbcc" : selectedItem.color);
  const [file, setFile] = useState(!editing ? false : selectedItem.icon);

  const [fieldImg, setFieldImg] = useState("");

  const inputEl = useRef(null);
  const onButtonClick = () => {
    // `current` вказує на змонтований елемент `input`
    inputEl.current.click();
  };

  const handleCreate = async (formValues, mode) => {
    mode
      ? list.updateSidebarList(
          await createInSidebarList(list.sidebarList, formValues)
        )
      : list.updateList(await createInList(list.list, formValues));

    changeShowAddForm(false);
  };

  const handleEditForm = async (formValues, mode) => {
    mode
      ? list.updateSidebarList(
          await editInSidebarListForm(list.sidebarList, formValues)
        )
      : list.updateList(await editInListForm(list.list, formValues));

    runToogleAddForm();
  };

  return (
    <div>
      <div className="overlay">
        <form
          onSubmit={function (e) {
            e.preventDefault();

            if (!editing) {
              !editingSidebar
                ? handleCreate({ href, title, color, icon: file })
                : handleCreate({ href, title, icon: "" }, "sidebar");

              setHref("");
              setTitle("");
            } else {
              !editingSidebar
                ? handleEditForm({
                    href,
                    title,
                    color,
                    icon: file,
                    order: selectedItem.order,
                    id: selectedItem.id,
                  })
                : handleEditForm(
                    {
                      href,
                      title,
                      icon: "",
                      order: selectedItem.order,
                      id: selectedItem.id,
                    },
                    "sidebar"
                  );
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
            onChange={(e) => {
              setHref(e.target.value);
              if (editingSidebar) {
                let img =
                  "https://s2.googleusercontent.com/s2/favicons?domain_url=" +
                  e.target.value;
                setFieldImg(img);
              }
            }}
          ></input>
          {!editingSidebar ? (
            <>
              <HexColorPicker color={color} onChange={setColor} />
              <div className="fileWrap">
                <button
                  className="getFile"
                  onClick={onButtonClick}
                  type="button"
                >
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
            </>
          ) : (
            <img src={fieldImg} className="sidebarBookmarkIcon" alt="" />
          )}
          <button type="submit">
            {!editing ? "Додати" : "Зберегти зміни"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Form;
