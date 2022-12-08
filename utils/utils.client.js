export function isFavProject({store}, idx) {
  const favtasks = store.state.task.favTasks
  let fav = favtasks.some(t => t.id == idx)
  if (fav) {
    return { variant: "orange", text: "Remove favorite", status: true }
  } else {
    return { variant: "gray5", text: "Add to favorites", status: false }
  }
};

/*export default ({ store }, inject) => {
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
    // console.info(favprojects)
    let fav = favprojects.some(p => p.projectId == idx)
    if (fav) {
      return { variant: "orange", text: "Remove favorite", status: true }
    } else {
      return { variant: "gray5", text: "Add to favorites", status: false }
    }
  });
}
*/
