import { useState } from "react";
import classNames from "classnames";
import folderImg from "../img/folder.png";

function Sidebar({
  sidebarList,
  isLoadedSidebar,
  folderToofler,
  viewAddForm,
  editFrom,
}) {
  const [fixBar, setFixBar] = useState(false);
  const tooglefixBar = () => setFixBar(!fixBar);

  const [menu, setMenu] = useState();
  function contextMenu(listOptions, listItem) {
    const x = listOptions.clientX;
    const y = listOptions.clientY;

    console.log(listItem);

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

  return !isLoadedSidebar ? (
    <h2>Завантаження...</h2>
  ) : (
    <>
      {menu}
      <nav className={classNames({ fixed: fixBar })}>
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
                  <li
                    key={el.id}
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
                ) : (
                  <li
                    className={el.open ? "folder open" : "folder"}
                    key={el.id}
                    onContextMenu={(e) => {
                      e.preventDefault();
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
                      <ul>
                        {el.internalLinks.map((subEl) => {
                          return (
                            <li
                              key={subEl.id}
                              onContextMenu={(e) => {
                                e.preventDefault();
                                contextMenu(e, el);
                              }}
                            >
                              <a href={subEl.href}>
                                <img
                                  src={
                                    "https://s2.googleusercontent.com/s2/favicons?domain_url=" +
                                    subEl.href
                                  }
                                  alt="ico"
                                />
                                <span>{subEl.title}</span>
                              </a>
                            </li>
                          );
                        })}
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
