import React from "react";
import { Routes, Route } from "react-router-dom";
import * as CONSTANTS from "./constants";
import "antd/dist/antd.css";

import Login from "../app/pages/Login";
import NotFound from "../app/pages/NotFound";
import Home from "../app/pages/Home";

const routes = ({ location, ...rest }) => (
    <Routes>
        <Route path={CONSTANTS.URLS.Login} element={<Login />} />
        <Route path={CONSTANTS.URLS.CreateUser} element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path={CONSTANTS.URLS.Home} element={<Home />} />
        <Route path={CONSTANTS.URLS.CurrencyExchange} element={<Home />} />
        <Route path={CONSTANTS.URLS.Profile} element={<Home />} />
        <Route path="*" element={<NotFound />} />
    </Routes>
);

export default routes;