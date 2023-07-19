import React, { useState } from 'react';
import { FaAlignLeft, FaUserCircle, FaCaretDown } from 'react-icons/fa';
import Logo from "../components/Logo";
import { useAppContext } from "../context/appContext";
import Wrapper from "../assets/wrappers/Navbar";

function Navbar() {

  const [ showLogout, setShowLogout ] = useState(false);
  const { toggleSideBar, logoutUser, user } = useAppContext();

  return (
    <Wrapper>
      <div className='nav-center'>
        <button type='button' className='toggle-btn' onClick={toggleSideBar}>
          <FaAlignLeft />
        </button>
        <div>
          <Logo />
          <h3 className='logo-text'>Dashboard</h3>
        </div>
        <div className='btn-container'>
          <button type='button' className='btn' onClick={() => setShowLogout(!showLogout)}>
            <FaUserCircle />
              {user.name}
            <FaCaretDown />
          </button>
          <div className={ showLogout ? 'dropdown show-dropdown' : 'dropdown' }>
            <button type='button' className='dropdown-btn' onClick={logoutUser}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </Wrapper>
  )
}

export default Navbar;
