import { useState, useEffect } from "react";

import List from "./components/List";
import Sidebar from "./components/Sidebar";
import Form from "./components/Form";
import Search from "./components/Search";

import sideSearchConfig from "./functions/search";

import "./styles/App.css";

function App() {
  const [list, setList] = useState();
  const [sidebarList, setSidebarList] = useState();
  const [searchForm, setSearchForm] = useState(false);

  const [showAddForm, setShowAddForm] = useState(false);
  const toogleAddForm = () => setShowAddForm(!showAddForm);

  useEffect(() => {
    const sideSearch = (e) =>
      !showAddForm && setSearchForm(sideSearchConfig(e));
    document.addEventListener("keydown", sideSearch);
    return () => {
      document.removeEventListener("keydown", sideSearch);
    };
  });

  const [editing, setEditing] = useState(false);
  const [editingSidebar, setEditingSidebar] = useState(false);
  const [selectedItem, setSelectedItem] = useState();

  function openCreationForm(mode) {
    setEditing(false);
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
    if (mode != "sidebar") {
      setEditingSidebar(false);
    } else {
      setEditingSidebar(true);
    }
    setSelectedItem(el);
    toogleAddForm();
  }

  const handleBackupBtn = () => {
    return { list, sidebarList };
  };
  const handleImportBtn = (list, sidebarList) => {
    if (!list) {
      setSidebarList(sidebarList);
    } else {
      setList(list);
      setSidebarList(sidebarList);
    }
  };

  const updateList = (data) => setList(data);
  const updateSidebarList = (data) => setSidebarList(data);
  const updateShowAddForm = (state) => setShowAddForm(state);

  return (
    <>
      {searchForm && <Search serchResult={updateSidebarList} />}
      <Sidebar
        list={{ sidebarList, updateSidebarList }}
        viewAddForm={openCreationForm}
        editFrom={runEditFrom}
        searchRun={searchForm}
      />
      <List
        list={{ list, updateList }}
        viewAddForm={openCreationForm}
        editFrom={runEditFrom}
        backupBtn={handleBackupBtn}
        importBtn={handleImportBtn}
      />
      {showAddForm && (
        <Form
          list={{ list, sidebarList, updateList, updateSidebarList }}
          changeShowAddForm={updateShowAddForm}
          onClose={() => {
            toogleAddForm();
          }}
          editing={editing}
          editingSidebar={editingSidebar}
          selectedItem={selectedItem}
          runToogleAddForm={toogleAddForm}
        />
      )}
    </>
  );
}

export default App;
