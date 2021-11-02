<template>
  <div class="container pt-1 row">
    <div class="row col-7 position-relative">
      <div class="col-4">
        <sidebar-team adClass="" />
      </div>

      <div class="divider" style="left: 33.8%" />

      <div class="col-8 mt-2">
        <div class="task-team w-100">
          <div class="mail" v-for="item in [1, 2, 3]" :key="'mail' + item">
            <div class="title d-flex align-center">
              <bib-icon icon="next" />
              Mmm 00, 000
            </div>

            <div class="mail-sender w-100 mt-05">
              <bib-avatar size="35px"></bib-avatar>
              <span class="sender-name">Persons Name</span>
              <span class="sending-time">8:00</span>

              <div class="mail-actions">
                <a href="#">
                  <bib-icon icon="comment" />
                </a>

                <a href="#">
                  <bib-icon icon="face-success" variant="gray" />
                </a>

                <a href="#">
                  <bib-icon icon="thumbs-up" />
                </a>

                <a href="#">
                  <bib-icon icon="trash" />
                </a>

                <a href="#">
                  <bib-icon icon="elipsis" />
                </a>
              </div>
            </div>

            <div class="mail-content">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor Bruno Goulet et dolore magna aliqua. Ut enim
                adminim venia, quis nostrud
                <a href="#">External link</a> ullamco laboris nisi utaliquip ex
                ea commodo consequat. <br /><br />
                Duis aute irure dolor in reprehenderit in volutate velit esse
                cillum
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { TEAMMATES } from "config/constants";

export default {
  data: function () {
    return {
      teammates: TEAMMATES,
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

  g {
    fill: $gray4 !important;
  }
}
</style>
