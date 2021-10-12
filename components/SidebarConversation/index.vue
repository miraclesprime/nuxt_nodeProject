<template>
  <div class="container pt-1">
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

        <a data-v-5ecd2b72="" href="#" class="add-task"
          ><svg
            data-v-5ecd2b72=""
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 48 48"
          >
            <g data-v-5ecd2b72="">
              <path
                data-v-5ecd2b72=""
                d="M39,22H26V9a2,2,0,0,0-4,0V22H9a2,2,0,0,0,0,4H22V39a2,2,0,0,0,4,0V26H39a2,2,0,0,0,0-4Z"
              ></path>
            </g>
          </svg>
        </a>
      </div>

      <div class="mail" v-for="item in [1, 2, 3]" :key="'mail' + item">
        <a class="title" href="#">
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
          Mmm 00, 000
        </a>

        <div class="mail-sender w-100 mt-05">
          <bib-avatar size="35px"></bib-avatar>
          <span class="sender-name">Persons Name</span>
          <span class="sending-time">8:00</span>

          <div class="mail-actions">
            <a href="#">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 48 48"
              >
                <g>
                  <path
                    d="M40,8V32H13.6l-1.2,1.1L8,37.3V8H40m2-4H6A2,2,0,0,0,4,6V42a2,2,0,0,0,2,2,2,2,0,0,0,1.4-.6L15.2,36H42a2,2,0,0,0,2-2V6a2,2,0,0,0-2-2Z"
                  ></path>
                </g>
              </svg>
            </a>

            <a href="#">
              <svg
                width="15"
                height="15"
                viewBox="0 0 12 15"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
              >
                <g
                  id="Symbols"
                  stroke="none"
                  stroke-width="1"
                  fill="none"
                  fill-rule="evenodd"
                >
                  <g
                    id="ui/components/ico/faces/happy"
                    transform="translate(-14.000000, -13.000000)"
                    fill="#2CA01C"
                  >
                    <path
                      d="M26,22.6960938 C25.2,25.8820313 23.2,27.475 20,27.475 C16.8,27.475 14.8,25.8820313 14,22.6960938 L26,22.6960938 Z M23.6,13 C24.2627417,13 24.8,14.0745166 24.8,15.4 C24.8,16.7254834 24.2627417,17.8 23.6,17.8 C22.9372583,17.8 22.4,16.7254834 22.4,15.4 C22.4,14.0745166 22.9372583,13 23.6,13 Z M16.4,13 C17.0627417,13 17.6,14.0745166 17.6,15.4 C17.6,16.7254834 17.0627417,17.8 16.4,17.8 C15.7372583,17.8 15.2,16.7254834 15.2,15.4 C15.2,14.0745166 15.7372583,13 16.4,13 Z"
                      id="happy"
                    ></path>
                  </g>
                </g>
              </svg>
            </a>

            <a href="#">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 48 48"
              >
                <title>thumbs-up</title>
                <g id="Layer_2" data-name="Layer 2">
                  <g id="invisible_box" data-name="invisible box">
                    <rect width="48" height="48" fill="none"></rect>
                  </g>
                  <g id="icons_Q2" data-name="icons Q2">
                    <path
                      d="M38,17H31l.4-3.3C32,8.8,31,4.9,27.8,4h-.3A2,2,0,0,0,26,5.2S19,20,16,20H5a2,2,0,0,0-2,2V38a2,2,0,0,0,2,2H18.3a1.6,1.6,0,0,1,1.2.4c1.4,1,6.1,3.6,8.5,3.6h5c5.9,0,11-4,11.5-11.9h0L45,24A6.7,6.7,0,0,0,38,17ZM7,24h6V36H7Zm33.5,7.8h0C40.1,37,37.3,40,33,40H28c-1.2-.1-4.8-1.9-6.1-2.8A5.8,5.8,0,0,0,18.3,36H17V24c1.9-.4,5-2.2,10.5-12.8a16.2,16.2,0,0,1-.1,2.1L27,16.6,26.5,21H38a2.7,2.7,0,0,1,3,2.9Z"
                    ></path>
                  </g>
                </g>
              </svg>
            </a>

            <a href="#">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 48 48"
              >
                <title>trash</title>
                <g id="Layer_2" data-name="Layer 2">
                  <g id="invisible_box" data-name="invisible box">
                    <rect width="48" height="48" fill="none"></rect>
                  </g>
                  <g id="icons_Q2" data-name="icons Q2">
                    <path
                      d="M43,8.8a2.3,2.3,0,0,1-.6,1.6A1.7,1.7,0,0,1,41,11H29a2,2,0,0,1-2-2V7H21V9a2,2,0,0,1-2,2H7.1A2.1,2.1,0,0,1,5,9.2a2.3,2.3,0,0,1,.6-1.6A1.7,1.7,0,0,1,7,7H17V5a2,2,0,0,1,2-2H29a2,2,0,0,1,2,2V7h9.9A2.1,2.1,0,0,1,43,8.8Z"
                    ></path>
                    <path
                      d="M34.8,16.8,32.4,41H15.6L13.2,16.8a2,2,0,0,0-2-1.8h0a2,2,0,0,0-2,2.2l2.6,26a2,2,0,0,0,2,1.8H34.2a2,2,0,0,0,2-1.8l2.6-26a2,2,0,0,0-2-2.2h0A2,2,0,0,0,34.8,16.8Z"
                    ></path>
                  </g>
                </g>
              </svg>
            </a>

            <a href="#">
              <svg
                viewBox="13.349 193.536 478.188 95.709"
                width="15"
                height="15"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M 395.899 241.426 C 395.899 204.615 435.749 181.608 467.628 200.014 C 499.507 218.419 499.507 264.433 467.628 282.838 C 460.358 287.035 452.113 289.245 443.718 289.245 C 417.308 289.245 395.899 267.836 395.899 241.426 Z M 204.624 241.426 C 204.624 204.615 244.473 181.608 276.352 200.014 C 308.232 218.419 308.232 264.433 276.352 282.838 C 269.083 287.035 260.837 289.245 252.443 289.245 C 226.033 289.245 204.624 267.836 204.624 241.426 Z M 13.349 241.426 C 13.349 204.615 53.198 181.608 85.077 200.014 C 116.957 218.419 116.957 264.433 85.077 282.838 C 77.808 287.035 69.562 289.245 61.168 289.245 C 34.758 289.245 13.349 267.836 13.349 241.426 Z"
                  style=""
                ></path>
              </svg>
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

      <vue-text-editor :value="'abc'" @change="handleChange"></vue-text-editor>
    </div>
  </div>
</template>

<script>
import { Teammates } from "config/constants";

export default {
  data: function () {
    return {
      teammates: Teammates,
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
    border-bottom: 1px solid $gray7;
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