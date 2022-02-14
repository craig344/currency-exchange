import axios from "axios";
import { COOKIE, getCookie, deleteCookie, createCookie } from "../cookie";
import * as APIConstants from "./constants"

/**
 * @name fetchApi
 * @description will fet the data based on params supplied
 * @param {string} param
 * @param {string} method
 * @param {object} variables
 */
export const fetchApi = (param = null, method = null, variables = null) => {
    if (getCookie(COOKIE.ACCESS_TOKEN)) {
        fetch(
            `${APIConstants.ApiUrl}${"auth/getToken"}`,
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    grant_type: "refresh_token",
                    clientId: getCookie(COOKIE.CLIENT_ID),
                    refresh_token: getCookie(COOKIE.REFRESH_TOKEN)
                }),
            }
        ).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson && responseJson.success === true) {
                    createCookie(COOKIE.ACCESS_TOKEN, responseJson.access_token, responseJson.expires_in);
                    createCookie(COOKIE.REFRESH_TOKEN, responseJson.refresh_token, responseJson.expires_in);
                    createCookie(COOKIE.CLIENT_ID, getCookie(COOKIE.CLIENT_ID), responseJson.expires_in)
                } 
            });
    } else {
        deleteCookie(COOKIE.ACCESS_TOKEN);
        deleteCookie(COOKIE.REFRESH_TOKEN);
        window.location.assign("/");
    }
    return axios({
        method: method,
        url: `${APIConstants.ApiUrl}${param}`,
        data: variables,
        headers: {
            accept: "application/json",
            Authorization: "Bearer " + getCookie(COOKIE.ACCESS_TOKEN)
        }
    })
        .then(res => res.data)
        .catch(err => {
            try {
                let { status } = err.response;
                if (status === 401) {
                    deleteCookie(COOKIE.ACCESS_TOKEN);
                    deleteCookie(COOKIE.REFRESH_TOKEN);
                    window.location.assign("/");
                } else if (status === 400 || status === 404) {
                    if (err.response.data) {
                        if (err.response.data.response) {
                            return err.response.data;
                        } else if (
                            err.response.data.violations &&
                            err.response.data.violations[0] &&
                            err.response.data.violations[0].message
                        ) {
                            return err.response.data;
                        } else if (err.response.data) {
                            return err.response.data;
                        } else {
                            return false;
                        }
                    } else if (err.response.code) {
                        return err.response;
                    } else {
                        return false;
                    }
                }
            } catch (error) { }
        });
}