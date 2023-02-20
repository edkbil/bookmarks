function SidebarMenu({
  listItem,
  left,
  top,
  runEditFrom,
  runDoRemove,
  runCloseSidebarMenu,
}) {
  return (
    <div
      className="sidebarItemMenu"
      style={{ left: left + "px", top: top + "px" }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          runEditFrom(listItem, "sidebar");
          runCloseSidebarMenu();
        }}
      >
        Змінити
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          runDoRemove(listItem, "sidebar");
          runCloseSidebarMenu();
        }}
      >
        Видалити
      </button>
    </div>
  );
}

export default SidebarMenu;
