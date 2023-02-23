import "../styles/SidebarTools.scss";

import classNames from "classnames";

function SidebarTools({ fixBar, tooglefixBar, runViewAddForm }) {
  return (
    <div className="tools">
      <button
        className={classNames("fixed", { active: fixBar })}
        onClick={tooglefixBar}
      ></button>
      <button
        className="add"
        onClick={() => {
          !fixBar && tooglefixBar();
          runViewAddForm("sidebar");
        }}
      ></button>
    </div>
  );
}

export default SidebarTools;
