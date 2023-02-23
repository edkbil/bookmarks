import "../styles/Search.scss";
import Fuse from "fuse.js";
import { getDB } from "../DB/IndexedDb";

function Search({ serchResult }) {
  const optionsFormSearch = {
    keys: ["title"],
  };
  let resultList = [];

  async function serchText(serchText) {
    let oldList = [];
    await getDB("sidebar").then((res) => {
      oldList = res;
    });

    const newList = [];
    const fuse = new Fuse(oldList, optionsFormSearch);
    const result = fuse.search(serchText);

    if (serchText != "") {
      result.map((el) => {
        delete el.item.parent;
        newList.push(el.item);
      });
      resultList = [...newList];
    } else {
      resultList = [...oldList];
    }

    serchResult(resultList);
  }

  return (
    <form className="serchForm" action="">
      <span>"esc" to close</span>
      <input
        type="text"
        autoFocus
        onChange={(e) => {
          serchText(e.target.value);
        }}
      />
    </form>
  );
}

export default Search;
