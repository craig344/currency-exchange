/**************************************
 * operations related to cookie
 ***************************************/

var cookie = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  CLIENT_ID: "client_id"
};

function createCookie(name, value, seconds, path, domain) {
  var cookie = name + "=" + value + ";";
  var expires = "";
  if (seconds) {
    var date = new Date();
    date.setTime(date.getTime() + seconds * 1000);
    expires = "; expires=" + date.toGMTString();
  }
  cookie += expires + ";";

  if (path) cookie += "path=" + path + ";";
  if (domain) cookie += "domain=" + domain + ";";

  if (typeof window !== "undefined") {
    document.cookie = cookie;
  }
}

// get cookie value from name
function getCookie(name) {
  var nameEQ = name + "=";
  var ca;
  if (typeof window !== "undefined") {
    ca = document.cookie.split(";");

    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
  }
  return null;
}

// delete specific cookie by name
function deleteCookie(name, path, domain) {
  // If the cookie exists
  if (getCookie(name)) {
    //createCookie(name, '', -1, path, domain);
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/";
  }
}

module.exports = {
  COOKIE: cookie,
  createCookie: createCookie,
  getCookie: getCookie,
  deleteCookie: deleteCookie
};
