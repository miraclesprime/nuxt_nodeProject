export default ({ store }, inject) => {
  inject('userInfo', (userId) => {
    const team = store.state.user.teamMembers
    if (team.length > 0 && userId) {
      let u = team.find((m) => m.Id == userId)
      if (u) {
        return {...u, Name: `${u.FirstName} ${u.LastName}`}
      }
      return { ...u, Name: ''}
    } else {
      return { Name: "no user found" }
    }
  })
}
