import "../styles/Sidebar.css";

import { useState, useEffect } from "react";
import classNames from "classnames";

import SidebarTools from "./SidebarTools";
import SidebarMenu from "./SidebarMenu";
import Bookmark from "./Bookmark";
import BookmarkFolder from "./BookmarkFolder";

import {
  handleDragStart,
  handleDragEnter,
  handleDragLeave,
  handleDragSidebar,
} from "../functions/dragAndDrop";

import bdList from "../DB/db.json";
import { getDB, setDB } from "../DB/IndexedDb";

import { subList, folderToofler, doRemove } from "../functions/sidebar";

function Sidebar({ list, viewAddForm, editFrom, searchRun }) {
  const [isLoadedSidebar, setIsLoadedSidebar] = useState(false);
  useEffect(() => {
    getDB("sidebar").then((res) => {
      setIsLoadedSidebar(true);
      if (res.length == 0) {
        let addToSidebar = bdList.appData.sidebar;
        addToSidebar.map((e) => {
          setDB("sidebar", e.id, e);
        });
        list.updateSidebarList(addToSidebar);
      } else {
        list.updateSidebarList(res);
      }
    });

    document.body.addEventListener("click", closeSidebarMenu);
  }, []);

  const handleDoRemove = async (item) => {
    const confirmItemRemove = window.confirm("Точно видалити?");
    const newList = await doRemove(list.sidebarList, confirmItemRemove, item);
    list.updateSidebarList(newList);
  };

  const [fixBar, setFixBar] = useState(false);
  const tooglefixBar = () => setFixBar(!fixBar);
  const [menu, setMenu] = useState();

  const closeSidebarMenu = () => {
    setMenu();
  };

  const contextMenu = (listOptions, listItem) => {
    const x = listOptions.clientX;
    const y = listOptions.clientY;

    !fixBar && tooglefixBar();
    setMenu(
      <SidebarMenu
        listItem={listItem}
        left={x}
        top={y}
        runEditFrom={editFrom}
        runDoRemove={handleDoRemove}
        runCloseSidebarMenu={closeSidebarMenu}
      />
    );
  };

  const [externalUrl, setExternalUrl] = useState(true);
  const [moveToFolder, setMoveToFolder] = useState(false);

  const changeExternalUrl = (state) => {
    setExternalUrl(state);
  };

  //drag delegate
  const dragStart = (el, item, sidebar) => handleDragStart(el, item, sidebar);
  const dragEnter = (el, item, sidebar) => handleDragEnter(el, item, sidebar);
  const dragLeave = (el, hz, sidebat) => handleDragLeave(el, hz, sidebat);
  const drag = async (htmlItem, addNew) => {
    const draggedList = await handleDragSidebar(
      list.sidebarList,
      htmlItem,
      addNew,
      moveToFolder
    );
    list.updateSidebarList(draggedList);
  };
  //drag delegate

  const handleFolderToofler = async (folderId) => {
    const newList = await folderToofler(list.sidebarList, folderId);
    list.updateSidebarList(newList);
  };

  return !isLoadedSidebar ? (
    <h2>Завантаження...</h2>
  ) : (
    <>
      {menu}
      <nav
        className={classNames({ fixed: fixBar }, { fixed: searchRun })}
        onDragEnter={() => {
          !fixBar && tooglefixBar();
        }}
      >
        <SidebarTools
          fixBar={fixBar}
          tooglefixBar={tooglefixBar}
          runViewAddForm={viewAddForm}
        />
        {list.sidebarList
          .sort((a, b) => a.order - b.order)
          .map((el) => {
            return (
              <>
                {!el.folder ? (
                  !el.parent && (
                    <Bookmark
                      el={el}
                      key={el.id}
                      runContextMenu={contextMenu}
                      dragSet={{ dragStart, dragEnter, dragLeave, drag }}
                      //br
                      externalUrl={externalUrl}
                      moveToFolder={moveToFolder}
                      runExternalUrl={changeExternalUrl}
                    />
                  )
                ) : (
                  <li
                    className={classNames("folder", { open: el.open })}
                    key={el.id}
                    draggable="true"
                    // drag
                    onDragStart={(e) => {
                      dragStart(e.target, el);
                      setExternalUrl(false);
                    }}
                    onDragEnter={(e) => {
                      dragEnter(e.target, el);
                      e.target.style.background = "#3f8efc87";
                      setMoveToFolder(true);
                    }}
                    onDragLeave={(e) => {
                      dragLeave(e.target, el);
                      e.target.style.background = "transparent";
                      setMoveToFolder(false);
                    }}
                    onDragEnd={(e) => {
                      drag(e.target);
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
                        drag(e.target, {
                          title,
                          href: url,
                        });
                        setExternalUrl(true);
                      }
                      if (moveToFolder) {
                        drag(e.target, false, true);
                      }
                    }}
                    // drag
                    onContextMenu={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      contextMenu(e, el);
                    }}
                  >
                    <BookmarkFolder
                      element={el}
                      runFolderToofler={handleFolderToofler}
                      runContextMenu={contextMenu}
                    />
                    {el.open && (
                      <ul>
                        {subList(list.sidebarList, el.id).map((subEl) => (
                          <Bookmark
                            el={subEl}
                            key={subEl.id}
                            runContextMenu={contextMenu}
                            dragSet={{ dragStart, dragEnter, dragLeave, drag }}
                            //br
                            externalUrl={externalUrl}
                            moveToFolder={moveToFolder}
                            runExternalUrl={changeExternalUrl}
                          />
                        ))}
                      </ul>
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
