export const strict = false;

export const state = () => ({
  sections: [],
  projectSections: [],
});

export const getters = {

  getAllSections(state) {
    return state.sections;
  },

  getProjectSections(state) {
    return state.projectSections
  }

};

export const mutations = {

  fetchSections(state, payload) {
    state.sections = payload;
  },

  fetchProjectSections(state, payload){
    state.projectSections = payload
  },

  createSection(state, payload) {
    let ns = payload
    ns.tasks = []
    state.projectSections.unshift(ns)
  },

  setSections(state, payload) {
    state.sections = payload;
  },

  setSortType(state, payload) {
    state.sortType = payload
  },


  addTaskToSection(state, payload) {
    state.sections.forEach((s) => {
      if (s.id == payload.sectionId) {
        s.tasks.push(payload)
      }
    })
  },
  groupSectionProject(state, payload) {
    let arr = JSON.parse(JSON.stringify(state.projectSections));
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
        return b.priorityId - a.priorityId;
      })

      arr.forEach((ele) => {
        let title = ele.priorityId !== null ? ele.priority.text : "Unassigned";
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
      arrIndex = "user";
      let items = [];
      arr.sort((a,b)=>{
        return a.id - b.id;
      })  

      arr.forEach((ele) => {
        let title =
          ele.user !== null&&ele.user!==undefined 
            ? ele.user.firstName + " " + ele.user.lastName
            : "Unassigned";
        if (!items.includes(title)) items.push(title);
      });
      _tasks = items.map((item, idx) => {
        return {
          id: idx,
          title: item !== null ? item : "Unassigned",
          tasks: arr.filter(
            (_item) =>
              (_item[arrIndex] !== null&&_item[arrIndex] !== undefined
                ? _item[arrIndex].firstName + " " + _item[arrIndex].lastName
                : null) === (item === "Unassigned" ? null : item)
          ),
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
    state.projectSections = _tasks;
  },

};

export const actions = {
  
  async fetchSections(ctx) {
    const res = await this.$axios.$get('/section', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
    });

    let d = res.data;

    for (let i = 0; i < d.length; i++) {
      d[i].tasks.sort((a, b) => {
        return a.order - b.order;
      })
    }

    ctx.commit('fetchSections', d);
  },

  async fetchProjectSections(ctx, payload) {
    const res = await this.$axios.$get('/section/project/' + payload.projectId, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, 'Filter': payload.filter || 'all' }
    });

    if (res.statusCode == 200) {
      ctx.commit('fetchProjectSections', res.data);
      if(payload.sName&&payload.sName!=="default"){
        const data={
          sName:payload.sName,
        }
        ctx.commit('groupSectionProject',data)
      }
      return res.data
    }
  },

  setSections(ctx, payload) {
    ctx.commit('setSections', payload)
  },

  setSortType(ctx, payload) {
    ctx.commit('setSortType', payload)
  },

  async createSection(ctx, payload) {
    const res = await this.$axios.$post('/section', payload, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
    });
    ctx.commit('createSection', res.data)
    return res
  },

  async renameSection(ctx, payload){
    const res = await this.$axios.$put("/section", payload, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
    })
    return res
  },

  async deleteSection(ctx, payload){
   const res = await this.$axios.$delete("/section", {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` },
      data: { id: payload.id, projectId: payload.projectId, text: `section '${payload.title}' deleted` },
    })
    
    return res 
  },

};
