<template>
  <div>
    <div class="container">
      <div class="task-info w-100">
        <div class="row">
          <div class="col-4">
            <bib-input
              type="select"
              v-model="activeItem"
              :options="selectItems"
              placeholder="Please select..."
              label="Assignee"
            ></bib-input>
          </div>

          <div class="col-8">
            <bib-input
              type="select"
              v-model="activeItem"
              :options="selectItems"
              placeholder="Please select..."
              label="Project"
            ></bib-input>
          </div>
        </div>

        <div class="row">
          <div class="col-4">
            <bib-input
              type="select"
              v-model="activeItem"
              :options="selectItems"
              placeholder="Please select..."
              label="Department"
            ></bib-input>
          </div>

          <div class="col-4">
            <bib-input
              type="select"
              v-model="activeItem"
              :options="selectItems"
              placeholder="Please select..."
              label="Priority"
            ></bib-input>
          </div>

          <div class="col-4">
            <bib-input
              type="select"
              v-model="activeItem"
              :options="selectItems"
              placeholder="Please select..."
              label="Status"
            ></bib-input>
          </div>
        </div>

        <div class="row">
          <div class="col-12">
            <bib-input
              type="textarea"
              v-model="description"
              placeholder="Enter task description..."
              label="Description"
            ></bib-input>
          </div>
        </div>
      </div>

      <task-group title="Subtasks"></task-group>

      <div class="task-details w-100">
        <a
          href="#"
          class="title"
          @click="isContentExpanded = !isContentExpanded"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 48 48"
          >
            <title>arrowhead-right</title>
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
          Other details
        </a>

        <div class="row" v-if="isContentExpanded">
          <div class="col-4">
            <bib-input
              type="time"
              v-model="form.time"
              placeholder="Select your time"
              label="Time"
            ></bib-input>
          </div>

          <div class="col-4">
            <bib-input
              type="text"
              v-model="form.budget"
              placeholder="Set your Budget"
              label="Budget"
            ></bib-input>
          </div>

          <div class="col-4">
            <bib-input
              type="text"
              v-model="form.progress"
              placeholder="Select your progress"
              label="Progress"
            ></bib-input>
          </div>
        </div>
      </div>
    </div>

    <div class="task-team">
      <div class="container">
        <div class="team-list w-100">
          Team
          <div class="teammate active">
            <bib-avatar size="25px"></bib-avatar>
          </div>

          <template v-for="(item, index) in teammates">
            <div
              class="teammate"
              v-if="index !== activeMate"
              :key="'teammate-' + index"
              :style="'z-index:' + (100 - index)"
            >
              <bib-avatar size="25px"></bib-avatar>
            </div>
          </template>

          <span class="teammates-count"> + {{ teammates.length }} others </span>

          <a href="#" class="ml-auto">Add a team member</a>
        </div>

        <div class="add-comment w-100">
          <bib-avatar size="40px"></bib-avatar>

          <bib-input
            type="text"
            v-model="form.profile"
            placeholder="Add your comment..."
          ></bib-input>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Teammates } from "config/constants";
import BibAvatar from "../../../bib-shared/components/Atoms/BibAvatar.vue";

export default {
  components: { BibAvatar },
  data: function () {
    return {
      activeItem: -1,
      selectItems: [
        { label: "List Item", value: "1" },
        { label: "List Item", value: "2" },
        { label: "List Item", value: "3" },
        { label: "List Item", value: "4" },
        { label: "List Item", value: "5" },
        { label: "List Item", value: "6" },
      ],
      description: "",
      isContentExpanded: false,
      form: {
        time: "08:45:25",
        profile: "",
      },
      teammates: Teammates,
      activeMate: 0,
    };
  },
};
</script>


<style lang="scss" scoped>
.task-info {
  padding: 1.5rem 0;
  font-size: $sidebar-size;
}

.task-team {
  padding: 1rem 0;
  background-color: $gray3;
  border-top: 1px solid $gray4;
}

.team-list {
  display: flex;
  align-items: center;

  a {
    text-decoration: underline;
    color: var(--primary);
  }
}

.teammate {
  border: 1px solid transparent;
  border-radius: 50%;

  &:not(.active) {
    margin-right: -4px;
  }

  &.active {
    margin: 0 13px 0 8px;
  }

  &:hover {
    border-color: $gray1;
  }
}

.teammates-count {
  margin-left: 1rem;
}

.row {
  margin-top: 5px;
}

.task-details {
  padding-bottom: 5px;

  .title {
    width: 100%;
    padding: 8px 0;
    border-top: 1px solid $gray4;
    border-bottom: 1px solid $gray7;
  }

  .row {
    margin-top: 10px;
    font-size: $sidebar-size;
  }
}

.title svg {
  margin: 0 7px 0 5px;
  vertical-align: bottom;
}

.add-comment::v-deep {
  display: flex;
  align-items: center;
  margin-top: 1rem;

  input {
    margin: 0 0 0 10px;
  }
}
</style>