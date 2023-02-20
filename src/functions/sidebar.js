import { setDB, removeDB } from "../DB/IndexedDb";

export function subList(sidebarList, parentId) {
  let list = [...sidebarList];
  list = list.filter((listItem) => listItem.parent == parentId);
  list = list.sort((a, b) => a.order - b.order);
  return list;
}

export async function folderToofler(sidebarList, folderId) {
  let newList = [...sidebarList];
  const changeItemId = newList.findIndex(
    (listItem) => listItem.id === folderId
  );

  const open = !newList[changeItemId].open;
  newList[changeItemId] = { ...newList[changeItemId], open };

  let updatedList = [];
  await setDB("sidebar", folderId, { ...newList[changeItemId], open }).then(
    (updatedList = [...newList])
  );

  return updatedList;
}

export async function doRemove(sidebarList, confirmItemRemove, item) {
  let updatedList = [];

  if (confirmItemRemove) {
    if (item.folder) {
      let newList = [...sidebarList];
      const folderInclude = newList.filter(
        (listItem) => listItem.parent === item.id
      );
      if (folderInclude.length == 0) {
        newList = newList.filter((listItem) => listItem.id !== item.id);
        await removeDB("sidebar", item.id).then(() => {
          updatedList = [...newList];
        });
      } else {
        const toDel = new Set(folderInclude);
        newList = newList.filter((listItem) => !toDel.has(listItem));
        newList = newList.filter((listItem) => listItem.id !== item.id);
        await removeDB("sidebar", item.id).then(() => {
          folderInclude.forEach((el) => {
            removeDB("sidebar", el.id).then(() => {});
          });
          updatedList = [...newList];
        });
      }
    } else {
      let newList = [...sidebarList];
      newList = newList.filter((listItem) => listItem.id !== item.id);
      await removeDB("sidebar", item.id).then(() => {
        updatedList = [...newList];
      });
    }
  }

  return updatedList;
}
