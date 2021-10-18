<template>
  <div class="task-group w-100">
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

      <span>Add Subtask</span>
    </a>
    <div class="task" v-for="(item, index) in tasks" :key="'sub-task-' + index">
      <span class="task-number">{{ index + 1 }}</span>
      <div class="divider" style="left: 3.5%" />

      <div class="custom-control custom-checkbox">
        <input
          type="checkbox"
          class="custom-control-input"
          :id="'brand-' + index"
        />
        <label class="custom-control-label" :for="'brand-' + index">
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

      <div class="task-name">{{ item.name }}</div>
      <div class="divider" style="left: 51%" />

      <div class="task-author">
        <bib-avatar size="20px" />
        <span>{{ item.author }}</span>
      </div>
      <div class="divider" style="left: 76%" />

      <span>{{ item.date }}</span>
      <div class="divider" style="left: 94%" />

      <a class="task-options" href="#"
        ><svg
          viewBox="13.349 193.536 478.188 95.709"
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
        >
          <path
            d="M 395.899 241.426 C 395.899 204.615 435.749 181.608 467.628 200.014 C 499.507 218.419 499.507 264.433 467.628 282.838 C 460.358 287.035 452.113 289.245 443.718 289.245 C 417.308 289.245 395.899 267.836 395.899 241.426 Z M 204.624 241.426 C 204.624 204.615 244.473 181.608 276.352 200.014 C 308.232 218.419 308.232 264.433 276.352 282.838 C 269.083 287.035 260.837 289.245 252.443 289.245 C 226.033 289.245 204.624 267.836 204.624 241.426 Z M 13.349 241.426 C 13.349 204.615 53.198 181.608 85.077 200.014 C 116.957 218.419 116.957 264.433 85.077 282.838 C 77.808 287.035 69.562 289.245 61.168 289.245 C 34.758 289.245 13.349 267.836 13.349 241.426 Z"
            style=""
          ></path></svg
      ></a>
    </div>
  </div>
</template>

<script>
import { TASKS } from "config/constants";
import BibAvatar from "../../../bib-shared/components/Atoms/BibAvatar.vue";

export default {
  components: { BibAvatar },
  data: function () {
    return {
      tasks: TASKS,
    };
  },
};
</script>