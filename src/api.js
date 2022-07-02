import axios from "axios";

const client = axios.create({
    baseURL: 'http://localhost:3333'
})

// client.interceptors.request.use(function (config) {
//   if (config.method === 'post') {
//     config.data.append('createdTime', Date.now());
//   }

//   return config;
// });

function formDataGenerator (body){
  const formData = new FormData();
  for (const key in body) {
    formData.append(key, body[key]);
  }

  return formData
}

export function createListItem (body, withFile=false, genereteOrder=false, list) {
  const formValues = {...body};
  if (genereteOrder) {
    const orderList = list.map((listItem) => parseInt(listItem.order));
    const orderMax = Math.max(...orderList) + 1;
    formValues.order = orderMax;
  }
  
  return client
    .post("/list", withFile ? formDataGenerator(formValues) : formValues , {
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

export function generetePage () {
  return client
    .post("/generete");
}