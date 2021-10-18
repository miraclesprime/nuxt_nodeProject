<template>
  <div class="nav-bar">
    <bib-app-switcher :menuItems="appItems"></bib-app-switcher>

    <div class="nav-content">
      <ul class="nav-items">
        <li class="nav-item">
          <a href="#">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="23"
              height="23"
              viewBox="0 0 48 48"
            >
              <g id="Layer_2" data-name="Layer 2">
                <g id="invisible_box" data-name="invisible box">
                  <rect width="48" height="48" fill="none"></rect>
                </g>
                <g id="icons_Q2" data-name="icons Q2">
                  <path
                    d="M24,7,40,21.6V40H33V25.9a2,2,0,0,0-2-2H17a2,2,0,0,0-2,2V40H8V21.6L24,7m0-5a1.1,1.1,0,0,0-.7.3L4.6,19.2A2,2,0,0,0,4,20.7V44H19V27.9H29V44H44V20.7a2,2,0,0,0-.6-1.5L24.7,2.3A1.1,1.1,0,0,0,24,2Z"
                  ></path>
                </g>
              </g>
            </svg>

            <span>My Files</span>
          </a>
        </li>

        <li class="nav-item">
          <a href="#">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="23"
              height="23"
              viewBox="0 0 48 48"
            >
              <g id="Layer_2" data-name="Layer 2">
                <g id="invisible_box" data-name="invisible box">
                  <rect width="48" height="48" fill="none"></rect>
                </g>
                <g id="Layer_6" data-name="Layer 6">
                  <path
                    d="M36,19.4v-9L24,2,12,10.4v9l-10,7V37.6L14,46l10-7.1L34,46l12-8.5V26.4Zm-14,16-8,5.7L6,35.5v-7l7.9-5.6L22,28.6Zm-6-16V12.5l8-5.6,8,5.6v6.9L24,25Zm26,16-8,5.7-8-5.6V28.6l8-5.7,8,5.6Z"
                  ></path>
                </g>
              </g>
            </svg>

            <span>Shared with me</span>
          </a>
        </li>

        <li class="nav-item" style="margin-bottom: 3rem">
          <a href="#">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="23"
              height="25"
              viewBox="0 0 48 48"
            >
              <g id="Layer_2" data-name="Layer 2">
                <g id="invisible_box" data-name="invisible box">
                  <rect width="48" height="48" fill="none"></rect>
                </g>
                <g id="icons_Q2" data-name="icons Q2">
                  <path
                    d="M34,8.1a7.6,7.6,0,0,1,5.6,2.4A7.7,7.7,0,0,1,42,16.1c0,2.1-1.3,4.5-3.9,7.4L24,38.5,9.9,23.5C7.3,20.6,6,18.2,6,16.1a7.7,7.7,0,0,1,2.4-5.6A7.6,7.6,0,0,1,14,8.1c2.2,0,5.1,2,6.5,4.5L23.1,17a1.1,1.1,0,0,0,1.8,0l2.6-4.4c1.4-2.5,4.3-4.5,6.5-4.5M34,4c-3.9,0-8,3.1-10,6.5C22,7.1,17.9,4,14,4A12,12,0,0,0,5.5,7.6,11.9,11.9,0,0,0,2,16.1c0,4.1,2.7,7.6,5,10.2L23.3,43.7a1,1,0,0,0,1.4,0L41,26.3c2.3-2.6,5-6.1,5-10.2A12.1,12.1,0,0,0,34,4Z"
                  ></path>
                </g>
              </g>
            </svg>

            <span>Favorites</span>
          </a>
        </li>

        <li class="nav-item">
          <a href="#">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="23"
              height="25"
              viewBox="0 0 48 48"
            >
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

            <span>Trash</span>
          </a>
        </li>
      </ul>

      <a href="#" class="nav-toggle icon-angle-left" @click="toggleNav">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="25"
          viewBox="0 0 48 48"
        >
          <g>
            <path
              d="M20.8,24,31.4,13.4a1.9,1.9,0,0,0-.2-3,2.1,2.1,0,0,0-2.7.2l-11.9,12a1.9,1.9,0,0,0,0,2.8l11.9,12a2.1,2.1,0,0,0,2.7.2,1.9,1.9,0,0,0,.2-3Z"
            ></path>
          </g>
        </svg>
      </a>

      <a href="#" class="nav-toggle icon-angle-right" @click="toggleNav">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="25"
          viewBox="0 0 48 48"
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
      </a>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      appItems: [
        {
          img: "Layers",
          color: "primary",
          active: true,
          text: "Templates",
          href: "#",
        },
        { img: "Files", color: "success-sub1", text: "Files", href: "#" },
        { img: "Signature", color: "orange", text: "eSign", href: "#" },
        { img: "Tick", color: "primary", text: "Project", href: "#" },
        { img: "CommentForum", color: "purple", text: "Chat", href: "#" },
      ],
    };
  },
  methods: {
    toggleNav: function () {
      document.querySelector("#__layout").classList.toggle("hide-nav");
    },
  },
};
</script>


<style scoped lang="scss">
.nav-bar {
  position: fixed;
  top: 4rem;
  left: 0;
  width: 4rem;
  height: 100%;
  background: $dark-sub2;
  z-index: 10;
}

.hide-nav {
  .nav-content {
    padding-right: 10px;
  }

  .nav-item svg {
    margin-right: 0;
  }

  .nav-items {
    padding-top: 2rem;

    span {
      width: 0;
      opacity: 0;
      visibility: hidden;
    }
  }

  .icon-angle-left {
    opacity: 0;
    visibility: hidden;
  }

  .icon-angle-right {
    opacity: 1;
    visibility: visible;
  }
}

.icon-angle-right {
  opacity: 0;
  visibility: hidden;
}

.icon-angle-left {
  opacity: 1;
  visibility: visible;
}

.nav-content {
  position: fixed;
  left: 4rem;
  top: 4rem;
  height: 100%;
  padding: 1rem 1rem 1rem 10px;
  background: $dark;
  transform: none;
  transition: transform 0.5s;
  z-index: -1;
}

.nav-bar .app-switcher {
  background: $dark-sub2;
}

.nav-items {
  padding-left: 0;
  transition: padding 0.5s;

  span {
    display: inline-block;
    width: 11rem;
    transition: width 0.5s;
  }
}

.nav-item {
  margin-bottom: 10px;
  font-size: $base-size;
  color: $gray6;
  line-height: 0;
  z-index: 10;

  a {
    color: $gray6;
  }

  svg {
    display: inline-block;
    line-height: 0;
    margin-right: 6px;
  }

  g {
    fill: $gray6;
  }

  span {
    vertical-align: super;
  }

  &:hover {
    &,
    a {
      color: #fff;
    }

    g {
      fill: #fff;
    }
  }
}

.nav-toggle {
  position: absolute;
  top: 1rem;
  right: 12px;

  g {
    fill: $gray6;
  }
}
</style>