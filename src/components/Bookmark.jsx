function Bookmark({
  el,
  runContextMenu,
  dragSet,
  externalUrl,
  moveToFolder,
  runExternalUrl,
}) {
  return (
    <li
      key={el.id}
      draggable="true"
      // drag
      onDragStart={(e) => {
        e.stopPropagation();
        dragSet.dragStart(e.target, el, true);
        runExternalUrl(false);
      }}
      onDragEnter={(e) => {
        e.stopPropagation();
        dragSet.dragEnter(e.target, el, true);
      }}
      onDragLeave={(e) => {
        e.stopPropagation();
        dragSet.dragLeave(e.target, el, true);
      }}
      onDragEnd={(e) => {
        e.stopPropagation();
        !moveToFolder && dragSet.drag(e.target, false, true);
        runExternalUrl(true);
      }}
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDrop={(e) => {
        e.stopPropagation();
        e.preventDefault();

        if (externalUrl) {
          const url = e.dataTransfer.getData("url");
          const urlArr = url.split("/");
          const title = urlArr[2];
          dragSet.drag(e.target, { title, href: url }, true);
          runExternalUrl(true);
        }
      }}
      // drag

      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        runContextMenu(e, el);
      }}
    >
      <a href={el.href}>
        <img
          src={
            "https://s2.googleusercontent.com/s2/favicons?domain_url=" + el.href
          }
          alt="ico"
        />
        <span>{el.title}</span>
      </a>
    </li>
  );
}

export default Bookmark;
