import { openDB } from "idb";

export const dbStore = openDB("appData", 1, {
  upgrade(db) {
    db.createObjectStore("list");
    db.createObjectStore("sidebar");
  },
});

export async function getDB(store) {
  return (await dbStore).getAll(store);
}

export async function setDB(store, key, val) {
  return (await dbStore).put(store, val, key);
}

export async function removeDB(store, key) {
  return (await dbStore).delete(store, key);
}

export async function clearDB(store) {
  return (await dbStore).clear(store);
}
