import { useState } from "react";
import classNames from "classnames";
import folderImg from "../img/folder.png";

import {
  preventDefault /*, persist, stopPropagation */,
} from "react-event-utils";

// import useEvent from "@react-hook/event";
// import { htmlDirContent } from "html-dir-content";

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
  doParseUrl,
}) {
  // useEvent(document, "drop", (event) => {
  //   event.preventDefault();
  //   let data = event.dataTransfer.items;
  //   // let asd = event.target.outerHTML;
  //   // let asd = event.dataTransfer;
  //   // console.log("df");
  //   console.log(data);
  // });

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
          doParseUrl(true);
        }}
        onDragEnter={(e) => {
          e.stopPropagation();

          dragSidebarEnter(e.target, el);
          preventDefault((e) => {
            console.log(e.target.title.value);
          });
        }}
        onDragLeave={(e) => {
          e.stopPropagation();
          dragSidebarLeave(e.target, el);
        }}
        onDragEnd={(e) => {
          e.preventDefault();
          e.stopPropagation();
          // dragSidebar(e.target);
          // doParseUrl(false);

          EventUtil.addHandler(dm, "dragend", function (e) {
            var target = EventUtil.getCurrentTarget(e);
            console.log(target);
            target.style.backgroundColor = "";
            target.style.cursor = "default"; // Reset cursor
            return true;
          });
        }}
        // onDrop={(e) => {
        //   e.preventDefault();
        //   // let asd = e.dataTransfer.getData("text");
        //   // console.log(asd);
        //   console.log("asdsad");
        // }}
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
                      doParseUrl(true);
                    }}
                    onDragEnter={(e) => {
                      dragSidebarEnter(e.target, el);
                    }}
                    onDragLeave={(e) => {
                      dragSidebarLeave(e.target, el);
                    }}
                    onDragEnd={(e) => {
                      dragSidebar(e.target);
                      doParseUrl(false);
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
