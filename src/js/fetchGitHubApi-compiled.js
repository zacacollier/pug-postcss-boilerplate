'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var initData = {
  events: [],
  statsResponse: []
};
function gitHubData(user) {
  axios.get('https://api.github.com/users/' + user + '/events').then(function (res) {
    return initData = _extends({}, initData, {
      events: [].concat(_toConsumableArray(res.data.filter(function (event) {
        return event.payload.commits;
      }).map(function (event) {
        return event;
      })))
    });
  }).then(function () {
    return localStorage.setItem('initData', initData);
  }).catch(function (err) {
    return console.error(err);
  });
}
// TODO: cache in localStorage
// function fetchGitHubCommits (data = initData) {
//   return data.events.map(event => {
//     return event.payload.commits.forEach(commit => {
//        axios.get(commit.url)
//         .then(res => {
//           initData = {
//             ...initData,
//             statsResponse: [...initData.statsResponse, res.stats]
//           }
//         })
//     })
//   })
// }

function fetchGitHubCommits() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initData;

  axios.all(data.events.map(function (event) {
    return event.payload.commits;
  })).then(function (res) {
    return initData = _extends({}, initData, {
      statsResponse: res
    });
  }).catch(function (err) {
    return console.error(err);
  });
}
