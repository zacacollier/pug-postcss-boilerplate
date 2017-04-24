let initData = {
  events: [],
}
const gitHubData = (user) => {
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
  .catch(err => console.error(err))
}
