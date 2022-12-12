export const state = () => ({
    inbox: null,
    singleInbox: {}
  });
  
  export const mutations = {

    createInboxEntry(state, payload) {
        state.inbox.push(payload)
    },

    setSingleInbox(state, payload) {
        state.singleInbox = payload;
    },

    setInbox(state, payload) {
        state.inbox = payload;
    }
  };
  
  export const getters = {

    getSingleInbox(state) {
        return state.singleInbox;
    },

    getInbox(state) {
        return state.inbox;
    }
  };
  
  export const actions = {

    async createInboxEntry(ctx, payload) {
        const res = await this.$axios.$post('/inbox', payload, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
          });
          // console.log("create task response =>", res)
      
          if (res.statusCode == 200) {
            ctx.commit('createInboxEntry', res.data);
          }
          return res.data
    },

    async getInboxEntry(ctx, payload) {
        const res = await this.$axios.$post(`/inbox/${payload.id}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
          });
          // console.log("create task response =>", res)
      
          if (res.statusCode == 200) {
            ctx.commit('setSingleInbox', res.data);
          }
          return res.data
    },

    async getInboxEntries(ctx, payload) {
        const res = await this.$axios.$post(`/inbox`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
          });
          // console.log("create task response =>", res)
      
          if (res.statusCode == 200) {
            ctx.commit('setInbox', res.data);
          }
          return res.data
    }
  };
  