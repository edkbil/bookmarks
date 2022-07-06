import { useState } from "react";
import classNames from "classnames";
import folderImg from "../img/folder.png";

function Sidebar({ sidebarList, isLoadedSidebar }) {
  const [fixBar, setFixBar] = useState(false);
  const tooglefixBar = () => setFixBar(!fixBar);

  return !isLoadedSidebar ? (
    <h2>Завантаження...</h2>
  ) : (
    <nav className={classNames({ fixed: fixBar })}>
      <div className="tools">
        <button
          className={classNames("fixed", { active: fixBar })}
          onClick={tooglefixBar}
        ></button>
        <button className="add"></button>
      </div>
      {sidebarList
        .sort((a, b) => a.order - b.order)
        .map((el) => {
          return (
            <>
              {!el.folder ? (
                <li>
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
                <li className={el.open ? "folder open" : "folder"}>
                  <p>
                    <img src={folderImg} alt="folderImg" />
                    <span>{el.title}</span>
                  </p>
                  {el.open && (
                    <ul>
                      {el.internalLinks.map((subEl) => {
                        return (
                          <li>
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
                      <li></li>
                    </ul>
                  )}
                </li>
              )}
            </>
          );
        })}
    </nav>
  );
}

export default Sidebar;
