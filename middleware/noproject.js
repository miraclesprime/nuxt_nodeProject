import axios from 'axios'
export default function({ app, $axios, redirect, error, route }) {
  // console.log('no project -> route', route)
  // console.log(route.path.indexOf('/projects/'))
  const token = app.$cookies.get('b_ssojwt')
  if (route.path.indexOf('/projects/') == 0 && route.params?.id) {
    getProject(route.params.id, token).then(r => {
      console.log(r)

      // redirect("/notfound")
      if (r) {
        redirect("/projects/"+route.params.id)
      } else {
        redirect("/notfound")
      }
    })
  }

  async function getProject(id, token) {

    const p = await axios.get(`http://localhost:9000/project/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })

    console.log("project->", p.data.data)
    if (p.data.data.isDeleted) {
      return "false"
    } else {
      return "true"
    }
  }
}
