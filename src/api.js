import axios from "axios";

const client = axios.create({
    baseURL: 'http://localhost:3333'
})

export function createListItem (body, withFile=false, genereteOrder=false, list) {
  const formData = new FormData();
  if (withFile){
    for (const key in body) {
      formData.append(key, body[key]);
    }
  } else if (withFile && genereteOrder) {
    const orderList = list.map((listItem) => parseInt(listItem.order));
    const orderMax = Math.max(...orderList) + 1;
    const formValuesWithOrder = { ...list, order: orderMax };

    for (const key in formValuesWithOrder) {
      formData.append(key, formValuesWithOrder[key]);
    }
  }
  
  return client
    .post("/list", withFile ? formData : body , {
      headers: withFile ? {
        "Content-Type": "multipart/form-data",
      } : {}
    })
}

export function removeListItem (listItemId, removeIconName) {
  return client
    .delete("/list/" + listItemId, {
      data: {
        name: removeIconName,
      },
    })
}

export function editListItem (body, listItemId) {
  return client
    .patch("/list/" + listItemId, body)
}