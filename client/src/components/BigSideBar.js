import React from 'react';
import Wrapper from "../assets/wrappers/BigSidebar";
import { useAppContext } from "../context/appContext";
import { Navlinks } from "../components";
import Logo from "./Logo";

function BigSideBar() {

  const { showSideBar } = useAppContext();

  return (
    <Wrapper>
      <div className={ showSideBar ? 'sidebar-container' : 'sidebar-container show-sidebar' }>
        <div className='content'>
          <header>
            <Logo />
          </header>
          <Navlinks />
        </div>
      </div>
    </Wrapper>
  )
}

export default BigSideBar;
