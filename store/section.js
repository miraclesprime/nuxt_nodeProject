export const strict = false;

export const state = () => ({
  sections: [],
  projectSections: [],
  initialSections:[]
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
    let sorted = payload.map((s) => {
      let t = s.tasks.sort((a, b) => a.order - b.order);
      s.tasks = t;
      return s;
    });
    state.initialSections=sorted
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
  getFilterSections(state,payload){
    console.log(payload)
    let arr=JSON.parse(JSON.stringify(state.initialSections));
    arr=arr.filter((item)=>{
      if(item.tasks.length>0){
        return item
      }
    })

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
        return ele.tasks.length > 0; // Return true only if ele.tasks has at least one remaining task
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
        return ele.tasks.length > 0; // Return true only if ele.tasks has at least one remaining task
      });
     }    
   }
   if(payload.filter=="all")
   {
     if(payload.groupBy!=""){
       arr=this.$groupBy(arr,payload.groupBy)
     }  
     else{
      arr=state.initialSections
     } 
   }
  state.projectSections=arr
  },
  groupSectionProject(state, payload) {
    let arr = JSON.parse(JSON.stringify(state.projectSections));

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
        state.projectSections=state.initialSections
      }
      else {
      state.projectSections=this.$groupBy(arr,payload.sName)
      }
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
