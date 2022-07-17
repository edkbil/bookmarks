function Search({ serchText }) {
  return (
    <form className="serchForm" action="">
      <span>"esc" to close</span>
      <input
        type="text"
        autoFocus
        onChange={(e) => {
          serchText(e.target.value);
        }}
      />
    </form>
  );
}

export default Search;
