export const state = () => ({
    inbox: null,
    singleInbox: {},
    msgKey: {msgId: null, key: 0}
  });
  
  export const getters = {

    getSingleInbox(state) {
        return state.singleInbox;
    },

    getInbox(state) {
        return state.inbox;
    },

    getKey(state) {
        return state.msgKey;
    }
  };

  export const mutations = {
    createInboxEntry(state, payload) {
        let ii = state.inbox.findIndex(inb => inb.historyId == payload.historyId )
        if (ii >= 0) {
            state.inbox[ii] = payload
        } else {
            state.inbox.push(payload)
        }
    },

    setSingleInbox(state, payload) {
        state.singleInbox = payload;
    },

    setInbox(state, payload) {
        state.inbox = payload;
    },

    setKey(state, payload) {
        state.msgKey = payload;
    }
  };
  
  export const actions = {

    async createInboxEntry(ctx, payload) {
        const res = await this.$axios.post('/inbox', payload, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
        });

        if (res.data.statusCode == 200) {
          ctx.commit('createInboxEntry', res.data.data);
        }
        return res.data
    },

    async fetchInboxEntry(ctx, payload) {
        const res = await this.$axios.get(`/inbox/${payload.id}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
        });
    
        if (res.statusCode == 200) {
          ctx.commit('setSingleInbox', res.data);
        }
        return res.data
    },

    async fetchInboxEntries(ctx, payload) {
        const res = await this.$axios.get(`/inbox`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
        });

        if (res.data.statusCode == 200) {
          ctx.commit('setInbox', res.data.data);
        }
        return res.data
    },

    setKey(ctx, payload) {
      ctx.commit('setKey', payload);
      return payload;
    }
  };
  