import React from 'react';
import { useAppContext } from "../context/appContext";
import { NavLink } from "react-router-dom";
import links from "../utils/links";

function Navlinks() {

  const { toggleSideBar } = useAppContext();

  const renderNavlinks = links.map((link) => {
    const { id, text, path, icon } = link;
    return (
      <NavLink
        to={path}
        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link' }
        key={id}
        onClick={toggleSideBar}
      >
        <span className='icon'>{icon}</span>
        {text}
      </NavLink>
    )
  });

  return (
    <>{renderNavlinks}</>

  )
}

export default Navlinks;
