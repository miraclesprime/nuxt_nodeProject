export const state = () => ({
    companies: []
  });
  
  export const mutations = {
    
    fetchCompanies(state, payload) {
      state.companies = payload;
    }

  };
  
  export const getters = {

    getAllCompanies(state) {
      return state.companies;
    }

  };
  
  export const actions = {
    async fetchCompanies(ctx) {
      const res = await this.$axios.$get('/company');
      ctx.commit('fetchCompanies', res.data);
    }
  };
  