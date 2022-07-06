function Sidebar({ sidebarList }) {
  return (
    <nav>
      {sidebarList
        .sort((a, b) => a.order - b.order)
        .map((el) => {
          return (
            <>
              <li>
                <a href={el.href}>
                  <img
                    src={
                      "https://s2.googleusercontent.com/s2/favicons?domain_url" +
                      el.href
                    }
                    alt="ico"
                  />
                  <span>{el.title}</span>
                </a>
              </li>
              {el.folder && (
                <li>
                  <ul>
                    {el.internalLinks.map((subEl) => {
                      return <li>{subEl.title}</li>;
                    })}
                    <li></li>
                  </ul>
                </li>
              )}
            </>
          );
        })}
      ;
    </nav>
  );
}

export default Sidebar;
