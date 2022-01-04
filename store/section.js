export const state = () => ({
    sections: []
  });
  
  export const mutations = {
    
    fetchSections(state, payload) {
      state.sections = payload;
    }

  };
  
  export const getters = {
    
    tableFields(state) {
      return state.TABLE_FIELDS
    },
    
    getAllSections(state) {
      return state.sections;
    }

  };
  
  export const actions = {
    async fetchSections(ctx) {
      const res = await this.$axios.$get('/section');
      ctx.commit('fetchSections', res.data);
    }
  };
  