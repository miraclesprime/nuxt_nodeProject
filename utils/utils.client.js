export default ({ store, app, context }, inject) => {
  inject('isFavTask', (idx) => {
    const favtasks = store.state.task.favTasks
    let fav = favtasks.some(t => t.id == idx)
    if (fav) {
      return { variant: "orange", text: "Remove favorite", status: true }
    } else {
      return { variant: "gray5", text: "Add to favorites", status: false }
    }
  });
  inject('isFavProject', (idx) => {
    const favprojects = store.state.project.favProjects
    let fav = favprojects.some(p => p.projectId == idx)
    if (fav) {
      return { variant: "orange", text: "Remove favorite", status: true }
    } else {
      return { variant: "gray5", text: "Add to favorites", status: false }
    }
  });

  inject('donotCloseSidebar', (classes) => {
    const cl = ['editable-input', 'user-info', 'date-info']
    let out = true
    cl.forEach((c) => {
      let cd = classes.contains(c)
      if (cd) {
        out = false
        return false
      }
    });
    return out
  })
}
