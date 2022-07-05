import "./styles/Sidebar.css";
import "./styles/App.css";
import { useState, useEffect } from "react";
import List from "./components/List";
import Form from "./components/Form";

import easyDB from "easy-db-react-native";
import bdList from "./db.json";
import { getBd, createBd, editBd } from "./bd.js";

function App() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [list, setList] = useState();
  const [isLoaded, setIsLoaded] = useState(false);

  const { insert, select, update, remove } = easyDB();
  const [dbListId, setDbListId] = useState();

  useEffect(() => {
    //server
    // fetch("http://localhost:3333/list")
    // fetch("./db.json")
    //   .then((res) => res.json())
    //   .then((result) => {
    //     setIsLoaded(true);
    //     setList(result);
    //server

    select("bd-list").then((res) => {
      setIsLoaded(true);

      if (Object.keys(res).length === 0) {
        insert("bd-list", bdList.list).then((id) => {
          setList(bdList.list);
          setDbListId(id);
        });
      } else {
        setList(res[Object.keys(res)[0]]);
        setDbListId([Object.keys(res)[0]][0]);
      }
    });
  }, []);

  async function handleCreate(formValues) {
    await createBd(dbListId, list, formValues);
    await getBd(dbListId).then((res) => {
      setList([...res]);
    });

    //server
    // createListItem(formValues, true, true, list).then(({ data }) => {
    //   setList([...list, data]);
    // });
    //server
    setShowAddForm(false);
  }

  function handleRemove(item, imgName) {
    const confirmItemRemove = window.confirm("Точно видалити?");
    if (confirmItemRemove) {
      let newList = [...list];
      newList = newList.filter((listItem) => listItem.id !== item.id);
      editBd(dbListId, newList).then((res) => {
        setList(newList);
      });
      //server
      // removeListItem(item.id, imgName).then((resp) => {
      //   setList(list.filter((listItem) => listItem.id !== item.id));
      // });
      //server
    }
  }

  // drag
  const [dragSourser, setDragSourser] = useState({});
  const [dragTarget, setDragTarget] = useState({});

  function handleDrageStart(el, item) {
    // console.log(item);
    el.style.opacity = "0.4";
    el.classList.add("over");

    setDragSourser({
      el,
      item,
    });
  }

  function handleDrageEnter(el, item) {
    // console.log(item);
    el.classList.add("over");

    setDragTarget({
      el,
      item,
    });
  }

  function handleDrageLeave(el) {
    el.classList.remove("over");
  }

  async function handleDrage() {
    dragSourser.el.style.opacity = "1";

    let newList = [...list];

    let oldOrder = dragSourser.item.order;
    let oldId = dragSourser.item.id;

    let newOrder = dragTarget.item.order;
    let newId = dragTarget.item.id;

    newList.forEach(function (el) {
      if (el.id === dragSourser.item.id) {
        el.order = newOrder;
      }
      if (el.id === dragTarget.item.id) {
        el.order = oldOrder;
      }
    });

    editBd(dbListId, newList).then(() => {
      setList(newList);
    });

    //server
    // await editListItem({ order: newOrder }, oldId);
    // await editListItem({ order: oldOrder }, newId);
    //server
  }
  // drag

  const toogleAddForm = () => setShowAddForm(!showAddForm);
  const [editing, setEditing] = useState(false);
  const [selectedItem, setSelectedItem] = useState();

  function openCreationForm() {
    setEditing(false);
    setSelectedItem(undefined);
    toogleAddForm();
  }
  function runEditFrom(el) {
    setEditing(true);
    setSelectedItem(el);
    toogleAddForm();
  }

  async function handleEdit(editingItem) {
    let resList = [...list];
    const editingItemIndex = resList.findIndex((e) => e.id == editingItem.id);
    resList[editingItemIndex] = editingItem;

    editBd(dbListId, resList).then(() => {
      setList(resList);
    });

    toogleAddForm();
  }

  return (
    <div>
      <List
        list={list}
        isLoaded={isLoaded}
        onRemove={handleRemove}
        dragStart={handleDrageStart}
        dragEnter={handleDrageEnter}
        dragLeave={handleDrageLeave}
        drag={handleDrage}
        viewAddForm={openCreationForm}
        editFrom={runEditFrom}
      />
      {showAddForm && (
        <Form
          onCreate={handleCreate}
          onClose={() => {
            toogleAddForm();
          }}
          editing={editing}
          selectedItem={selectedItem}
          onEdit={handleEdit}
        />
      )}

      <div className="generete-page-wrap">
        <button
          onClick={() => {
            remove("bd-list", "0RUurBxExDb8");
          }}
        >
          xxx
        </button>
      </div>
    </div>
  );
}

export default App;
