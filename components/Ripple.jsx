'use client';

import { useState, useLayoutEffect } from "react";
import '@styles/components_styles/Ripple.css';
import PropTypes from "prop-types";


const ButtonRipple = ({ children }) => {



  /*
    #test-btn{
                padding: 12px 32px;
                background: var(--secondColor);
                color: white;
                border: none;
                outline: none; 
                border-radius: 8px;
                overflow: hidden;
                position: relative;
                
                .start-ripple{
                    display: block;
                    position: absolute;
                    width: 44px;
                    height: 44px;
                    border-radius: 50px;
                    background: rgba(67, 67, 67, 0.756);
                    animation-name: ripple-effect;
                    animation-duration: 1s;
                }

                .stop-ripple{
                    display: none;
                  }
                }
  */
  
  return (

    <button id='test-btn' ref={testBtnRef} onClick={(e) => {
      console.log(e);
      if(!animateRipple) setCoords({ x: e.clientX - testBtnRef?.current?.offsetTop, y: e.clientY - testBtnRef?.current?.offsetTop });
    }}>
      Click
      <span className={animateRipple ? 'start-ripple' : 'stop-ripple'} 
        style={{ 
          top: coords.y - 96, 
          left: coords.x - 16,
          background: bgColor || 'rgba(67, 67, 67, 0.756)'
        }}
      />
    </button>
  );
};

export default ButtonRipple;
