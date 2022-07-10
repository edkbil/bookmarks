import { useState } from "react";
import classNames from "classnames";
import folderImg from "../img/folder.png";

function Sidebar({
  sidebarList,
  isLoadedSidebar,
  folderToofler,
  viewAddForm,
  editFrom,
  dragSidebarStart,
  dragSidebarEnter,
  dragSidebarLeave,
  dragSidebar,
}) {
  const [fixBar, setFixBar] = useState(false);
  const tooglefixBar = () => setFixBar(!fixBar);

  const [menu, setMenu] = useState();
  function contextMenu(listOptions, listItem) {
    const x = listOptions.clientX;
    const y = listOptions.clientY;

    !fixBar && tooglefixBar();
    setMenu(
      <div
        className="sidebarItemMenu"
        style={{ left: x + "px", top: y + "px" }}
      >
        <button
          onClick={() => {
            editFrom(listItem, "sidebar");
            setMenu();
          }}
        >
          Змінити
        </button>
        <button>Видалити</button>
      </div>
    );
  }

  function listItem(el) {
    return (
      <li
        key={el.id}
        draggable="true"
        // drag
        onDragStart={(e) => {
          e.stopPropagation();
          dragSidebarStart(e.target, el);
        }}
        onDragEnter={(e) => {
          e.stopPropagation();
          dragSidebarEnter(e.target, el);
        }}
        onDragLeave={(e) => {
          e.stopPropagation();
          dragSidebarLeave(e.target, el);
        }}
        onDragEnd={(e) => {
          e.stopPropagation();
          dragSidebar(e.target);
        }}
        // drag

        onContextMenu={(e) => {
          e.preventDefault();
          contextMenu(e, el);
        }}
      >
        <a href={el.href}>
          <img
            src={
              "https://s2.googleusercontent.com/s2/favicons?domain_url=" +
              el.href
            }
            alt="ico"
          />
          <span>{el.title}</span>
        </a>
      </li>
    );
  }

  function subList(parentId) {
    let list = [...sidebarList];
    list = list.filter((listItem) => listItem.parent == parentId);
    list = list.sort((a, b) => a.order - b.order);
    return list;
  }

  return !isLoadedSidebar ? (
    <h2>Завантаження...</h2>
  ) : (
    <>
      {menu}
      <nav className={classNames("fixed", { fixed: fixBar })}>
        <div className="tools">
          <button
            className={classNames("fixed", { active: fixBar })}
            onClick={tooglefixBar}
          ></button>
          <button
            className="add"
            onClick={() => {
              !fixBar && tooglefixBar();
              viewAddForm("sidebar");
            }}
          ></button>
        </div>
        {sidebarList
          .sort((a, b) => a.order - b.order)
          .map((el) => {
            return (
              <>
                {!el.folder ? (
                  !el.parent && listItem(el)
                ) : (
                  <li
                    className={el.open ? "folder open" : "folder"}
                    key={el.id}
                    draggable="true"
                    // drag
                    onDragStart={(e) => {
                      dragSidebarStart(e.target, el);
                    }}
                    onDragEnter={(e) => {
                      dragSidebarEnter(e.target, el);
                    }}
                    onDragLeave={(e) => {
                      dragSidebarLeave(e.target, el);
                    }}
                    onDragEnd={(e) => {
                      dragSidebar(e.target);
                    }}
                    // drag
                    onContextMenu={(e) => {
                      // e.preventDefault();
                      contextMenu(e, el);
                    }}
                  >
                    <p
                      data-id={el.id}
                      onClick={(e) => {
                        folderToofler(parseInt(e.target.dataset.id));
                      }}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        contextMenu(e, el);
                      }}
                    >
                      <img src={folderImg} alt="folderImg" />
                      <span>{el.title}</span>
                    </p>
                    {el.open && (
                      <ul>{subList(el.id).map((subEl) => listItem(subEl))}</ul>
                    )}
                  </li>
                )}
              </>
            );
          })}
      </nav>
    </>
  );
}

export default Sidebar;
