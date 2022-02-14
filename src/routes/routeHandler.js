import React from "react";
import { Route, Navigate } from "react-router-dom";

/**
 *
 * @param {Object} Route parameters
 * @description Route parameters must contain layout, component and other props. Layout has to be the master page.
 */

const routeHandler = ({ layout, component, roles, ...rest }) => {
    if (1) {
        console.log("Here");
      return <Navigate to={"/login"} />;
    }
    else {
        console.log("Here1");
      return (
        <Route
          {...rest}
          render={(props) =>
            React.createElement(
              layout,
              { ...props, ...rest },
              React.createElement(component, { ...props, ...rest })
            )
          }
        />
      );
    }
  };
  




export default routeHandler;