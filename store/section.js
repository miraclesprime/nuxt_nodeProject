
export const state = () => ({
    sections: [],
    token: null
  });
  
  export const mutations = {
    
    fetchSections(state, payload) {
      state.sections = payload;
    },

    createSection(state, payload) {
      state.sections.push(payload)
    }

  };
  
  export const getters = {
    
    getAllSections(state) {
      return state.sections;
    }

  };
  
  export const actions = {
    async fetchSections(ctx) {
      const res = await this.$axios.$get('/section', {
        headers: {'Authorization': `Bearer ${ctx.rootState.token.token}`}
      });
      ctx.commit('fetchSections', res.data);
    },

    async createSection(ctx) {
      const res = await this.$axios.$post('/section');
      ctx.commit('createSection', res.data)
    }
  };
  