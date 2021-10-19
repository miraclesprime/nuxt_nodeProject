<template>
  <div>
    <div class="task-actions">
      <div class="action-left">
        <a href="#" class="add-task w-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 48 48"
          >
            <g>
              <path
                d="M39,22H26V9a2,2,0,0,0-4,0V22H9a2,2,0,0,0,0,4H22V39a2,2,0,0,0,4,0V26H39a2,2,0,0,0,0-4Z"
              ></path>
            </g>
          </svg>

          <span>Add Team Members</span>
        </a>
      </div>

      <div class="action-right">
        <ul class="actions">
          <li class="action">
            <div class="custom-control custom-checkbox">
              <input
                type="checkbox"
                class="custom-control-input"
                id="my-items-only"
              />
              <label class="custom-control-label" for="my-items-only">
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
            <span>My items only</span>
          </li>
          <li class="action">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 48 48"
            >
              <g id="Layer_2" data-name="Layer 2">
                <g id="invisible_box" data-name="invisible box">
                  <rect width="48" height="48" fill="none"></rect>
                </g>
                <g id="icons_Q2" data-name="icons Q2">
                  <g>
                    <path
                      d="M24.4,33.5a2.1,2.1,0,0,0,.2-2.7,1.9,1.9,0,0,0-3-.2L17,35.2V8a2,2,0,0,0-4,0V35.2L8.4,30.6a1.9,1.9,0,0,0-3,.2,2.1,2.1,0,0,0,.2,2.7l8,7.9a1.9,1.9,0,0,0,2.8,0Z"
                    ></path>
                    <path
                      d="M23.6,14.5a2.1,2.1,0,0,0-.2,2.7,1.9,1.9,0,0,0,3,.2L31,12.8V40a2,2,0,0,0,4,0V12.8l4.6,4.6a1.9,1.9,0,0,0,3-.2,2.1,2.1,0,0,0-.2-2.7l-8-7.9a1.9,1.9,0,0,0-2.8,0Z"
                    ></path>
                  </g>
                </g>
              </g>
            </svg>
            <span>Sort</span>
          </li>
          <li class="action">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 48 48"
            >
              <g id="Layer_2" data-name="Layer 2">
                <g id="invisible_box" data-name="invisible box">
                  <rect width="48" height="48" fill="none"></rect>
                </g>
                <g id="icons_Q2" data-name="icons Q2">
                  <path
                    d="M41.8,8H21.7A6.2,6.2,0,0,0,16,4a6,6,0,0,0-5.6,4H6.2A2.1,2.1,0,0,0,4,10a2.1,2.1,0,0,0,2.2,2h4.2A6,6,0,0,0,16,16a6.2,6.2,0,0,0,5.7-4H41.8A2.1,2.1,0,0,0,44,10,2.1,2.1,0,0,0,41.8,8ZM16,12a2,2,0,1,1,2-2A2,2,0,0,1,16,12Z"
                  ></path>
                  <path
                    d="M41.8,22H37.7A6.2,6.2,0,0,0,32,18a6,6,0,0,0-5.6,4H6.2a2,2,0,1,0,0,4H26.4A6,6,0,0,0,32,30a6.2,6.2,0,0,0,5.7-4h4.1a2,2,0,1,0,0-4ZM32,26a2,2,0,1,1,2-2A2,2,0,0,1,32,26Z"
                  ></path>
                  <path
                    d="M41.8,36H24.7A6.2,6.2,0,0,0,19,32a6,6,0,0,0-5.6,4H6.2a2,2,0,1,0,0,4h7.2A6,6,0,0,0,19,44a6.2,6.2,0,0,0,5.7-4H41.8a2,2,0,1,0,0-4ZM19,40a2,2,0,1,1,2-2A2,2,0,0,1,19,40Z"
                  ></path>
                </g>
              </g>
            </svg>
            <span>Filter</span>
          </li>
          <li class="action">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              preserveAspectRatio="xMinYMin"
              width="15"
              height="15"
            >
              <path
                d="M1,1h5c0.6,0,1,0.4,1,1v4c0,0.6-0.4,1-1,1H1C0.4,7,0,6.6,0,6V2C0,1.4,0.4,1,1,1z"
              ></path>
              <path
                class="light-gray rec-1"
                d="M10,1h5c0.6,0,1,0.4,1,1v4c0,0.6-0.4,1-1,1h-5C9.4,7,9,6.6,9,6V2C9,1.4,9.4,1,10,1z"
              ></path>
              <path
                class="medium-gray rec-2"
                d="M1,9h5c0.6,0,1,0.4,1,1v4c0,0.6-0.4,1-1,1H1c-0.6,0-1-0.4-1-1v-4C0,9.4,0.4,9,1,9z"
              ></path>
            </svg>
            <span>Group</span>
          </li>
          <li class="action">
            <span style="margin-right: 5px">Views</span>
            <a href="#" class="grid-type">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="36.457 77.467 410.63 342.192"
                width="15"
                height="15"
              >
                <defs></defs>
                <g>
                  <path
                    d="M36.456 77.468h68.438v68.438H36.456zM378.648 77.468h68.438v68.438h-68.438zM36.456 214.345h68.438v68.438H36.456zM378.648 214.345h68.438v68.438h-68.438zM36.456 351.221h68.438v68.439H36.456zM378.648 351.221h68.438v68.439h-68.438zM139.114 77.468h205.315v68.438H139.114zM139.114 214.345h205.315v68.438H139.114zM139.114 351.221h205.315v68.439H139.114z"
                    class="e"
                  ></path>
                </g>
              </svg>
            </a>

            <a href="#" class="grid-type">
              <svg viewBox="209.304 196.37 11.813 9.765" width="15" height="15">
                <path
                  d="M 209.387 196.472 L 214.17 196.472 L 214.237 200.297 L 209.454 200.297 Z M 216.083 196.472 L 220.865 196.472 L 220.932 200.297 L 216.151 200.297 Z M 209.489 202.21 L 214.27 202.21 L 214.338 206.034 L 209.555 206.034 Z M 216.184 202.21 L 220.967 202.21 L 221.034 206.034 L 216.251 206.034 Z"
                  class="d"
                  style=""
                  transform="matrix(-0.999845, -0.017581, 0.017581, -0.999845, 426.849487, 406.258514)"
                ></path>
              </svg>
            </a>
          </li>
          <li class="action">
            <a href="#">
              <svg
                viewBox="13.349 193.536 478.188 95.709"
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
              >
                <path
                  d="M 395.899 241.426 C 395.899 204.615 435.749 181.608 467.628 200.014 C 499.507 218.419 499.507 264.433 467.628 282.838 C 460.358 287.035 452.113 289.245 443.718 289.245 C 417.308 289.245 395.899 267.836 395.899 241.426 Z M 204.624 241.426 C 204.624 204.615 244.473 181.608 276.352 200.014 C 308.232 218.419 308.232 264.433 276.352 282.838 C 269.083 287.035 260.837 289.245 252.443 289.245 C 226.033 289.245 204.624 267.836 204.624 241.426 Z M 13.349 241.426 C 13.349 204.615 53.198 181.608 85.077 200.014 C 116.957 218.419 116.957 264.433 85.077 282.838 C 77.808 287.035 69.562 289.245 61.168 289.245 C 34.758 289.245 13.349 267.836 13.349 241.426 Z"
                ></path>
              </svg>
            </a>
          </li>
        </ul>
      </div>
    </div>

    <ul class="task-bundle">
      <li class="task-item task-number">
        <span>#</span>
      </li>
      <li class="task-item task-name">
        <span>Task name</span>
      </li>
      <li class="task-item task-status">
        <span>Status</span>
      </li>
      <li class="task-item task-priority">
        <span>Priority</span>
      </li>
      <li class="task-item task-assignee">
        <span>Assignee</span>
      </li>
      <li class="task-item task-date">
        <span>Due date</span>
      </li>
      <li class="task-item justify-center" style="flex: 1">
        <svg
          viewBox="13.349 193.536 478.188 95.709"
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
        >
          <path
            d="M 395.899 241.426 C 395.899 204.615 435.749 181.608 467.628 200.014 C 499.507 218.419 499.507 264.433 467.628 282.838 C 460.358 287.035 452.113 289.245 443.718 289.245 C 417.308 289.245 395.899 267.836 395.899 241.426 Z M 204.624 241.426 C 204.624 204.615 244.473 181.608 276.352 200.014 C 308.232 218.419 308.232 264.433 276.352 282.838 C 269.083 287.035 260.837 289.245 252.443 289.245 C 226.033 289.245 204.624 267.836 204.624 241.426 Z M 13.349 241.426 C 13.349 204.615 53.198 181.608 85.077 200.014 C 116.957 218.419 116.957 264.433 85.077 282.838 C 77.808 287.035 69.562 289.245 61.168 289.245 C 34.758 289.245 13.349 267.836 13.349 241.426 Z"
            style=""
          ></path>
        </svg>
      </li>
    </ul>

    <task-bundle
      title="Past Due"
      :tasks="tasks.slice(0, 2)"
      :isExpanded="true"
    />
    <task-bundle
      title="Due Today"
      :tasks="tasks.slice(2, 5)"
      :isExpanded="true"
    />
    <task-bundle
      title="Tomorrow"
      :tasks="tasks.slice(5, 9)"
      :isExpanded="true"
    />
  </div>
</template>

<script>
export default {
  props: {
    tasks: {
      type: Array,
      default: [],
    },
    fields: {
      type: Array,
      default: [],
    },
  },
};
</script>

<style scoped lang="scss">
.task-actions {
  display: flex;
  border-top: 1px solid $gray4;
  align-items: center;
}
.action-right {
  margin-left: auto;
}
.actions {
  display: flex;
  color: $gray1;

  span {
    margin-left: 5px;
    font-size: 13px;
  }

  svg,
  svg g {
    fill: $gray1;
  }
}
.action {
  display: flex;
  padding: 0 20px;
  align-items: center;

  .custom-checkbox {
    position: relative;
  }
}
.custom-control-label {
  &::before {
    position: static;
    transform: none;
  }

  svg {
    left: 2px;
  }
}
.grid-type {
  border: 1px solid $gray4;
  padding: 2px 3px 0px;
  border-radius: 5px;
}
</style>