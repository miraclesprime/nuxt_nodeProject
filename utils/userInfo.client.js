export default ({ store }, inject) => {
  inject('userInfo', (userId) => {
    // console.log("from userInfo->", store.state.user.teamMembers)
    const team = store.state.user.teamMembers
    if (team.length > 0 && userId) {
      let u = team.find((m) => m.Id == userId)
      console.log(u)
      if (u) {
        return {...u, Name: `${u.FirstName} ${u.LastName}`}
      }
      return { ...u, Name: ''}
    } else {
      return { Name: "no user found" }
    }
    // return { id: "adsfpoag", name: "Vishwajeet Mandal", email: "vishwajeet.mandal@qsstechnosoft.com", pic: "", jobTitle: "Senior Software Developer" }
  })
}
