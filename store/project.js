export const state = () => ({
  projects: [],
  selectedProject: {},
  favProjects: [],
  projectMembers: [],
  projectComments: [],
  singleProjComment: {},
  projectHistory: [],
});

export const getters = {

  // get projects
  getAllProjects(state) {
    return state.projects;
  },

  // get single project detail
  getSingleProject(state) {
    return state.selectedProject;
  },

  // get project comments
  getProjectComments(state) {
    return state.projectComments;
  },

  getProjectMembers(state) {
    return state.projectMembers;
  },

  // get favorite projects
  getFavProjects(state) {
    let fav = []
    state.favProjects.map(f => {
      fav.push({ label: f.projects.title, icon: "folder-solid", id: f.projects.id })
    })
    return fav
  },

  getFavoriteProjects(state) {
    return state.favProjects;
  },

  getProjectHistory(state) {
    return state.projectHistory;
  }

};

export const mutations = {

  // To fetch all projects
  fetchProjects(state, payload) {
    state.projects = payload;
  },

  // To set a single project
  setSingleProject(state, currentProject) {
    state.selectedProject = currentProject;
  },

  // To create project
  createProject(state, payload) {
    state.projects.push(payload)
  },

  createProjectComment(state, payload) {
    state.projectComments.push(payload)
  },

  fetchProjectComments(state, payload) {
    state.projectComments = payload;
  },

  fetchSingleProjectComment(state, payload) {
    state.singleProjComment = payload
  },

  setFavProjects(state, payload) {
    state.favProjects = payload
  },

  fetchTeamMember(state, payload) {
    state.projectMembers = payload;
  },

  addMember(state, payload) {
    state.projectMembers.push(...payload)
  },

  sortProjects(state, payload) {

    // sort By Project Name
    if (payload.key == 'name' && payload.order == 'asc') {
      let arr = JSON.parse(JSON.stringify(state.projects));
      arr.sort((a, b) => a.title.localeCompare(b.title));
      state.projects = arr;
    }

    if (payload.key == 'name' && payload.order == 'desc') {
      let arr = JSON.parse(JSON.stringify(state.projects));
      arr.sort((a, b) => b.title.localeCompare(a.title));
      state.projects = arr;
    }

    // Sort By Project Owner Name
    if (payload.key == 'owner' && payload.order == 'asc') {
      let arr = JSON.parse(JSON.stringify(state.projects))
      arr.sort((a, b) => a.user.firstName.localeCompare(b.user.firstName));
      state.projects = arr;
    }

    if (payload.key == 'owner' && payload.order == 'desc') {
      let arr = JSON.parse(JSON.stringify(state.projects))
      arr.sort((a, b) => b.user.firstName.localeCompare(a.user.firstName));
      state.projects = arr;
    }

    // Sort By Status
    if (payload.key == 'status' && payload.order == 'asc') {

      let arr = JSON.parse(JSON.stringify(state.projects))
      let newArr = []

      for (let i = 0; i < arr.length; i++) {
        if (arr[i].statusId) {
          newArr.unshift(arr[i])
        } else {
          newArr.push(arr[i])
        }
      }

      newArr.sort((a, b) => {
        if (a.status && b.status) {
          return a.status.text.localeCompare(b.status.text)
        }
      });
      state.projects = newArr;

    }

    if (payload.key == 'status' && payload.order == 'desc') {

      let arr = JSON.parse(JSON.stringify(state.projects))
      let newArr = []

      for (let i = 0; i < arr.length; i++) {
        if (arr[i].statusId) {
          newArr.unshift(arr[i])
        } else {
          newArr.push(arr[i])
        }
      }

      newArr.sort((a, b) => {
        if (a.status && b.status) {
          return b.status.text.localeCompare(a.status.text)
        }
      });
      state.projects = newArr;

    }

    // Sort By Start Date
    if (payload.key == 'startDate' && payload.order == 'asc') {

      let arr = JSON.parse(JSON.stringify(state.projects))
      arr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      state.projects = arr;

    }

    if (payload.key == 'startDate' && payload.order == 'desc') {

      let arr = JSON.parse(JSON.stringify(state.projects))
      arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      state.projects = arr;

    }

    // Sort By Due Date
    if (payload.key == 'dueDate' && payload.order == 'asc') {

      let arr = JSON.parse(JSON.stringify(state.projects))
      let newArr = []

      for (let i = 0; i < arr.length; i++) {
        if (arr[i].dueDate) {
          newArr.unshift(arr[i])
        } else {
          newArr.push(arr[i])
        }
      }

      newArr.sort((a, b) => {
        if (a.dueDate && b.dueDate) {
          new Date(a.dueDate) - new Date(b.dueDate)
        }
      });
      state.projects = newArr;
    }

    if (payload.key == 'dueDate' && payload.order == 'desc') {

      let arr = JSON.parse(JSON.stringify(state.projects))
      let newArr = []

      for (let i = 0; i < arr.length; i++) {
        if (arr[i].dueDate) {
          newArr.unshift(arr[i])
        } else {
          newArr.push(arr[i])
        }
      }

      newArr.sort((a, b) => {
        if (a.dueDate && b.dueDate) {
          new Date(b.dueDate) - new Date(a.dueDate)
        }
      });
      state.projects = newArr;
    }

    // Sort By Priority
    if (payload.key == 'priority' && payload.order == 'asc') {
      let arr = JSON.parse(JSON.stringify(state.projects))
      let newArr = []

      for (let i = 0; i < arr.length; i++) {
        if (arr[i].priorityId) {
          newArr.unshift(arr[i])
        } else {
          newArr.push(arr[i])
        }
      }

      newArr.sort((a, b) => {
        if (a.priority && b.priority) {
          return a.priority.id - b.priority.id;
        }
      });
      state.projects = newArr;
    }

    if (payload.key == 'priority' && payload.order == 'desc') {
      let arr = JSON.parse(JSON.stringify(state.projects))
      let newArr = []

      for (let i = 0; i < arr.length; i++) {
        if (arr[i].priorityId) {
          newArr.unshift(arr[i])
        } else {
          newArr.push(arr[i])
        }
      }

      newArr.sort((a, b) => {
        if (a.priority && b.priority) {
          return b.priority.id - a.priority.id
        }
      });
      state.projects = newArr;
    }

  },

  setProjectHistory(state, payload){
    state.projectHistory = payload
  }

};

