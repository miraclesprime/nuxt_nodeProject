
export const state = () => ({
    // token: null,
    token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJrNjFZUWRKNko3bGRPR3BKIiwic3ViZSI6ImRocnV2LnNoYXJtYUBxc3N0ZWNobm9zb2Z0LmNvbSIsInN1YnMiOiJBQ1RJVkUiLCJzdWJiIjoiTzNHV3BtYms1ZXpKbjRLUiIsInN1YmJzIjoiQ0xJRU5UIiwic3ViciI6IkFETUlOIiwic3ViYyI6IkNhbmFkYSIsImlhdCI6MTY0MzgwNzc5ODcxNSwiZXhwIjoxNjUxNTgzNzk4NzE1LCJqdGkiOiIyZWEzMDkzZC1jY2RmLTQ1YmYtYTA2Mi1kMjZlYjI4MDk5NDYifQ.BTYS4nYl20eX0KlPMJiLzI_MWJTqI9IGUSn1yyq06q8'
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
  