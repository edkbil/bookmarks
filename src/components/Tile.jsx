function Tile({ item, ifEditMode, runOnRemove, runEditFrom, dragSet }) {
  return (
    <div
      className="item"
      style={{ background: item.color }}
      draggable={ifEditMode ? true : false}
      onDragStart={(e) => {
        dragSet.dragStart(e.target, item);
      }}
      onDragEnter={(e) => {
        dragSet.dragEnter(e.target, item);
      }}
      onDragLeave={(e) => {
        dragSet.dragLeave(e.target, item);
      }}
      onDragEnd={dragSet.drag}
    >
      <a href={item.href}>
        <div className="icon">
          <img src={item.icon} alt="icon" />
        </div>
        <span>{item.title}</span>
      </a>
      {ifEditMode && (
        <>
          <button
            className="close"
            onClick={() => {
              runOnRemove(item, item.icon);
              // доступ до елемента
              // кожерінг
              // колбеки
            }}
          ></button>
          <button
            className="settings"
            onClick={() => {
              runEditFrom(item);
            }}
          ></button>
          <div className="move"></div>
        </>
      )}
    </div>
  );
}

export default Tile;
