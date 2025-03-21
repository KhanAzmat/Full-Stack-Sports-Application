import React from "react";

const NoDisplay = (props) => {
  return (
    <div className='404 text-center'>
      <img src='/broken_tab.png' alt='Cant display page' />
      <p>Opps! Cant display this page on Mobile , Tablet or small screen </p>
    </div>
  );
};

export default NoDisplay;
