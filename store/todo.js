
export const strict = false;

export const state = () => ({
  todos: [],
  initialData:[],
  gridType:"list",
  groupByValue:"",

});

export const getters = {

  getAllTodos(state) {
    return state.todos;
  },
  getGridType(state){

    return state.gridType
  },
  getGroupBy (state) {
    return state.groupByValue 
  },
};

export const mutations = {
  setGroupBy(state,payload) {
    state.groupByValue=payload
  },
  fetchTodos(state, payload) {
    let arr = [...payload];
    arr.sort((a, b) => a.uOrder - b.uOrder);
    state.todos = arr;
    state.initialData = arr;
  },

  createTodo(state, payload) {
    let ns = payload
    ns.tasks = []
    state.todos.unshift(ns);
  },
  gridType(state,payload){
    state.gridType=payload.gridType
  },
  setTodos(state, payload) {
    state.todos = payload;
  },
  setInitialFetchTodos(state,payload){
    payload.sort((a, b) => a.uOrder - b.uOrder);
    state.initialData=payload
  },

  getFilterMyTasks(state,payload){
    let arr=JSON.parse(JSON.stringify(state.initialData));
    // arr=arr.filter((item)=>{
    //   if(item.tasks.length>0){
    //     return item
    //   }
    // })
    if(payload.groupBy!=""){ 
      if(arr[0].tasks){
        let _arr = [];
          arr.forEach((ele) => {
            _arr = _arr.concat(ele.tasks);
          });
          arr = _arr;
      }

    }

   if(payload.filter=="incomplete")
   {
    
     if(payload.groupBy!=""){
      arr=arr.filter((item)=>item.statusId!==5)
       arr=this.$groupBy(arr,payload.groupBy)
     }
     else {
       arr = arr.filter((ele) => {
        ele.tasks = ele.tasks.filter((item) => item.statusId != 5);
        return ele.tasks
        // return ele.tasks.length > 0; // Return true only if ele.tasks has at least one remaining task
      });
     }  
   }

   if(payload.filter=="complete")
   {
     if(payload.groupBy!=""){
      arr=arr.filter((item)=>item.statusId==5)
       arr=this.$groupBy(arr,payload.groupBy)
     }
     else {
          arr = arr.filter((ele) => {
        ele.tasks = ele.tasks.filter((item) => item.statusId == 5);
        return ele.tasks
        // return ele.tasks.length > 0; // Return true only if ele.tasks has at least one remaining task
      });
     }    
   }
   if(payload.filter=="all")
   {
     if(payload.groupBy!=""){
       arr=this.$groupBy(arr,payload.groupBy)
     }  
     else{
      arr=state.initialData
     } 
   }
  state.todos=arr
  },

  groupMyTasks(state, payload) {
    let arr = JSON.parse(JSON.stringify(state.todos));
    arr.filter((item)=>{
      if(item.tasks.length>0){
        return item
      }
    })

    if(arr[0].tasks){
      let _arr = [];
        arr.forEach((ele) => {
          _arr = _arr.concat(ele.tasks);
        });
        arr = _arr;
    }
    if(payload.sName==""){
      state.todos=state.initialData
    }
    else {
     state.todos=this.$groupBy(arr,payload.sName)
    }
  },
};

export const actions = {

  async fetchTodos(ctx, payload) {
    const res = await this.$axios.$get('/todo/all', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, 'Filter': payload.filter ? payload.filter : 'all' }
    });

    if (res.statusCode == 200) {
      ctx.commit('setTodos', res.data);
      if(payload.sName&&payload.sName!=="default"){
        const data={
          sName:payload.sName,
          team:ctx.rootState.user.teamMembers

        }
        ctx.commit('groupMyTasks', data)
      }
    }

    return res
  },
  async setMyfetchTodos(ctx, payload) {
      const res = await this.$axios.$get('/todo/all', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Filter': 'all'
        }
      });
      ctx.commit('setInitialFetchTodos',res.data)

  },


  setTodos(ctx, payload) {
    ctx.commit('setTodos', payload)
  },

  async createTodo(ctx, payload) {
    const res = await this.$axios.$post('/todo', payload, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
    });
    ctx.commit('createTodo', res.data)
    return res
  },

  async renameTodo(ctx, payload) {

    const res = await this.$axios.$put("/todo", payload, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
    })

    return res
  },

  async deleteTodo(ctx, payload) {
    const res = await this.$axios.$delete("/todo", {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` },
      data: { id: payload.id }
    })

    return res
  },

  sortTodoTasks(ctx, payload) {
    ctx.commit('sortTodoTasks', payload)
  }

};
