  export const state = () => ({
    favoriteTasks: [],
    favoriteProjects: []
  });

  export const getters = {
    getFavTasks(state) {
      return state.favoriteTasks;
    },

    getFavProjects(state) {
      return state.favoriteProjects;
    }
  };

  export const mutations = {
    fetchFavTasks(state, payload) {
      // console.log("fav task",payload)
      let favTask = payload.map(p => p.task)
      // let sorted = favTask.sort((a, b) => a.order - b.order)
      state.favoriteTasks = favTask;
      // state.favoriteTasks = payload
    },

    fetchFavProjects(state, payload) {
      // console.log('fav project',payload)
      let favProj = payload.map(p => p.projects)
      state.favoriteProjects = favProj;
    },

  };

  export const actions = {
    async fetchFavTasks(ctx) {
      const res = await this.$axios.get("/task/user/favorites", {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      })
      // console.info(res)
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
      // console.info(fav)
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
