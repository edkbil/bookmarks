function importIcons(r) {
    let icons = {};
    r.keys().map((item) => {
        icons[item.replace("./", "")] = r(item);
    });
    return icons;
}

export {importIcons};