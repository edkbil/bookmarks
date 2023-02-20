import { getDB, setDB, clearDB } from "../DB/IndexedDb";
import { createInSidebarList } from "./form";

let dragSourser = {};
let dragTarget = {};

export function handleDragStart(el, item, sidebar) {
  el.style.opacity = "0.4";
  if (sidebar) {
    if (el.tagName.toLowerCase() == "li") {
      el.classList.add("offChild");
    }
  } else {
    el.classList.add("over");
  }

  dragSourser = {
    el,
    item,
  };
}

export function handleDragEnter(el, item, sidebar) {
  if (sidebar) {
    el.style.borderTop = "1px solid #3f8efc";
  } else {
    el.classList.add("over");
  }

  dragTarget = {
    el,
    item,
  };
}

export function handleDragLeave(el, hz, sidebar) {
  if (sidebar) {
    el.style.borderTop = "none";
  } else {
    el.classList.remove("over");
  }
}

export async function handleDrag(list) {
  dragSourser.el.style.opacity = null;

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

  return newList;
}

export async function handleDragSidebar(
  sidebarList,
  htmlItem,
  addNew,
  moveToFolder = false
) {
  if (htmlItem.tagName.toLowerCase() == "li") {
    htmlItem.classList.remove("offChild");
  }

  !addNew && (dragSourser.el.style.opacity = "1");

  let newList = [];

  if (addNew) {
    createInSidebarList(sidebarList, addNew);
  } else {
    newList = [...sidebarList];
  }

  let newElement = {};
  let oldOrder = "";
  let oldId = "";

  if (addNew) {
    await getDB("sidebar").then((res) => {
      newList = res;
      newElement = res[res.length - 1];
      oldOrder = newElement.order;
      oldId = newElement.id;
    });
  } else {
    oldOrder = dragSourser.item.order;
    oldId = dragSourser.item.id;
  }

  let newOrder = dragTarget.item.order;

  await clearDB("sidebar");

  if (addNew) {
    if (dragTarget.item.parent) {
      newElement.parent = dragTarget.item.parent;
    }
  } else {
    if (dragSourser.item.parent && !dragTarget.item.parent) {
      delete dragSourser.item.parent;
    }
    if (dragTarget.item.parent && !dragSourser.item.parent) {
      dragSourser.item.parent = dragTarget.item.parent;
    }
    if (moveToFolder) {
      dragSourser.item.parent = dragTarget.item.id;
      dragSourser.item.order = 0;
    }
  }

  function sorting(el) {
    if (!moveToFolder) {
      if (el.id === oldId) {
        el.order = newOrder;
      } else if (el.order >= newOrder && el.order <= oldOrder) {
        el.order = el.order + 1;
      } else if (el.order <= newOrder && el.order >= oldOrder) {
        el.order = el.order - 1;
      }
    } else {
      if (el.parent === dragTarget.item.id) {
        el.order = el.order + 1;
      }
    }
  }

  newList.map((el) => {
    if (!el.parent && moveToFolder) {
      sorting(el);
    } else {
      sorting(el);
    }

    setDB("sidebar", el.id, el);
  });

  return newList;
}
