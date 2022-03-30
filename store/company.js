export const state = () => ({
  companies: [],
  companyMembers: [],
  // company: {},
});

export const getters = {

  getAllCompanies(state) {
    return state.companies;
  },
  getCompanyMembers(state){
    return state.companyMembers
  }
  /*getSingleCompany(state) {
    return state.company
  }*/

};

export const mutations = {

  fetchCompanies(state, payload) {
    state.companies = payload;
  },

  fetchCompanyMembers(state, payload) {
    state.companyMembers = payload
  }
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
  async fetchCompanyMembers(ctx, companyId) {
    const res = await this.$axios.$get("/company/"+ companyId +"/members/", {
      headers: { 'Authorization': `Bearer ${ctx.rootState.token.token}` }
    })
    if (res.statusCode == 200) {
      // console.log(res.data)
      let cu = res.data.map(u=> u.user )
      ctx.commit("fetchCompanyMembers", cu)
    } else {
      console.log(res);
    }
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
