import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/UI/Layout";
const CheckAuth = (props) => {
  const location = useLocation();
  // const dispatch = useDispatch()

  const count = useSelector((state) => state.auth.count);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  // const loading = useSelector((state)=>state.auth.loading)
  // const role = useSelector((state)=>state.auth.role)

  //const loading = useSelector((state)=>state.auth.loading)
  const navigate = useNavigate();

  console.log("Count", count);
  if (count <= 0) {
    //return  <Navigate to="/signUp"  state={{ from: location }} replace/>
    navigate("/signUp", { state: { from: location }, replace: true });
  } else if (!isAuthenticated) {
    //return  <Navigate to="/login"  state={{ from: location }} replace/>
    navigate("/login", { state: { from: location }, replace: true });
  }

  return isAuthenticated ? (
    <Layout>
      {console.log(props.children)}
      {props.children}
    </Layout>
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

// const mapStateToProps = (state) => ({
//     auth: state.auth,
//   });

export default CheckAuth;  
