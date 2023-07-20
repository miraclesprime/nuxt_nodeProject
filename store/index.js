export const state = () => ({
    token: null
})

export const mutations = {
    setToken(state, payload) {
        state.token = payload;
    }
}

export const getters = {
    getToken(state) {
        return state.token;
    }
  };

export const actions = {
    nuxtServerInit ({ commit }, { store, route, req, res, app, beforeNuxtRender }) {
        
        let token = app.$cookies.get('b_ssojwt')
        commit('setToken', token);
        // console.log("In Nuxt SERVER INIT >>>>>",token) 

        //   beforeNuxtRender(({ nuxtState }) => {
            
        //   })
      }
  }
