export const sortTaskUtil = (data, field, order) => {

    let sortedTask = data

    switch (field) {
        case 'name':
            if (order == "asc") {
                sortedTask.sort((a, b) => a.title.localeCompare(b.title))
            } else {
                sortedTask.sort((a, b) => b.title.localeCompare(a.title))
            }
            break;

        case 'status':
            if (order == "asc") {
                sortedTask.sort((a, b) => a.status.text.localeCompare(b.status.text));
            } else {
                sortedTask.sort((a, b) => b.status.text.localeCompare(a.status.text));
            }
            break;

        case 'priority':
            if (order == "asc") {
                sortedTask.sort((a, b) => a.priority.text.localeCompare(b.priority.text));
            } else {
                sortedTask.sort((a, b) => b.priority.text.localeCompare(a.priority.text));
            }
            break;

        case 'owner':
            if (order == "asc") {
                sortedTask.sort((a, b) => a.user.firstName.localeCompare(b.user.firstName));
            } else {
                sortedTask.sort((a, b) => b.user.firstName.localeCompare(a.user.firstName));
            }
            break;

        case 'dueDate':
            if (order == "asc") {
                sortedTask.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
            } else {
                sortedTask.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
            }
            break;

        default:
            return sortedTask;
    }

    return sortedTask

}