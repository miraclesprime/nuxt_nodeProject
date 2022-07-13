export const DUMMY_TASKS = [{
    key: 1,
    name: "Task - 1",
    status: "Past Due",
    progress: "80%",
    priority: "Urgent",
    assignee: "John Doe",
    description: "Lorem ipsum dolor sit amet,consectetur adipiscing elit, sed do",
    dueDate: "Nov 23, 2032"
  },
  {
    key: 2,
    name: "Task - 2",
    status: "Past Due",
    progress: "80%",
    priority: "Top",
    assignee: "John Doe",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
    dueDate: "Nov 23, 2032"
  },
  {
    key: 3,
    name: "Task - 3",
    status: "In-progress",
    progress: "80%",
    priority: "Priority",
    assignee: "John Doe",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
    dueDate: "Nov 23, 2032"
  },
  {
    key: 4,
    name: "Task - 4",
    status: "In-progress",
    progress: "80%",
    priority: "Priority",
    assignee: "John Doe",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
    dueDate: "Nov 23, 2032"
  },
  {
    key: 5,
    name: "Task - 5",
    status: "In-progress",
    progress: "80%",
    priority: "Priority",
    assignee: "John Doe",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
    dueDate: "Nov 23, 2032"
  },
  {
    key: 6,
    name: "Task - 6",
    status: "In-progress",
    progress: "80%",
    priority: "Priority",
    assignee: "John Doe",
    dueDate: "Nov 23, 2032"
  },
  {
    key: 7,
    name: "Task - 7",
    status: "In-progress",
    progress: "80%",
    priority: "Priority",
    assignee: "John Doe",
    dueDate: "Nov 23, 2032"
  },
  {
    key: 8,
    name: "Task - 8",
    status: "In-progress",
    progress: "80%",
    priority: "Priority",
    assignee: "John Doe",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
    dueDate: "Nov 23, 2032"
  },
  {
    key: 9,
    name: "Task - 9",
    status: "In-progress",
    progress: "80%",
    priority: "Priority",
    assignee: "John Doe",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
    dueDate: "Nov 23, 2032"
  },
  {
    key: 10,
    name: "Task - 10",
    status: "DONE",
    priorit: "LOW",
    assignee: "Ramon",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
    dueDate: "2021-10-01"
  },
  {
    key: 11,
    name: "Task - 11",
    status: "DONE",
    priorit: "LOW",
    assignee: "Bruno",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
    dueDate: "2021-10-01"
  },
  {
    key: 12,
    name: "Task - 12",
    status: "DONE",
    priorit: "LOW",
    assignee: "Bruno",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
    dueDate: "2021-10-01"
  }
];

export const DUMMY_PROJECT = {
  companyId: 1,
  title: "Tom's Business project",
  description: "2030 Project Description",
  dueDate: "2030-8-31",
  priority: "medium",
  buget: 10.0

}

