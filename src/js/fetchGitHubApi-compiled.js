"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var initData = {
  events: []
};
var gitHubData = function gitHubData(user) {
  axios.get("https://api.github.com/users/" + user + "/events").then(function (res) {
    return initData = _extends({}, initData, {
      events: [].concat(_toConsumableArray(res.data.filter(function (event) {
        return event.payload.commits;
      }).map(function (event) {
        return event;
      })))
    });
  }).catch(function (err) {
    return console.error(err);
  });
};
