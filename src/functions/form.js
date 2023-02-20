import { setDB } from "../DB/IndexedDb";

let updatedList = [];
let updatedSidebarList = [];

function idGenerate() {
  let id = new Date();
  id = id.getTime();

  return id;
}

export async function createInList(list, formValues) {
  const id = idGenerate();
  const orderList = list.map((listItem) => parseInt(listItem.order));
  const orderMax = Math.max(...orderList) + 1;

  const newItem = { ...formValues, id, order: orderMax };
  const newList = [...list];
  newList.push(newItem);

  await setDB("list", id, newItem).then((res) => {
    updatedList = [...newList];
  });

  return updatedList;
}

export async function createInSidebarList(list, formValues) {
  const id = idGenerate();
  const orderList = list.map((listItem) => parseInt(listItem.order));
  const orderMax = Math.max(...orderList) + 1;

  let newItem = { ...formValues, id, order: orderMax };
  if (!formValues.href) {
    newItem = { ...newItem, folder: true };
  }
  const newList = [...list];
  newList.push(newItem);

  await setDB("sidebar", id, newItem).then((res) => {
    updatedSidebarList = [...newList];
  });

  return updatedSidebarList;
}

export async function editInListForm(list, editingItem) {
  let resList = [...list];
  const editingItemIndex = resList.findIndex((e) => e.id == editingItem.id);
  resList[editingItemIndex] = editingItem;

  await setDB("list", editingItem.id, editingItem).then(() => {
    updatedList = [...resList];
  });

  return updatedList;
}

export async function editInSidebarListForm(list, editingItem) {
  let resList = [...list];
  const editingItemIndex = resList.findIndex((e) => e.id == editingItem.id);
  resList[editingItemIndex] = editingItem;

  await setDB("sidebar", editingItem.id, editingItem).then(() => {
    updatedSidebarList = [...resList];
  });

  return updatedSidebarList;
}
