export const state = () => ({
  // allusers: []
})

export const mutations = {
  /*setusers(state, payload) {
    state.allusers = payload
  }*/
}

export const actions = {
  nuxtServerInit(store, context) {
  	console.log('nuxtServerInit fired')
  	// let u = JSON.parse(localStorage.getItem("user"))
    /*this.$axios.get(`${process.env.ORG_API_URL}/${u.subb}/users`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
      }
    }).then(res => {
      console.log(res.data)
      // context.commit("setTeamMembers", members)

    }).catch(err => {
      console.log(err)
    })*/
  }
}
