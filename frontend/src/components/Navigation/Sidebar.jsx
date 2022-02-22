import React from "react";
import useSidebarControl from "../../hooks/useSidebarControl";
import { NavLink } from "react-router-dom";
import useSession from "../../hooks/useSession";

const Sidebar = () => {
  const { isActive, setIsActive } = useSidebarControl();
  const { user } = useSession();

  if (user === null) {
    return <></>;
  }

  return (
    <aside className={`sidebar ${isActive ? `active` : ``} `}>
      <div className="d-flex justify-content-end">
        <button
          onClick={() => setIsActive(!isActive)}
          className="btn btn-sm btn-purple d-block d-sm-block d-md-none d-lg-none d-xl-none d-xxl-none"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
      <nav className="menu">
        <NavLink to="/home" className="menu-item">
          Home
        </NavLink>
        <hr className="text-white" />
        <NavLink to="/me/catalog" className="menu-item">
          My catalog
        </NavLink>
        <NavLink to="/meet" className="menu-item">
          Meet people
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
