export const state = () => ({
  companies: [],
  companyMembers: [],
  companyTasks: []
});

export const getters = {

  getAllCompanies(state) {
    return state.companies;
  },
  getCompanyMembers(state){
    return state.companyMembers
  },
  getCompanyTasks(state) {
    return state.companyTasks;
  }

};

export const mutations = {

  fetchCompanies(state, payload) {
    state.companies = payload;
  },

  fetchCompanyMembers(state, payload) {
    state.companyMembers = payload;
  },
  setCompanyTasks(state, payload) {
    state.companyTasks = payload;
  }

};

export const actions = {
  async fetchCompanies(ctx) {
    const res = await this.$axios.$get('/company', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem("accessToken")}` }
    });
    ctx.commit('fetchCompanies', res.data);
  },
  async fetchCompanyMembers(ctx, companyId) {
    const res = await this.$axios.$get("/company/"+ companyId +"/members/", {
      headers: { 'Authorization': `Bearer ${localStorage.getItem("accessToken")}` }
    })
    if (res.statusCode == 200) {
      // console.log(res.data)
      let cu = res.data.map(u=> u.user )
      ctx.commit("fetchCompanyMembers", cu)
    } else {
      console.log(res);
    }
  },
  async setCompanyTasks(ctx, payload) {
    const res = await this.$axios.$get(`company/${payload.companyId}/tasks`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, 'Filter': payload.filter || 'all' }
    });

    if (res.data) {
      ctx.commit('setCompanyTasks', res.data);
      return res.data
    }
  }
};
