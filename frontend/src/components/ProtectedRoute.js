import { Outlet, Navigate } from "react-router-dom";

function ProtectedRoute(props) {

  return (
      props.loggedIn ? <Outlet /> : <Navigate to="/sign-in" />
  );
}

export default ProtectedRoute;