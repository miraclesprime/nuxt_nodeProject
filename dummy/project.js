export const PROJECT_FIELDS = [
    {
        key: "key",
        label: "#",
    },
    {
        key: "title",
        label: "Project name",
        width: '30%',
        header_icon: {
            icon: 'swap-vertical',
            event: 'file-title-sort',
            isActive: true
        }
    },
    {
        key: "userId",
        label: "Owner",
        header_icon: {
            icon: 'swap-vertical',
            event: 'file-owner-sort'
        }
    },
    {
        key: "status",
        label: "Status",
        header_icon: {
            icon: 'swap-vertical',
            event: 'file-status-sort',
        }
    },
    {
        key: "createdAt",
        label: "Start Date",
        header_icon: {
            icon: 'swap-vertical',
            event: 'file-startDate-sort',
        }
    },
    {
        key: "dueDate",
        label: "Due Date",
        header_icon: {
            icon: 'swap-vertical',
            event: 'file-dueDate-sort',
        }
    },
    {
        key: "priority",
        label: "Priority",
        header_icon: {
            icon: 'swap-vertical',
            event: 'file-priority-sort',
        }
    },
    {
        key: "tag",
        label: "Tags",
        header_icon: {
            icon: 'swap-vertical',
            event: 'file-tag-sort'
        },
    },
    {
        key: "",
        label: "Team"
    },
    {
        key: "department",
        label: "Department",
    },
  ]