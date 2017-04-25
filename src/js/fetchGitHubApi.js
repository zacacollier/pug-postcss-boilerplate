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
// TODO: cache in localStorage
function fetchGitHubCommits (data = initData) {
  return data.events.map(event => {
    return event.payload.commits.forEach(commit => {
       axios.get(commit.url)
        .then(res => {
          initData = {
            ...initData,
            statsResponse: [...initData.statsResponse, res.stats]
          }
        })
    })
  })
}
