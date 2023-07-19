import React from 'react';
import Wrapper from "../assets/wrappers/SmallSidebar";
import { FaTimes } from "react-icons/fa";
import { useAppContext } from "../context/appContext";
import { Navlinks } from "../components";
import Logo from "./Logo";

function SmallSideBar() {

  const { showSideBar, toggleSideBar } = useAppContext();

  return (
    <Wrapper>
      <div className={showSideBar ? 'sidebar-container show-sidebar' : 'sidebar-container'}>
        <div className='content'>
          <button
            type='button'
            className='close-btn'
            onClick={toggleSideBar}>
              <FaTimes />
            </button>
            <header>
              <Logo />
            </header>
            <div className='nav-links'>
              <Navlinks />
            </div>
        </div>
      </div>
    </Wrapper>
  )
}

export default SmallSideBar;
