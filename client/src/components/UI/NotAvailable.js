import React from "react";

const NotAvailable = (props) => {
  return (
    <div className='404 text-center'>
      <img src='4042.png' alt='404' width='15%' />
      <p>Sorry! No {props.component} to show... </p>
    </div>
  );
};

export default NotAvailable;
