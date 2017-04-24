let initData = {
  events: [],
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
function fetchGitHubCommits (data = localStorage.getItem('initData')) {
  const parseInitData = JSON.parse(data)
  return parseInitData.events.map(event => {
    return event.payload.commits.map(commit => {
       return axios.get(commit.url)
         .then(res => initData.events = initData.events.map(event => {
           return {
             ...event,
             stats: res.body.stats
           }
         })
      )
    })
  })
}
