/* during development:
 * issue babel-cli with the --watch flag, and leave it running in a separate terminal window / tmux pane:
 * babel src/js/fetchGitHubApi.js --watch --out-file src/js/fetchGitHubApi-compiled.js --presets es2015,stage-2,react
 */
let initData = {
  events: [],
  statsResponse: []
}
function gitHubData (user) {
  axios.get(`https://api.github.com/users/${user}/events`)
      .then(res => (
          initData = {
            ...initData,
            events:
              [
                ...res.data
                  .filter(event => event.payload.commits)
                  .map(event => event),
              ]
          }
        )
      )
      .then(() => localStorage.setItem('initData', initData))
      .catch(err => console.error(err));
}

// TODO: cache data somehow (localStorage perhaps)
function fetchGitHubCommits(data = initData) {
  axios.all(data.events.map(event => event.payload.commits.map(commit => axios.get(commit.url)
    .then(res => initData = {
      ...initData,
      statsResponse: [
        ...initData.statsResponse,
        res.data
      ]
     }
    )
  )))
  .catch(err => console.error(err))
}
