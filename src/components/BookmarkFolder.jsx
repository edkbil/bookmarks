import "../styles/BookmarkFolder.scss";
import folderImg from "../img/folder.png";

function BookmarkFolder({ element, runFolderToofler, runContextMenu }) {
  return (
    <p
      data-id={element.id}
      onClick={(e) => {
        runFolderToofler(parseInt(e.target.dataset.id));
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        runContextMenu(e, element);
      }}
    >
      <img src={folderImg} alt="folderImg" />
      <span>{element.title}</span>
    </p>
  );
}

export default BookmarkFolder;
