import React, { Fragment } from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <Fragment>
      <div className='text-center py-5'>
        <h1 className='animated bounceInDown'>404, Page Not Found</h1>
        <p className='large'>Sorry, this page does not exist :(</p>
        Go to{" "}
        <Link to='/'>
          <u>Home</u>
        </Link>
      </div>
    </Fragment>
  );
};

export default NotFound;
