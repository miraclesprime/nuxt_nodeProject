
export const state = () => ({
    // token: null,
    token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJrNjFZUWRKNko3bGRPR3BKIiwic3ViZSI6ImRocnV2LnNoYXJtYUBxc3N0ZWNobm9zb2Z0LmNvbSIsInN1YnMiOiJBQ1RJVkUiLCJzdWJiIjoiTzNHV3BtYms1ZXpKbjRLUiIsInN1YmJzIjoiQ0xJRU5UIiwic3ViciI6IlVTRVIiLCJzdWJjIjoiQ2FuYWRhIiwiaWF0IjoxNjQxOTY1NjM0MTY3LCJleHAiOjE2NDk3NDE2MzQxNjcsImp0aSI6ImU4ODZlYzM1LTFjMWMtNGIzNS05MmVlLTZlOGY1MjA2MzE0YiJ9.hPA2Qzi_oLyvmznfbVuSA8vR9h8pQw-KRdUD4sblFSY'
  });
  
  export const mutations = {
    setToken(state, payload) {
        state.token = payload;
    }
  };
  
  export const getters = {
    getToken(state) {
        return state.token;
    }
  };
  
  export const actions = {
    async setToken(ctx, payload){
        await ctx.commit('setToken', payload);
    }
  };
  