export const actions = {

  // for dispatch fetching projects
  async fetchProjects(ctx, payload) {
    const res = await this.$axios.$get(`/project/company/${JSON.parse(window.localStorage.getItem('user')).subb}`, {
      headers: {
        'Authorization': `Bearer ${window.localStorage.getItem('accessToken')}`,
        'Filter': payload ? payload : 'all'
      }
    });

    ctx.commit('fetchProjects', res.data);
  },

  async fetchSingleProject(ctx, payload) {
    const proj = await this.$axios.$get(`/project/${payload}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      }
    });
    if (proj.statusCode == 200) {
      ctx.commit('setSingleProject', proj.data);
    }
    return proj
  },

  // for dispatching setting single project object
  setSingleProject(ctx, payload) {
    ctx.commit('setSingleProject', payload)
  },

  // create project 
  async createProject(ctx, payload) {
    const res = await this.$axios.$post('/project', {
      user: payload.user,
      title: payload.title,
      statusId: null,
      description: null,
      startDate: null,
      dueDate: null,
      priority: null,
      budget: null,
      text: `new project created - "${payload.title}"`,
    }, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
    });
    if (res.statusCode == 200) {
      ctx.commit('createProject', res.data);
      return res
    } else {
      return res
    }
  },

  async deleteProject(ctx, payload) {
    const res = await this.$axios.$delete("/project", {
      headers: { "Authorization": `Bearer ${localStorage.getItem('accessToken')}` },
      data: { id: payload.id, project: payload, text: `project "${payload.title}" deleted` }
    })
    return res
    
  },

  async setFavProjects(ctx) {
    try {
      const fav = await this.$axios.$get("/project/user/favorites", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      if (fav.statusCode == 200) {
        ctx.commit("setFavProjects", fav.data)
      } else {
        ctx.commit("setFavProjects", [])
      }
    } catch (e) {
      console.log(e);
    }
  },

  async fetchTeamMember(ctx, payload) {

    await this.$axios.get(`/project/${payload.projectId}/members`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((res) => {
        let team = res.data.data.members;
        let data = team.map((el) => {
          if(ctx.state.selectedProject.userId == el.user.id) {
            el.isOwner = true
          } else {
            el.isOwner = false
          }
          return { id: el.user.id, name: el.user.firstName + " " + el.user.lastName, isOwner: el.isOwner };
        });
        ctx.commit('fetchTeamMember', data)
      })
      .catch((err) => {
        console.log(err);
      });
  },

  async addMember(ctx, payload) {

    let data;
    if (ctx.getters.getProjectMembers.length < 1) {
      data = payload.team;
    } else {
      data = payload.team.filter((el1) => {
        if (ctx.getters.getProjectMembers.some((el2) => el2.id != el1.id)) {
          return el1;
        }
      })
    }

    let names = data.map(n => `${n.firstName} ${n.lastName}`);

    const res = await this.$axios.post("/project/add-member", { projectId: payload.projectId, team: data, text: `${names.join(', ')} added to project` }, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
    })
    
    if(res.data.statusCode == 200) {
      ctx.commit('addMember', data);
    }

  },

  sortProjects(ctx, payload) {
    ctx.commit('sortProjects', payload)
  },

  async deleteMember(ctx, payload) {
    try {
      let m = await this.$axios.delete("/project/remove-member", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("accessToken"),
          "projectid": payload.projectId,
          "memberid": payload.member.id,
          "text": `${payload.member.name} removed from project`
        }
      })
      if (m.data.statusCode == 200) {
        ctx.dispatch("fetchTeamMember", { projectId: payload.projectId })
        return m.data.message
      } else {
        return m.data.message
      }
    } catch (e) {
      console.log(e);
    }
  },

  async addToFavorite(ctx, payload) {
    
    try {
      let fav = await this.$axios.post(`/project/${payload.id}/favorite`, {}, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("accessToken"),
        }
      })

      if(fav.data.statusCode == 200) {
        ctx.dispatch("setFavProjects")
        return fav.data.message
      } else {
        return fav.data.message
      }

    } catch(e) {
      console.log(e);
    }
  },

  async removeFromFavorite(ctx, payload) {
    try {
      let fav = await this.$axios.delete(`/project/${payload.id}/favorite`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("accessToken"),
        }
      })

      if(fav.data.statusCode == 200) {
        ctx.dispatch("setFavProjects")
        return fav.data.message
      } else {
        return fav.data.message
      }
    } catch(e) {
      console.log(e);
    }
  },

  async fetchProjectComments(ctx, payload) {
    try {
      let res = await this.$axios.get(`/project/${payload.id}/comments`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("accessToken"),
        }
      })

      if(res.data.statusCode == 200) {
        ctx.commit("fetchProjectComments", res.data.data)
      } 
      return res.data;
    } catch(e) {
      console.log(e);
    }
  },

  async createProjectComment(ctx, payload) {
    try {
      let trimComment = _.truncate(payload.comment.slice(3, -4), { length: 128 })
      const res = await this.$axios.$post(`/project/${payload.id}/comments`, {
        comment: payload.comment,
        text: `new comment ${trimComment}`
      }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      });
      if (res.statusCode == 200) {
        ctx.commit('createProjectComment', res.data);
        return res
      } else {
        return res
      }
    }catch(e) {
      console.log(e)
    }
  },

  async updateProjectComment(ctx, payload) {

    try {
      let trimComment = _.truncate(payload.comment.slice(3, -4), { length: 128 })
      const res = await this.$axios.$put(`/project/${payload.projectId}/comments/${payload.commentId}`,{
        comment: payload.comment,
        text: `updated comment ${trimComment}`,
      }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      });
      if (res.statusCode == 200) {
        ctx.dispatch("fetchProjectComments", {id: payload.projectId})
        return res
      } else {
        return res
      }

    }catch(e) {
      console.log(e)
    }
  },

  async deleteProjectComment(ctx, payload) {
    
    try {
      const res = await this.$axios.$delete(`/project/${payload.projectId}/comments/${payload.commentId}`,{
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'text': "deleted comment",
          "userid": payload.userId
        }
      });
      if (res.statusCode == 200) {
        ctx.dispatch("fetchProjectComments", {id: payload.projectId})
        return res
      } else {
        return res
      }

    }catch(e) {
      console.log(e)
    }
  },

  async fetchSingleProjectDetail(ctx, payload) {

    try {
      const res = await this.$axios.$get(`/project/${payload.projectId}/comments/${payload.commentId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      });
      if (res.statusCode == 200) {
        ctx.dispatch("fetchSingleProjectDetail", res.data)
        return res
      } else {
        return res
      }

    }catch(e) {
      console.log(e)
    }
  },

  async fetchHistory(ctx, payload) {
    try {
      const hist = await this.$axios.$get("/history/all", {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'obj': JSON.stringify( {"projectId": payload.id} )
        }
      })
      
      if (hist.statusCode == 200) {
        ctx.commit("setProjectHistory", hist.data)
      }
      return hist.data
    } catch(e) {
      console.log(e);
    }
  }

}
