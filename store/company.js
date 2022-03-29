export const state = () => ({
  companies: [],
  // company: {},
});

export const getters = {

  getAllCompanies(state) {
    return state.companies;
  },
  /*getSingleCompany(state) {
    return state.company
  }*/

};

export const mutations = {

  fetchCompanies(state, payload) {
    state.companies = payload;
  },
  /*fetchSingleCompany(state, payload) {
    state.company = payload
  }*/

};

export const actions = {
  async fetchCompanies(ctx) {
    const res = await this.$axios.$get('/company', {
      headers: { 'Authorization': `Bearer ${ctx.rootState.token.token}` }
    });
    ctx.commit('fetchCompanies', res.data);
  },
  /*async fetchSingleCompany(ctx, payload) {
    const res = await this.$axios.$get("/company/" + payload, {
      headers: { 'Authorization': `Bearer ${ctx.rootState.token.token}` }
    })
    if (res.statusCode == 200) {
      ctx.commit("fetchSingleCompany", res.data)
    } else {
      console.log(res);
    }
  }*/
};
