
export const state = () => ({
    // token: null,
    token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJrNjFZUWRKNko3bGRPR3BKIiwic3ViZSI6ImRocnV2LnNoYXJtYUBxc3N0ZWNobm9zb2Z0LmNvbSIsInN1YnMiOiJBQ1RJVkUiLCJzdWJiIjoiTzNHV3BtYms1ZXpKbjRLUiIsInN1YmJzIjoiQ0xJRU5UIiwic3ViciI6IkFETUlOIiwic3ViYyI6IkNhbmFkYSIsImlhdCI6MTY0MzYwOTUxMDk1MSwiZXhwIjoxNjUxMzg1NTEwOTUxLCJqdGkiOiIxNDU4Nzg4MC1kNWQ0LTQ3YzYtOWM5ZC05MGYwMTg3NzEwNjMifQ.3g55PEAJ__aW5izyAywk7DXL9I6XWhb4fPV-SI-4sK8'
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
  