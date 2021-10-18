<template>
  <div class="tasks">
    <a class="bundle-title" href="#" @click="isOpened = !isOpened">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="10"
        height="10"
        viewBox="0 0 48 48"
        v-if="!isOpened"
      >
        <g id="Layer_2" data-name="Layer 2">
          <g id="invisible_box" data-name="invisible box">
            <rect width="48" height="48" fill="none"></rect>
          </g>
          <g id="icons_Q2" data-name="icons Q2">
            <path
              d="M27.2,24,16.6,34.6a1.9,1.9,0,0,0,.2,3,2.1,2.1,0,0,0,2.7-.2l11.9-12a1.9,1.9,0,0,0,0-2.8l-11.9-12a2.1,2.1,0,0,0-2.7-.2,1.9,1.9,0,0,0-.2,3Z"
            ></path>
          </g>
        </g>
      </svg>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="10"
        height="10"
        viewBox="0 0 48 48"
        v-if="isOpened"
      >
        <g id="Layer_2" data-name="Layer 2">
          <g id="invisible_box" data-name="invisible box">
            <rect width="48" height="48" fill="none"></rect>
          </g>
          <g id="icons_Q2" data-name="icons Q2">
            <path
              d="M24,27.2,13.4,16.6a1.9,1.9,0,0,0-3,.2,2.1,2.1,0,0,0,.2,2.7l12,11.9a1.9,1.9,0,0,0,2.8,0l12-11.9a2.1,2.1,0,0,0,.2-2.7,1.9,1.9,0,0,0-3-.2Z"
            ></path>
          </g>
        </g>
      </svg>
      <span>{{ title }}</span>
    </a>

    <template v-if="isOpened">
      <ul
        class="task-bundle padding-sm"
        v-for="(item, index) in tasks"
        :key="item.id + item.name"
      >
        <li class="task-item task-number">
          <span>0</span>
        </li>
        <li class="task-item task-name">
          <div class="custom-control custom-checkbox">
            <input
              type="checkbox"
              class="custom-control-input"
              :id="'brand-1-' + index"
            />
            <label class="custom-control-label" :for="'brand-1-' + index">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 48 48"
              >
                <g>
                  <path
                    d="M14.1,37.9,6.1,30a2.1,2.1,0,0,1-.2-2.7,1.9,1.9,0,0,1,3-.2l6.6,6.6L39.1,10.1a2,2,0,0,1,2.8,2.8l-25,25A1.9,1.9,0,0,1,14.1,37.9Z"
                  ></path>
                </g>
              </svg>
            </label>
          </div>
          <span>{{ item.title }}</span>
        </li>
        <li class="task-item task-status">
          <span>{{ item.status[0] }}</span>
          <span class="ml-auto">{{ item.status[1] }}</span>
        </li>
        <li class="task-item task-priority">
          <span>{{ item.priority }}</span>
        </li>
        <li class="task-item task-assignee">
          <bib-avatar size="25px" />
          <span style="margin-left: 4px">{{ item.assignee }}</span>
        </li>
        <li class="task-item task-date">
          <span>{{ item.dueDate }}</span>
        </li>
        <li class="task-item" style="flex: 1"></li>
      </ul>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "Section",
    },
    tasks: Array,
    isExpanded: {
      type: Boolean,
      default: false,
    },
  },
  data: function () {
    return {
      isOpened: this.isExpanded,
    };
  },
};
</script>

<style lang="scss" scoped>
.bundle-title {
  &:hover {
    color: #333;
  }
}

.tasks {
  border-bottom: 1px solid $gray4;
}
</style>