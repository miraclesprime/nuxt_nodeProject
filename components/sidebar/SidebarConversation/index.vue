<template>
  <div class="container pt-2">
    <div class="task-team w-100">
      <div class="team-list">
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

        <a data-v-5ecd2b72="" href="#" class="add-task">
          <bib-icon icon="add" variant="secondary"></bib-icon>
        </a>
      </div>

      <div class="mail" v-for="item in [1, 2, 3]" :key="'mail' + item">
        <a class="title" href="#">
          <bib-icon icon="next" />
          Mmm 00, 000
        </a>

        <div class="mail-sender w-100 mt-05">
          <bib-avatar size="35px"></bib-avatar>
          <span class="sender-name">Persons Name</span>
          <span class="sending-time">8:00</span>

          <div class="mail-actions">
            <a href="#">
              <bib-icon icon="comment" size="15px" />
            </a>

            <a href="#">
              <bib-icon icon="face-success" size="15px" />
            </a>

            <a href="#">
              <bib-icon icon="thumbs-up" size="15px" />
            </a>

            <a href="#">
              <bib-icon icon="trash" size="15px" />
            </a>

            <a href="#">
              <bib-icon icon="horizontal-dots" size="15px" />
            </a>
          </div>
        </div>

        <div class="mail-content">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor Bruno Goulet et dolore magna aliqua. Ut enim adminim
            venia, quis nostrud <a href="#">External link</a> ullamco laboris
            nisi utaliquip ex ea commodo consequat. <br /><br />
            Duis aute irure dolor in reprehenderit in volutate velit esse cillum
          </p>
        </div>
      </div>

      <!-- <vue-text-editor :value="'abc'" @change="handleChange"></vue-text-editor> -->
    </div>
  </div>
</template>

<script>
import { Teammates } from "config/constants";

export default {
  data: function () {
    return {
      teammates: Teammates,
      activeMate: 0,
    };
  },
};
</script>

<style lang="scss" scoped>
.container {
  color: #999;
}

.team-list {
  display: flex;
  margin-bottom: 3rem;
  padding-bottom: 5px;
  align-items: center;
  border-bottom: 1px solid $gray4;
}

.task-team {
  padding-bottom: 3px;
  border-bottom: 1px solid $gray4;
}

.add-task {
  margin: 0 0 0 25px;
}

.teammate {
  border: 1px solid transparent;
  border-radius: 50%;

  &:not(.active) {
    margin: 0 1px;
  }

  &.active {
    margin: 0 13px 0 8px;
  }

  &:hover {
    border-color: $gray1;
  }
}

.mail {
  .title {
    width: 100%;
    padding: 8px 0;
    font-size: $sidebar-size;
    border-bottom: 1px solid $gray6;
  }
}

.title svg {
  margin: 0 13px 0 12px;
  vertical-align: bottom;
}

.sender-name {
  font-size: $sidebar-size;
}

.mail-sender {
  display: flex;
  align-items: center;

  .avatar:hover {
    border: 1px solid $gray1;
  }

  .sender-name {
    margin-left: 5px;
  }

  .sending-time {
    margin-left: 10px;
    font-size: $sidebar-size;
  }

  .mail-actions {
    margin-left: auto;

    a {
      margin-left: 10px;

      &:hover g {
        fill: #666;
      }
    }
  }

  svg g {
    fill: #ccc;
  }
}

.mail-content {
  padding: 10px;
  margin: 0 0 10px 41px;
  font-size: 13px;
  color: #333;
  line-height: 1.25;
  background: $gray3;
  border-radius: 3px;

  a {
    color: $primary;
  }
}
</style>
