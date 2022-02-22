export default function ({ $axios, app }, inject) {
    inject('userInfo', async(value) =>  {
        if (value) {
            const res = await $axios.get(`/user/get-details/${value}`);
            let name = res.data[0].FirstName + ' ' + res.data[0].LastName;
            return name
        }
    }) 
}