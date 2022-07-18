import { useState, useEffect } from "react";
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
  doRemove,
  searchRun,
}) {
  const [fixBar, setFixBar] = useState(false);
  const tooglefixBar = () => setFixBar(!fixBar);

  const [menu, setMenu] = useState();

  useEffect(() => {
    document.body.addEventListener("click", closeSidebarMenu);
  }, []);

  function closeSidebarMenu() {
    setMenu();
  }

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
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            editFrom(listItem, "sidebar");
            setMenu();
          }}
        >
          Змінити
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            doRemove(listItem, "sidebar");
            setMenu();
          }}
        >
          Видалити
        </button>
      </div>
    );
  }

  const [externalUrl, setExternalUrl] = useState(true);
  function listItem(el) {
    return (
      <li
        key={el.id}
        draggable="true"
        // drag
        onDragStart={(e) => {
          e.stopPropagation();
          dragSidebarStart(e.target, el);
          setExternalUrl(false);
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
          !moveToFolder && dragSidebar(e.target);
        }}
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDrop={(e) => {
          e.stopPropagation();
          e.preventDefault();

          if (externalUrl) {
            const url = e.dataTransfer.getData("url");
            const urlArr = url.split("/");
            const title = urlArr[2];
            dragSidebar(e.target, { title, href: url });
            setExternalUrl(true);
          }
        }}
        // drag

        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
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

  const [moveToFolder, setMoveToFolder] = useState(false);

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
      <nav
        // className={classNames({ fixed: fixBar }, { fixed: searchRun })}
        className={classNames("fixed", { fixed: searchRun })}
        onDragEnter={() => {
          !fixBar && tooglefixBar();
        }}
      >
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
                    className={classNames("folder", { open: el.open })}
                    key={el.id}
                    draggable="true"
                    // drag
                    onDragStart={(e) => {
                      dragSidebarStart(e.target, el);
                      setExternalUrl(false);
                    }}
                    onDragEnter={(e) => {
                      dragSidebarEnter(e.target, el);
                      e.target.style.background = "#3f8efc87";
                      setMoveToFolder(true);
                    }}
                    onDragLeave={(e) => {
                      dragSidebarLeave(e.target, el);
                      e.target.style.background = "transparent";
                      setMoveToFolder(false);
                    }}
                    onDragEnd={(e) => {
                      dragSidebar(e.target);
                      setExternalUrl(true);
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                    }}
                    onDrop={(e) => {
                      e.stopPropagation();
                      e.preventDefault();

                      if (externalUrl) {
                        const url = e.dataTransfer.getData("url");
                        const urlArr = url.split("/");
                        const title = urlArr[2];
                        dragSidebar(e.target, { title, href: url });
                        setExternalUrl(true);
                      }
                      if (moveToFolder) {
                        dragSidebar(e.target, false, true);
                      }
                    }}
                    // drag
                    onContextMenu={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
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
