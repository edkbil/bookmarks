import "./styles/Sidebar.css";
import "./styles/App.css";
import { useState, useEffect } from "react";
import {
  createListItem,
  removeListItem,
  editListItem,
  generetePage,
} from "./api.js";
import List from "./components/List";
import Form from "./components/Form";

function App() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [list, setList] = useState();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3333/list")
      .then((res) => res.json())
      .then((result) => {
        setIsLoaded(true);
        setList(result);
      });
  }, []);

  function handleCreate(formValues) {
    createListItem(formValues, true, true, list).then(({ data }) => {
      setList([...list, data]);
    });
    setShowAddForm(false);
  }

  function handleRemove(item, imgName) {
    const confirmItemRemove = window.confirm(
      "Точно видалити, чи може шось попутав, бічь?"
    );
    if (confirmItemRemove) {
      removeListItem(item.id, imgName).then((resp) => {
        setList(list.filter((listItem) => listItem.id !== item.id));
      });
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

    await editListItem({ order: newOrder }, oldId);
    await editListItem({ order: oldOrder }, newId);

    setList(newList);
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
    if (Array.isArray(editingItem)) {
      const [temmIcon, tempItem] = editingItem;
      const tempIdToRemove = tempItem.id;
      const temmIconToRemove = temmIcon.oldIcon;

      await removeListItem(tempIdToRemove, temmIconToRemove);
      await createListItem(tempItem, true).then(({ data: { icon } }) => {
        const tempItemWithNewIcon = { ...tempItem, icon };
        setList([
          ...list.filter((listItem) => listItem.id !== tempIdToRemove),
          tempItemWithNewIcon,
        ]);
      });
    } else {
      let resList = [...list];
      const editingItemIndex = resList.findIndex((e) => e.id == editingItem.id);
      resList[editingItemIndex] = editingItem;

      editListItem(
        {
          title: editingItem.title,
          href: editingItem.href,
          color: editingItem.color,
        },
        editingItem.id
      ).then((resp) => {
        setList(resList);
      });
    }
    toogleAddForm();
  }

  return (
    <div>
      <button
        onClick={generetePage}
        style={{ position: "fixed", zIndex: "999" }}
      >
        asdasdad
      </button>
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
          // onIconRemove={handleIconRemove}
        />
      )}
    </div>
  );
}

export default App;
