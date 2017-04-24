const initData = {
  events: [],
}
const fetchGitHub = (user) => {
  axios.get(`https://api.github.com/users/${user}/events`)
    .then(res => (
        {
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
  .catch(err => console.error(err))
}

module.exports = fetchGitHub;
