import parse from "node-bookmarks-parser";
import { setDB, clearDB } from "../DB/IndexedDb";

export async function bookmarksImportChrome(reader) {
  let bookmarksList = [];

  let result = reader.result;
  let bookmarks = await parse(result);
  bookmarks = bookmarks[1].children;

  let i = 0;
  let newId = new Date();
  newId = newId.getTime();

  bookmarks.map(async (e) => {
    i++;
    newId++;

    if (e.type == "folder") {
      let folderId = newId;
      await bookmarksList.push({
        folder: true,
        title: e.title,
        order: i,
        open: false,
        id: folderId,
      });

      let iChild = 0;
      e.children.map(async (child) => {
        iChild++;
        newId++;

        await bookmarksList.push({
          title: child.title,
          href: child.url,
          icon: child.icon,
          order: iChild,
          id: newId,
          parent: folderId,
        });
      });
    } else {
      await bookmarksList.push({
        title: e.title,
        href: e.url,
        icon: e.icon,
        order: i,
        id: newId,
      });
    }
  });

  await clearDB("sidebar");
  bookmarksList.map(async (el) => {
    await setDB("sidebar", el.id, el);
  });

  return bookmarksList;
}

export function bookmarksImport(reader) {
  let result = JSON.parse(reader.result);

  clearDB("list");
  clearDB("sidebar");

  const listdata = result.appData.list;
  listdata.map((el) => {
    setDB("list", el.id, el);
  });

  const sidebarData = result.appData.sidebar;
  sidebarData.map((el) => {
    setDB("sidebar", el.id, el);
  });

  return { listdata, sidebarData };
}
