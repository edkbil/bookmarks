import "./styles/Sidebar.css";
import "./styles/App.css";
import { useState, useEffect } from "react";
import List from "./components/List";
import Sidebar from "./components/Sidebar";
import Form from "./components/Form";

import bdList from "./db.json";
import { getDB, setDB, removeDbList, clearDB } from "./IndexedDb.js";

function App() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [list, setList] = useState();
  const [sidebarList, setSidebarList] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoadedSidebar, setIsLoadedSidebar] = useState(false);

  useEffect(() => {
    getDB("list").then((res) => {
      setIsLoaded(true);
      if (res.length == 0) {
        let addToList = bdList.appData.list;
        addToList.map((e) => {
          setDB("list", e.id, e);
        });
        setList(addToList);
      } else {
        setList(res);
      }
    });

    getDB("sidebar").then((res) => {
      setIsLoadedSidebar(true);
      if (res.length == 0) {
        let addToSidebar = bdList.appData.sidebar;
        addToSidebar.map((e) => {
          setDB("sidebar", e.id, e);
        });
        setSidebarList(addToSidebar);
      } else {
        setSidebarList(res);
      }
    });
  }, []);

  async function handleCreate(formValues, mode) {
    let id = new Date();
    id = id.getTime();

    if (mode != "sidebar") {
      const orderList = list.map((listItem) => parseInt(listItem.order));
      const orderMax = Math.max(...orderList) + 1;

      const newItem = { ...formValues, id, order: orderMax };
      const newList = [...list];
      newList.push(newItem);

      setDB("list", id, newItem).then((res) => {
        setList(newList);
      });
    } else {
      const orderList = sidebarList.map((listItem) => parseInt(listItem.order));
      const orderMax = Math.max(...orderList) + 1;

      const newItem = { ...formValues, id, order: orderMax };
      const newList = [...sidebarList];
      newList.push(newItem);

      setDB("sidebar", id, newItem).then((res) => {
        setSidebarList(newList);
      });
    }

    setShowAddForm(false);
  }

  function handleRemove(item) {
    const confirmItemRemove = window.confirm("Точно видалити?");
    if (confirmItemRemove) {
      let newList = [...list];
      newList = newList.filter((listItem) => listItem.id !== item.id);

      removeDbList(item.id).then(() => {
        setList(newList);
      });
    }
  }

  // drag
  const [dragSourser, setDragSourser] = useState({});
  const [dragTarget, setDragTarget] = useState({});

  function handleDrageStart(el, item) {
    el.style.opacity = "0.4";
    el.classList.add("over");

    setDragSourser({
      el,
      item,
    });
  }

  function handleDrageEnter(el, item) {
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

    await setDB("list", oldId, { ...dragSourser.item, order: newOrder });
    await setDB("list", newId, { ...dragTarget.item, order: oldOrder });

    setList(newList);
  }
  // drag

  const toogleAddForm = () => setShowAddForm(!showAddForm);
  const [editing, setEditing] = useState(false);
  const [editingSidebar, setEditingSidebar] = useState(false);
  const [selectedItem, setSelectedItem] = useState();

  function openCreationForm(mode) {
    setSelectedItem(undefined);

    if (mode != "sidebar") {
      setEditing(false);
      setEditingSidebar(false);
    } else {
      setEditingSidebar(true);
    }

    toogleAddForm();
  }
  function runEditFrom(el, mode) {
    setEditing(true);
    if (!mode == "sidebar") {
      setEditingSidebar(false);
    } else {
      setEditingSidebar(true);
    }
    setSelectedItem(el);
    toogleAddForm();
  }

  async function handleEdit(editingItem, mode) {
    if (!mode == "sidebar") {
      let resList = [...list];
      const editingItemIndex = resList.findIndex((e) => e.id == editingItem.id);
      resList[editingItemIndex] = editingItem;

      setDB("list", editingItem.id, editingItem).then(() => {
        setList(resList);
      });
    } else {
      let resList = [...sidebarList];
      const editingItemIndex = resList.findIndex((e) => e.id == editingItem.id);
      resList[editingItemIndex] = editingItem;

      setDB("sidebar", editingItem.id, editingItem).then(() => {
        setSidebarList(resList);
      });
    }

    toogleAddForm();
  }

  function handleFolderToofler(folderId) {
    let newList = [...sidebarList];
    const changeItemId = newList.findIndex(
      (listItem) => listItem.id === folderId
    );

    const open = !newList[changeItemId].open;
    newList[changeItemId] = { ...newList[changeItemId], open };

    setDB("sidebar", folderId, { ...newList[changeItemId], open }).then(() => {
      setSidebarList(newList);
    });
  }

  function handleBackupBtn() {
    const backupData = {
      appData: { list: [...list], sidebar: [...sidebarList] },
    };
    return (
      "text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(backupData))
    );
  }

  function handleImportBtn(event) {
    var reader = new FileReader();
    reader.addEventListener("load", function (event) {
      var result = JSON.parse(reader.result);

      clearDB("list");
      clearDB("sidebar");

      const listdata = result.appData.list;
      listdata.map((el) => {
        setDB("list", el.id, el);
      });
      setList(listdata);

      const sidebarData = result.appData.sidebar;
      sidebarData.map((el) => {
        setDB("sidebar", el.id, el);
      });
      setSidebarList(sidebarData);
    });

    reader.readAsText(event.target.files[0]);
  }

  return (
    <div>
      <Sidebar
        sidebarList={sidebarList}
        isLoadedSidebar={isLoadedSidebar}
        folderToofler={handleFolderToofler}
        viewAddForm={openCreationForm}
        editFrom={runEditFrom}
      />
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
        backupBtn={handleBackupBtn}
        importBtn={handleImportBtn}
      />
      {showAddForm && (
        <Form
          onCreate={handleCreate}
          onClose={() => {
            toogleAddForm();
          }}
          editing={editing}
          editingSidebar={editingSidebar}
          selectedItem={selectedItem}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
}

export default App;
