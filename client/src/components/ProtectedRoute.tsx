import React, { useContext } from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export interface ProtectedRouteProps extends RouteProps {
  component: any;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = (
  props: ProtectedRouteProps
) => {
  const { component: Component, ...rest } = props;
  const authContext = useContext(AuthContext);

  const { isAuthenticated, isLoading } = authContext;
  return (
    <Route
      {...rest}
      render={(props) => {
        if (!isAuthenticated) {
          return (
            <Redirect
              to={{
                pathname: "/",
                state: { from: props.location },
              }}
            />
          );
        } else {
          return <Component {...props} />;
        }
      }}
    />
  );
};

export default ProtectedRoute;
