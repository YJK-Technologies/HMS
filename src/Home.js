import React from 'react'
import './Home.css'
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons';
import main from './main.png';

const Home = () => {

  const navigate = useNavigate();

  const handleNavigateToForm = () => {
    navigate("/Login"); 
  };
  return (
    <div className=''>
      <div class="container1">
      <div class="navbar1">
        <div class="menu">
          <img src={main} alt="Logo Image" class="logo"></img> 
          <div class="hamburger_menu">
          </div>
        </div>
      </div>

      <div class="">
        <div class="main">
          <header id="header">
            <div class="overlay">
              <div class="inner">
                <h2 class="title1">Future is here</h2>
                <a><button class="button" onClick={handleNavigateToForm} >Login </button></a>
              </div>
            </div>
          </header>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Home