export const SECTION_TASKS = [
 {
    "id": 1,
    "userId": "DKgl9av2NwnaG1vz",
    "title": "Recently Assigned",
    "uOrder": 0,
    "isDefault": true,
    "isDeleted": false,
    "createdAt": "2022-06-27T09:26:23.000Z",
    "updatedAt": "2022-06-27T09:26:23.000Z",
    "tasks": [
      {
        "id": 3,
        "userId": "DKgl9av2NwnaG1vz",
        "companyId": "O3GWpmbk5ezJn4KR",
        "sectionId": 2,
        "statusId": 5,
        "todoId": 1,
        "priorityId": 1,
        "departmentId": null,
        "title": "Task three",
        "order": 3,
        "tOrder": 0,
        "description": "",
        "dueDate": "2022-06-27T09:28:52.000Z",
        "budget": "0.00",
        "isDeleted": false,
        "isDone": false,
        "createdAt": "2022-06-27T09:28:56.000Z",
        "updatedAt": "2022-07-04T10:42:32.000Z",
        "status": {
          "id": 5,
          "text": "Done"
        },
        "priority": {
          "id": 1,
          "text": "high"
        },
        "project": [
          {
            "id": 3,
            "projectId": 2,
            "taskId": 3,
            "createdAt": "2022-06-27T09:28:57.000Z",
            "updatedAt": "2022-06-27T09:28:57.000Z",
            "project": {
              "id": 2,
              "userId": "O3GWpmbk5ezJn4KR",
              "companyId": "O3GWpmbk5ezJn4KR",
              "statusId": 5,
              "priorityId": null,
              "departmentId": null,
              "title": "Project two",
              "description": null,
              "dueDate": null,
              "budget": null,
              "isDeleted": false,
              "isDone": false,
              "createdAt": "2022-06-27T09:28:16.000Z",
              "updatedAt": "2022-07-07T07:42:45.000Z"
            }
          }
        ]
      },
      {
        "id": 6,
        "userId": "DKgl9av2NwnaG1vz",
        "companyId": "O3GWpmbk5ezJn4KR",
        "sectionId": 8,
        "statusId": 2,
        "todoId": 1,
        "priorityId": 2,
        "departmentId": null,
        "title": "Normal task",
        "order": 6,
        "tOrder": 1,
        "description": "",
        "dueDate": "2022-07-08T00:00:00.000Z",
        "budget": "0.00",
        "isDeleted": false,
        "isDone": false,
        "createdAt": "2022-06-27T11:39:37.000Z",
        "updatedAt": "2022-07-06T10:37:24.000Z",
        "status": {
          "id": 2,
          "text": "In-Progress"
        },
        "priority": {
          "id": 2,
          "text": "medium"
        },
        "project": [
          {
            "id": 15,
            "projectId": 4,
            "taskId": 6,
            "createdAt": "2022-07-06T07:48:30.000Z",
            "updatedAt": "2022-07-06T10:37:24.000Z",
            "project": {
              "id": 4,
              "userId": "9OjoQeZ63ZvepZVg",
              "companyId": "O3GWpmbk5ezJn4KR",
              "statusId": null,
              "priorityId": null,
              "departmentId": null,
              "title": "My FIrst Project",
              "description": null,
              "dueDate": null,
              "budget": null,
              "isDeleted": false,
              "isDone": false,
              "createdAt": "2022-06-29T16:32:38.000Z",
              "updatedAt": "2022-06-29T16:32:38.000Z"
            }
          }
        ]
      },
      {
        "id": 14,
        "userId": "DKgl9av2NwnaG1vz",
        "companyId": "O3GWpmbk5ezJn4KR",
        "sectionId": 16,
        "statusId": 1,
        "todoId": 1,
        "priorityId": 2,
        "departmentId": null,
        "title": "Next months task",
        "order": 12,
        "tOrder": 0,
        "description": "",
        "dueDate": "2022-08-10T00:00:00.000Z",
        "budget": "0.00",
        "isDeleted": false,
        "isDone": false,
        "createdAt": "2022-06-30T12:30:54.000Z",
        "updatedAt": "2022-07-06T08:09:53.000Z",
        "status": {
          "id": 1,
          "text": "Not Started"
        },
        "priority": {
          "id": 2,
          "text": "medium"
        },
        "project": [
          {
            "id": 17,
            "projectId": 4,
            "taskId": 14,
            "createdAt": "2022-07-06T08:09:52.000Z",
            "updatedAt": "2022-07-06T08:09:52.000Z",
            "project": {
              "id": 4,
              "userId": "9OjoQeZ63ZvepZVg",
              "companyId": "O3GWpmbk5ezJn4KR",
              "statusId": null,
              "priorityId": null,
              "departmentId": null,
              "title": "My FIrst Project",
              "description": null,
              "dueDate": null,
              "budget": null,
              "isDeleted": false,
              "isDone": false,
              "createdAt": "2022-06-29T16:32:38.000Z",
              "updatedAt": "2022-06-29T16:32:38.000Z"
            }
          }
        ]
      },
      {
        "id": 21,
        "userId": "DKgl9av2NwnaG1vz",
        "companyId": "O3GWpmbk5ezJn4KR",
        "sectionId": 6,
        "statusId": 1,
        "todoId": 1,
        "priorityId": 2,
        "departmentId": null,
        "title": "Task no section",
        "order": 1,
        "tOrder": 17,
        "description": "",
        "dueDate": "2022-07-06T10:01:54.000Z",
        "budget": "0.00",
        "isDeleted": false,
        "isDone": false,
        "createdAt": "2022-07-06T10:01:58.000Z",
        "updatedAt": "2022-07-06T10:01:58.000Z",
        "status": {
          "id": 1,
          "text": "Not Started"
        },
        "priority": {
          "id": 2,
          "text": "medium"
        },
        "project": [
          {
            "id": 19,
            "projectId": 3,
            "taskId": 21,
            "createdAt": "2022-07-06T10:01:59.000Z",
            "updatedAt": "2022-07-06T10:01:59.000Z",
            "project": {
              "id": 3,
              "userId": "DKgl9av2NwnaG1vz",
              "companyId": "O3GWpmbk5ezJn4KR",
              "statusId": 1,
              "priorityId": 1,
              "departmentId": null,
              "title": "Ulta project",
              "description": null,
              "dueDate": "2022-08-31T00:00:00.000Z",
              "budget": null,
              "isDeleted": false,
              "isDone": false,
              "createdAt": "2022-06-29T07:34:07.000Z",
              "updatedAt": "2022-07-07T11:15:35.000Z"
            }
          }
        ]
      },
      {
        "id": 24,
        "userId": "DKgl9av2NwnaG1vz",
        "companyId": "O3GWpmbk5ezJn4KR",
        "sectionId": 18,
        "statusId": 5,
        "todoId": 1,
        "priorityId": 2,
        "departmentId": null,
        "title": "Column 1 task",
        "order": 20,
        "tOrder": 20,
        "description": "",
        "dueDate": "2022-07-07T00:00:00.000Z",
        "budget": "0.00",
        "isDeleted": false,
        "isDone": false,
        "createdAt": "2022-07-06T10:07:03.000Z",
        "updatedAt": "2022-07-06T10:33:38.000Z",
        "status": {
          "id": 5,
          "text": "Done"
        },
        "priority": {
          "id": 2,
          "text": "medium"
        },
        "project": [
          {
            "id": 22,
            "projectId": 6,
            "taskId": 24,
            "createdAt": "2022-07-06T10:07:04.000Z",
            "updatedAt": "2022-07-06T10:33:38.000Z",
            "project": {
              "id": 6,
              "userId": "DKgl9av2NwnaG1vz",
              "companyId": "O3GWpmbk5ezJn4KR",
              "statusId": 2,
              "priorityId": null,
              "departmentId": null,
              "title": "Update task project",
              "description": null,
              "dueDate": null,
              "budget": null,
              "isDeleted": false,
              "isDone": false,
              "createdAt": "2022-07-06T10:05:44.000Z",
              "updatedAt": "2022-07-06T10:35:07.000Z"
            }
          }
        ]
      }
    ]
  },
  {
    "id": 14,
    "projectId": 3,
    "title": "_section3",
    "order": 0,
    "isDeleted": false,
    "createdAt": "2022-07-01T12:59:22.000Z",
    "updatedAt": "2022-07-01T12:59:22.000Z",
    "tasks": [{
      "id": 19,
      "userId": "k61YQdJ6J7ldOGpJ",
      "companyId": "O3GWpmbk5ezJn4KR",
      "sectionId": 14,
      "statusId": 5,
      "todoId": 34,
      "priorityId": 3,
      "departmentId": null,
      "title": "Demo Task",
      "order": 17,
      "tOrder": 0,
      "description": "",
      "dueDate": "2022-08-23T00:00:00.000Z",
      "budget": "0.00",
      "isDeleted": false,
      "isDone": false,
      "createdAt": "2022-07-01T12:59:22.000Z",
      "updatedAt": "2022-07-01T13:00:06.000Z",
      "status": {
        "id": 5,
        "text": "Done"
      },
      "priority": {
        "id": 3,
        "text": "low"
      },
      "user": {
        "id": "k61YQdJ6J7ldOGpJ",
        "firstName": "Dhruv",
        "lastName": "Sharma"
      }
    }]
  },
  {
    "id": 6,
    "projectId": 3,
    "title": "Section one",
    "order": 2,
    "isDeleted": false,
    "createdAt": "2022-06-29T11:02:34.000Z",
    "updatedAt": "2022-06-29T11:18:23.000Z",
    "tasks": [{
        "id": 21,
        "userId": "DKgl9av2NwnaG1vz",
        "companyId": "O3GWpmbk5ezJn4KR",
        "sectionId": 6,
        "statusId": 1,
        "todoId": 1,
        "priorityId": 2,
        "departmentId": null,
        "title": "Task no section",
        "order": 1,
        "tOrder": 17,
        "description": "",
        "dueDate": "2022-07-06T10:01:54.000Z",
        "budget": "0.00",
        "isDeleted": false,
        "isDone": false,
        "createdAt": "2022-07-06T10:01:58.000Z",
        "updatedAt": "2022-07-06T10:01:58.000Z",
        "status": {
          "id": 1,
          "text": "Not Started"
        },
        "priority": {
          "id": 2,
          "text": "medium"
        },
        "user": {
          "id": "DKgl9av2NwnaG1vz",
          "firstName": "Vishwajeet",
          "lastName": "Mandal"
        }
      },
      {
        "id": 22,
        "userId": null,
        "companyId": "O3GWpmbk5ezJn4KR",
        "sectionId": 6,
        "statusId": 1,
        "todoId": null,
        "priorityId": 2,
        "departmentId": null,
        "title": "Test task",
        "order": 0,
        "tOrder": 18,
        "description": "",
        "dueDate": "2022-07-06T10:02:41.000Z",
        "budget": "0.00",
        "isDeleted": false,
        "isDone": false,
        "createdAt": "2022-07-06T10:02:44.000Z",
        "updatedAt": "2022-07-06T10:03:06.000Z",
        "status": {
          "id": 1,
          "text": "Not Started"
        },
        "priority": {
          "id": 2,
          "text": "medium"
        },
        "user": null
      }
    ]
  },
  {
    "id": 27,
    "projectId": 3,
    "title": "Ultimate",
    "order": 18,
    "isDeleted": false,
    "createdAt": "2022-07-07T11:16:12.000Z",
    "updatedAt": "2022-07-07T11:16:12.000Z",
    "tasks": [{
        "id": 20,
        "userId": "DKgl9av2NwnaG1vz",
        "companyId": "O3GWpmbk5ezJn4KR",
        "sectionId": 27,
        "statusId": 1,
        "todoId": 22,
        "priorityId": 2,
        "departmentId": null,
        "title": "New test task",
        "order": 1,
        "tOrder": 0,
        "description": "",
        "dueDate": "2022-07-08T00:00:00.000Z",
        "budget": "0.00",
        "isDeleted": false,
        "isDone": false,
        "createdAt": "2022-07-06T09:42:08.000Z",
        "updatedAt": "2022-07-06T09:42:37.000Z",
        "status": {
          "id": 1,
          "text": "Not Started"
        },
        "priority": {
          "id": 2,
          "text": "medium"
        },
        "user": {
          "id": "DKgl9av2NwnaG1vz",
          "firstName": "Vishwajeet",
          "lastName": "Mandal"
        }
      },
      {
        "id": 27,
        "userId": null,
        "companyId": "O3GWpmbk5ezJn4KR",
        "sectionId": 27,
        "statusId": 3,
        "todoId": null,
        "priorityId": 2,
        "departmentId": null,
        "title": "Ultimate task",
        "order": 0,
        "tOrder": 23,
        "description": "",
        "dueDate": "2022-07-29T00:00:00.000Z",
        "budget": "0.00",
        "isDeleted": false,
        "isDone": false,
        "createdAt": "2022-07-07T11:17:00.000Z",
        "updatedAt": "2022-07-07T11:17:00.000Z",
        "status": {
          "id": 3,
          "text": "Waiting"
        },
        "priority": {
          "id": 2,
          "text": "medium"
        },
        "user": null
      }
    ]
  }
]
