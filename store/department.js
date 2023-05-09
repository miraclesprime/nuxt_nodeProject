export const strict = false;

export const state = () => ({
  departments: [],
  singleDepartment: {}
});

export const getters = {

  getAllDepartments(state) {
    let Depts = [{ label: "Choose department", value: null }]
    state.departments.map(d => {
      Depts.push({ label: d.title, value: d.id })
    })
    return Depts
  },

  getSingleDepartment(state) {
    return state.singleDepartment;
  }

};

export const mutations = {

  fetchDepartments(state, payload) {
    state.departments = payload;
  },

  fetchDepartmentDetail(state, payload) {
    state.singleDepartment = payload
  }

};

export const actions = {

  async fetchDepartments(ctx) {
    const res = await this.$axios.$get('/department', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
    });

    if (res.statusCode == 200) {
      ctx.commit('fetchDepartments', res.data);
    }

    return res
  },

  async fetchDepartmentDetail(ctx, payload) {
    const res = await this.$axios.$get(`/department/${payload.id}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
    });

    if (res.statusCode == 200) {
      ctx.commit('fetchDepartmentDetail', res.data);
    }

    return res
  },

};
