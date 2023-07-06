
export const strict = false;

export const state = () => ({
  todos: [],
  initialData:[]
});

export const getters = {

  getAllTodos(state) {
    return state.todos;
  },

};

export const mutations = {

  fetchTodos(state, payload) {
    state.todos = payload.sort((a, b) => a.uOrder - b.uOrder)
  },

  createTodo(state, payload) {
    let ns = payload
    ns.tasks = []
    state.todos.unshift(ns);
  },

  setTodos(state, payload) {
    state.todos = payload;
  },
  setInitialTodos(state,payload){
    let arr = JSON.parse(JSON.stringify(payload));
    arr.forEach(function(todo) {
      todo["tasks"] = todo.tasks?.sort((a, b) => a.tOrder - b.tOrder);
    })
    state.initialData=arr
  },
 
  groupMyTasks(state, payload) {
    let arr = JSON.parse(JSON.stringify(state.todos));
    let arrIndex;
    let _tasks;

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
    if(payload.sName=="dueDate"){
          arrIndex = "dueDate";
          let items = [];
          arr.sort((a,b)=>{
            if (a.dueDate === null && b.dueDate !== null) {
              return 1;
            }
            if (b.dueDate === null && a.dueDate !== null) {
              return -1;
            }
       
            return new Date(a.dueDate) - new Date(b.dueDate);
          })
          arr.forEach((ele) => {
            let title
            if(ele.dueDate!==null){
              title =this.$CalDate(ele.dueDate)
            }
            else {
              title="Unassigned"
            }
            if (!items.includes(title)) items.push(title);
          });
          _tasks = items.map((item, idx) => {
            return {
              id: idx,
              title: item !== null ? item : "Unassigned",
              tasks: arr.filter(
                (_item) =>
                  (_item[arrIndex] !== null ? this.$CalDate(_item[arrIndex]) : null) ===
                  (item === "Unassigned" ? null : item)
              ),
            };
          });
    }
    if (payload.sName == "project") {
      arrIndex = "project";
      let items = [];
      arr.sort((a,b)=>{
        return a.id - b.id;
      }) 
      arr.forEach((ele) => {
        const title = ele.project?.[0]?.project?.title ?? "Unassigned";
        if (!items.includes(title))  items.push(title);
      });
      _tasks = items.map((item, idx) => {
        return {
          id: idx,
          title: item !== null ? item : "Unassigned",
          tasks: arr.filter(
            (_item) =>
              (_item[arrIndex].length>0? _item[arrIndex][0]?.project?.title : null) ===
              (item === "Unassigned" ? null : item)
          ),
        };
      });
    }
    if (payload.sName == "priority") {
      arrIndex = "priority";
      let items = [];

      arr.sort((a,b)=>{
        if (a.priorityId === null && b.priorityId !== null) {
          return 1;
        }
        if (b.priorityId === null && a.priorityId !== null) {
          return -1;
        }
        if (a.priorityId === null && b.priorityId === null) {
          return 0;
        }
        return a.priorityId - b.priorityId;
      })
 
      arr.forEach((ele) => {
        let title = ele.priority !== null && ele.priority?.text !== null ? ele.priority.text.charAt(0).toUpperCase()+ele.priority.text.slice(1) : "Unassigned"
         if (!items.includes(title)) items.push(title);
       });
       _tasks = items.map((item, idx) => {
         return {
           id: idx,
           title: item !== null ? item : "Unassigned",
           tasks: arr.filter(
             (_item) =>
               (_item[arrIndex] !== null&&_item[arrIndex]?.text !== null ?  _item[arrIndex].text.charAt(0).toUpperCase()+_item[arrIndex].text.slice(1) : null) ===
               (item === "Unassigned" ? null : item)
           ),
         };
       });
    }
    if (payload.sName == "department") {
      arrIndex = "department";
      let items = [];
      arr.sort((a,b)=>{
        if (a.departmentId === null && b.departmentId !== null) {
          return 1;
        }
        if (b.departmentId === null && a.departmentId !== null) {
          return -1;
        }
        if (a.departmentId === null && b.departmentId === null) {
          return 0;
        }
        return a.departmentId - b.departmentId;
      })  
      

      arr.forEach((ele) => {
        let title =
          ele.departmentId !== null ? ele.department.title : "Unassigned";
        if (!items.includes(title)) items.push(title);
      });
      _tasks = items.map((item, idx) => {
        return {
          id: idx,
          title: item !== null ? item : "Unassigned",
          tasks: arr.filter(
            (_item) =>
              (_item[arrIndex] !== null ? _item[arrIndex].title : null) ===
              (item === "Unassigned" ? null : item)
          ),
        };
      });
    }
    if (payload.sName == "assignee") {
      arrIndex = "project";
      let items = [];
      arr.sort((a,b)=>{
        return a.id - b.id;
      }) 
      arr.forEach((ele) => {

        let title=ele.project?.[0]?.project?.userId??"Unassigned"
        payload.team.forEach((item)=>{
          if(item.Id==title){
            title=item.FirstName + ' ' + item.LastName
          }
          
        })
        if (!items.includes(title)) items.push(title);
      });
      

      _tasks = items.map((item, idx) => {
        return {
          id: idx,
          title: item !== null ? item : "Unassigned",
          tasks:
          arr.filter((_items)=>{
            let teamName=_items.project?.[0]?.project?.userId??"Unassigned"
            payload.team.forEach((item)=>{
              if(item.Id==teamName){
                teamName=item.FirstName + ' ' + item.LastName
              }   
            })
            if(teamName===item){
              return item
            }
        })
        };
      });
    }
    if (payload.sName == "status") {
      arrIndex = "status";
      let items = [];
      
        arr.sort((a,b)=>{
        if (a.statusId === null && b.statusId !== null) {
          return 1;
        }
        if (b.statusId === null && a.statusId !== null) {
          return -1;
        }
        if (a.statusId === null && b.statusId === null) {
          return 0;
        }
        return a.statusId - b.statusId;
      })   
      arr.forEach((ele) => {
        let title = ele.statusId !== null ? ele.status.text : "Unassigned";
        if (!items.includes(title)) items.push(title);
      });
      _tasks = items.map((item, idx) => {
        return {
          id: idx,
          title: item !== null ? item : "Unassigned",
          tasks: arr.filter(
            (_item) =>
              (_item[arrIndex] !== null ? _item[arrIndex].text : null) ===
              (item === "Unassigned" ? null : item)
          ),
        };
      });
    }
    state.todos = _tasks;
    if(payload.sName=="" || payload.sName=="default"){
      state.todos=state.initialData
    }
  },
};

export const actions = {

  async fetchTodos(ctx, payload) {
    const res = await this.$axios.$get('/todo/all', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, 'Filter': payload.filter ? payload.filter : 'all' }
    });

    if (res.statusCode == 200) {
      ctx.commit('fetchTodos', res.data);
      ctx.commit('setInitialTodos', res.data);
      if(payload.sName&&payload.sName!=="default"){
        const data={
          sName:payload.sName,
          team:ctx.rootState.user.teamMembers
        }
        ctx.commit('groupMyTasks',data)
      }
    }

    return res
  },


  setTodos(ctx, payload) {
    ctx.commit('setTodos', payload)
  },

  setInitialTodos(ctx, payload) {
    ctx.commit('setInitialTodos', payload)
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
