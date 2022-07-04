import easyDB from "easy-db-react-native";

const { insert, select, update, remove } = easyDB();
const bdName = "bd-list";

export function getBd(listId) {
  return select(bdName, listId);
}

function formDataGenerator (body){
  const formData = new FormData();
  for (const key in body) {
    formData.append(key, body[key]);
  }

  return formData
}

export function createBd(listId, oldList, newListItem) {
  // const formValues = {...newListItem};

  //order
  const orderList = oldList.map((listItem) => parseInt(listItem.order));
  const orderMax = Math.max(...orderList) + 1;
  //order

  const newList = [...oldList, {...newListItem, order: orderMax}];

  return update(bdName, listId, newList);
}

export function removeBd(listId, newList) {
  return update(bdName, listId, newList);
}

export function editBd(listId, newList) {
  return update(bdName, listId, newList);
}