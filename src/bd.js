import easyDB from "easy-db-react-native";

const { select, update } = easyDB(); //є також insert і remove
const bdName = "bd-list";

export function getBd(listId) {
  return select(bdName, listId);
}

export function createBd(listId, oldList, newListItem) {
  //order
  const orderList = oldList.map((listItem) => parseInt(listItem.order));
  const orderMax = Math.max(...orderList) + 1;
  //order

  //id
  let id = new Date();
  id =  id.getTime();
  //id

  const newList = [...oldList, {...newListItem, order: orderMax, id}];

  return update(bdName, listId, newList);
}

export function editBd(listId, newList) {
  return update(bdName, listId, newList);
}