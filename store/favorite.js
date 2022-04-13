  export const state = () => ({
    favoriteTasks: [],
    favoriteProjects: []
  });
  
  export const getters = {
    getFavTasks(state){
        return state.favoriteTasks;
    },

    getFavProjects(state) {
        return state.favoriteProjects;
    }
  };
  
  export const mutations = {
    fetchFavTasks(state, payload){
        state.favoriteTasks = payload;
    },

    fetchFavProjects(state, payload) {
        state.favoriteProjects = payload;
    },

    sortFavorites(state, payload) {
        
    }
  };
  
  export const actions = {
    async fetchFavTasks(ctx){
        const res = await this.$axios.get("/task/user/favorites", {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
        })
        if (res.data.statusCode == 200) {
          ctx.commit("fetchFavTasks", res.data.data)
        }
    },

    async fetchFavProjects(ctx) {
        const fav = await this.$axios.$get("/project/user/favorites", {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
                }
            })
            if (fav.statusCode == 200) {
            ctx.commit("fetchFavProjects", fav.data)
        } else {
            ctx.commit("fetchFavProjects", [])
        }
    },

    sortFavorites(ctx, payload) {
        ctx.commit('sortFavorites', payload)
    },

  };
  