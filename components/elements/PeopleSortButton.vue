<template>

  <a

    class="button"
    :class="[
      'button--' + size,
      action ? 'button-action' : '',
      variant ? 'button--' + variant : '',
      pill ? 'button--pill' : '',
      squared ? 'button--squared' : '',
      plus ? 'button--plus' : '',
      dropdown != null || dropdown1 != null ? 'button--drop' : '',
      pop ? 'button--pop' : '',
      disabled == true ? 'button--disabled' : '',
      icon ? 'button--icon' : '',
    ]"
    :href="href"
    @click="$emit('click')"
    :test_id="test_id"
    :test_name="test_name"
    @mouseover="handleMouseover"
    @mouseleave="handleMouseleave"
  >
 
    <template v-if="plus">
      <bib-icon icon="add" variant="success" :scale="1.5"> </bib-icon>
      {{ label }}
    </template>

    <template v-else-if="dropdown != null">
      <div class="menu">
        <details :id="id">
          <summary v-click-outside="outsideMenu" :class="themeColor?'light-button':'dark-button'">
            {{ label }}
          </summary>

          <div class="drop wrapper" @mouseup="clickItemClose && outsideMenu()">
            <slot name="menu"></slot>
          </div>
        </details>
      </div>
    </template>

    <template v-else-if="dropdown1 != null">
      <div class="menu">
        <details
          :id="id"
          v-click-outside="outsideMenu"
          class="menu__custom1"
          :class="{ opened: dropdown1Opened }"
        >
          <summary :id="test_id">
            <bib-input
              :size="size"
              v-model="searchKey"
              :placeholder="label"
              @focus="inputFocus"
              @input="$emit('input-keydown', searchKey)"
              @change="$emit('input-change')"
              :input_feedback_style="input_feedback_style"
              :input_feedback_class="input_feedback_class_button"
            ></bib-input>
          </summary>

          <div class="drop wrapper" @click="outsideMenu">
            <slot name="menu"></slot>
            <div
              v-if="footer"
              class="d-flex bg-white p-05 border-gray1"
              style="border-top: none"
              @click="$emit(footer.event)"
            >
              <bib-icon
                :icon="footer.icon"
                variant="success"
                :scale="1.2"
              ></bib-icon>
              <span class="ml-05"> {{ footer.label }} </span>
            </div>
          </div>
        </details>
      </div>
    </template>

    <template v-else-if="pop != null">
      <div class="menu">
        <details
          :id="id"
          v-click-outside="outsideMenu"
          @mouseover="popMouseover"
          @mouseleave="popMouseleave"
        >
          <summary>
            <bib-icon :icon="pop" :scale="scale" :variant="iconVariant" v-tooltip="tooltipTitle">
            </bib-icon>
            {{ label }}
          </summary>

          <div class="pop">
            <slot name="menu"></slot>
          </div>
        </details>
      </div>
    </template>

    <template v-else-if="type">
      <button
        class="button__button-reset text-center w-100"
        :type="type"
        :form="form"
        :class="action ? 'button-action' : ''"
      >
        <slot name="button">{{ label }}</slot>
      </button>
    </template>

    <template v-else>
      <div class="text-center w-100 align-center" :class="action ? 'button-action' : ''">
        <bib-icon
          v-if="icon"
          :icon="icon"
          :scale="size === 'lg' ? 0.9 : 0.8"
          :variant="btnIconVariant"
          class="btn_icon"
        ></bib-icon>
        <slot name="button">{{ label }}</slot>
      </div>
    </template>
  </a>
</template>

<script>

export default {
  name: "BibButton",
  props: {
    themeColor: {
        type: Boolean,
        default() {
          return true;
        },
      },
    label: {
      type: String,
      default() {
        return null;
      },
    },
    href: {
      type: String,
      default() {
        return null;
      },
    },
    size: {
      type: String,
      default() {
        return "md";
      },
    },
    variant: {
      type: String,
      default() {
        return "";
      },
    },
    pill: {
      type: Boolean,
      default() {
        return false;
      },
    },
    action: {
      type: Boolean,
      default() {
        return false;
      },
    },
    squared: {
      type: Boolean,
      default() {
        return false;
      },
    },
    plus: {
      type: Boolean,
      default() {
        return null;
      },
    },
    dropdown: {
      type: String,
      default() {
        return null;
      },
    },
    dropdown1: {
      type: String,
      default() {
        return null;
      },
    },
    footer: {
      type: Object,
      default() {
        return null;
      },
    },
    iconVariant: {
      type: String,
      default() {
        return null;
      },
    },
    pop: {
      type: String,
      default() {
        return null;
      },
    },
    scale: {
      type: Number,
      default() {
        return 1;
      },
    },
    disabled: {
      type: Boolean,
      default() {
        return false;
      },
    },
    type: {
      type: String,
      default() {
        return null;
      },
    },
    test_id: {
      type: String,
      default() {
        return null;
      },
    },
    test_name: {
      type: String,
      default() {
        return null;
      },
    },
    input_feedback_style: {
      type: String,
      default() {
        return null;
      },
    },
    input_feedback_class_button: {
      type: Boolean,
      default() {
        return false;
      },
    },
    clickItemClose: {
      type: Boolean,
      default: false,
    },
    form: {
      type: String,
      default: null,
    },
    icon: {
      type: String,
      default: null,
    },
    tooltipTitle: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      id: this._uid,
      dropdown1Opened: false,
      searchKey: "",
      isMoseover: false,
    };
  },
  computed: {
    btnIconVariant() {
      switch(this.variant) {
        case 'primary':
        case 'secondary':
        case 'success':
        case 'danger':
        case 'warning':
          return 'white'
        case 'primary--light':
        case 'primary--outline':
          return !this.isMoseover ? 'primary' : 'white'
        case 'secondary--light':
        case 'secondary--outline':
          return !this.isMoseover ? 'secondary' : 'white'
        case 'success--light':
        case 'success--outline':
          return !this.isMoseover ? 'success' : 'white'
        case 'warning--light':
        case 'warning--outline':
          return !this.isMoseover ? 'warning' : 'white'
        case 'danger--light':
        case 'danger--outline':
          return !this.isMoseover ? 'danger' : 'white'
      }
    },
  },
  mounted() {
    if (this.pop) {
      this.calcMenuPos(this.id);
    }
    this.addEvents();
  },
  methods: {
    handleMouseover() {
      this.isMoseover = true;
      this.$emit('mouseover');
    },
    handleMouseleave() {
      this.isMoseover = false;
      this.$emit('mouseleave');
    },
    calcMenuPos(id) {
      if (document.getElementById(id)) {
        var el = document.getElementById(id);
        var observer = new IntersectionObserver(
          (entries, observer) => {
            entries.forEach((entry) => {
              if (entry.intersectionRatio < 1 && entry.intersectionRatio > 0) {
                entry.target.lastChild.style.top = "0rem";
                entry.target.lastChild.style.left = "-11rem";
                entry.target.style.width = "0rem";
              } else if (
                entry.target.firstChild != null &&
                entry.target.firstChild.offsetWidth > 0
              ) {
                if (
                  entry.rootBounds.width != null &&
                  entry.rootBounds.width - entry.intersectionRect.left <
                    el.firstChild.offsetWidth &&
                  !el.firstChild.classList.contains("wrapper")
                ) {
                  entry.target.style.position = "absolute";
                  entry.target.style.left = "0";
                  entry.target.style.top = ".5rem";
                } else if (el.firstChild.classList.contains("wrapper")) {
                  entry.target.style.position = "absolute";
                  entry.target.style.top = "1.5rem";
                  entry.target.style.left = "-11rem";
                }
              }
            });
          },
          { root: null, rootMargin: "0px", threshold: 0.9 }
        );
        observer.observe(el);
      }
    },
    inputFocus() {
      if (this.test_id) {
        document.getElementById(this.test_id).click();
      }
      this.dropdown1Opened = true;
    },
    dropdownToggle() {
      const opened = document.getElementById(this.id).open;
      document.getElementById(this.id).open = opened;
      this.dropdown1Opened = !opened;
    },
    outsideMenu() {
      if (document.getElementById(this.id)) {
        document.getElementById(this.id).open = false;
        this.dropdown1Opened = false;
      }
    },
    addEvents() {
      var $parents = document.querySelectorAll("ul >.parent"),
        $wrappers = document.querySelectorAll(".wrapper");
      if ($parents != null) {
        for (var $parent = 0; $parent < $parents.length; $parent++) {
          $parents[$parent].addEventListener("mouseover", this.recalPosMenu);
        }
      }
      if ($wrappers != null) {
        for (var $wrapper = 0; $wrapper < $wrappers.length; $wrapper++) {
          $wrappers[$wrapper].addEventListener("scroll", this.recalPosMenu);
        }
      }
    },
    recalPosMenu($this) {
      var $menuItemPos = $this.target.getBoundingClientRect(),
        $submenuWrappers = $this.target.querySelectorAll("li > .wrapper");

      if ($submenuWrappers != null) {
        for (var $wrapper = 0; $wrapper < $submenuWrappers.length; $wrapper++) {
          if ($menuItemPos.top < 150) {
            $submenuWrappers[$wrapper].style.top =
              Math.round($menuItemPos.top - $this.clientX * 0.18) + "px";
          }
        }
      }
    },
    popMouseover() {
      document.getElementById(this.id).open = true;
    },
    popMouseleave() {
      document.getElementById(this.id).open = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.light-button {
  color:dark !important;
}
.dark-button {
  color:grey !important;
}
.button {
  display: inline-block;
  align-items: center;
  position: relative;
  text-decoration: none;
  cursor: pointer;
  padding: 0.25rem 1rem;
  border-radius: 0.25rem;
  white-space: nowrap;
  user-select: none;
  $self: &;

  &__button-reset {
    position: relative;
    border: none;
    outline: none;
    background: none;
    padding: 0;
    margin: 0;
    font-size: inherit;
    color: inherit;

    &::after {
      position: absolute;
      content: "";
      background: none;
      width: calc(100% + 60px);
      height: calc(100% + 12px);
      left: -30px;
      top: -6px;
      cursor: pointer;
    }
  }

  &--dark-sub3 {
    background-color: $dark-sub3;
    color: $white;
    &--light {
      background-color: $light;
      color: $dark-sub3;
    }
    &--outline {
      background-color: transparent;
      color: $dark-sub3;
      outline: 1px solid $dark-sub3;
    }
    &--light,
    &--outline {
      &:hover {
        background-color: $dark-sub3;
        color: $white;
      }
      &:focus,
      &:active,
      &:focus-within {
        box-shadow: 0 0 0 0.2rem $dark-sub3;
      }
    }
    &:focus,
    &:active,
    &:focus-within {
      box-shadow: 0 0 0 0.2rem $dark-sub3;
    }
  }

  &--primary {
    background-color: $primary;
    color: $white;
    &--light {
      background-color: $white;
      color: $primary;
    }
    &--outline {
      background-color: transparent;
      color: $primary;
      outline: 1px solid $primary;
    }
    &--light,
    &--outline {
      &:hover {
        background-color: $primary;
        color: $white;
      }
      &:focus,
      &:active,
      &:focus-within {
        box-shadow: 0 0 0 0.2rem $primary-sub2;
      }
    }
    &:focus,
    &:active,
    &:focus-within {
      box-shadow: 0 0 0 0.2rem $primary-sub2;
    }
  }

  &--success {
    background-color: $success;
    color: $white;
    &--light {
      background-color: $white;
      color: $success;
    }
    &--outline {
      background-color: transparent;
      color: $success;
      outline: 1px solid $success;
    }
    &--light,
    &--outline {
      &:hover {
        background-color: $success;
        color: $white;
      }
      &:focus,
      &:active,
      &:focus-within {
        box-shadow: 0 0 0 0.2rem $success-sub2;
      }
    }
    &:focus,
    &:active,
    &:focus-within {
      box-shadow: 0 0 0 0.2rem $success-sub2;
    }
  }

  &--secondary {
    background-color: $secondary;
    color: $white;
    &--light {
      background-color: $white;
      color: $secondary;
    }
    &--outline {
      background-color: transparent;
      color: $secondary;
      outline: 1px solid $secondary;
    }
    &--light,
    &--outline {
      &:hover {
        background-color: $secondary;
        color: $white;
      }
      &:focus,
      &:active,
      &:focus-within {
        box-shadow: 0 0 0 0.2rem $secondary-sub2;
      }
    }
    &:focus,
    &:active,
    &:focus-within {
      box-shadow: 0 0 0 0.2rem $secondary-sub2;
    }
  }

  &--gray {
    background-color: $gray4;
    color: $gray6;
    &--light {
      background-color: $white;
      color: $gray6;
    }
    &--outline {
      background-color: transparent;
      color: $gray6;
      outline: 1px solid $gray6;
    }
    &--light,
    &--outline {
      &:hover {
        background-color: $gray6;
        color: $white;
      }
      &:focus,
      &:active,
      &:focus-within {
        box-shadow: 0 0 0 0.2rem $secondary-sub2;
      }
    }
    &:focus,
    &:active,
    &:focus-within {
      box-shadow: 0 0 0 0.2rem $secondary-sub2;
    }
  }

  &--danger {
    background-color: $danger;
    color: $white;
    &--light {
      background-color: $white;
      color: $danger;
    }
    &--outline {
      background-color: transparent;
      color: $danger;
      outline: 1px solid $danger;
    }
    &--light,
    &--outline {
      &:hover {
        background-color: $danger;
        color: $white;
      }
      &:focus,
      &:active,
      &:focus-within {
        box-shadow: 0 0 0 0.2rem $danger-sub2;
      }
    }
    &:focus,
    &:active,
    &:focus-within {
      box-shadow: 0 0 0 0.2rem $danger-sub2;
    }
  }

  &--light {
    background-color: $light;
    color: $black;

    &--outline {
      background-color: transparent;
      color: $light;
      outline: 1px solid $light;
    }
    &--outline {
      &:hover {
        background-color: $light;
        color: $white;
      }
      &:focus,
      &:active,
      &:focus-within {
        box-shadow: 0 0 0 0.2rem $light;
      }
    }
    &:focus,
    &:active,
    &:focus-within {
      box-shadow: 0 0 0 0.2rem $light;
    }
  }

  &--warning {
    background-color: $warning;
    color: $white;
    &--light {
      background-color: $white;
      color: $warning;
    }
    &--outline {
      background-color: transparent;
      color: $warning;
      outline: 1px solid $warning;
    }
    &--light,
    &--outline {
      &:hover {
        background-color: $warning;
        color: $white;
      }
      &:focus,
      &:active,
      &:focus-within {
        box-shadow: 0 0 0 0.2rem $warning-sub2;
      }
    }
    &:focus,
    &:active,
    &:focus-within {
      box-shadow: 0 0 0 0.2rem $warning-sub2;
    }
  }

  &--xl {
    padding: 0.6rem 1.2rem;
    font-size: $base-size;
  }

  &--lg {
    padding: 0.4rem 1.2rem;
    font-size: $base-size;
  }

  &--md {
    padding: 0.3rem 1rem;
    font-size: $base-size;
  }

  &--sm {
    padding: 0.2rem 0.8rem;
    font-size: $font-size-sm;
  }

  &--pill {
    border-radius: 50rem;
    padding-left: 2rem;
    padding-right: 2rem;
    // &>*{
    //   line-height: 1.6;
    // }
  }

  &--icon {
    padding-left: 2rem;
    padding-right: 2rem;
    .btn_icon {
      position: absolute;
      left: 0.8rem;
    }
  }

  &--squared {
    border-radius: 0rem;
  }

  &--disabled {
    cursor: not-allowed;
    display: inline-block; /* For IE11/ MS Edge bug */
    pointer-events: none;
    text-decoration: none;
    &.button--primary {
      background-color: $primary-sub2;
      &--light {
        background-color: $white;
        color: $primary-sub2;
      }
      &--outline {
        background-color: transparent;
        color: $primary-sub2;
        border: 1px solid $primary-sub2;
      }
    }
    &.button--success {
      background-color: $success-sub2;
      &--light {
        background-color: $white;
        color: $success-sub2;
      }
      &--outline {
        background-color: transparent;
        color: $success-sub2;
        border: 1px solid $success-sub2;
      }
    }
    &.button--secondary {
      background-color: $secondary-sub1;
      &--light {
        background-color: $white;
        color: $secondary-sub1;
      }
      &--outline {
        background-color: transparent;
        color: $secondary-sub1;
        border: 1px solid $secondary-sub1;
      }
    }
    &.button--danger {
      background-color: $danger-sub2;
      &--light {
        background-color: $white;
        color: $danger-sub2;
      }
      &--outline {
        background-color: transparent;
        color: $danger-sub2;
        border: 1px solid $danger-sub2;
      }
    }
    &.button--warning {
      background-color: $warning-sub2;
      &--light {
        background-color: $white;
        color: $warning-sub2;
      }
      &--outline {
        background-color: transparent;
        color: $warning-sub2;
        border: 1px solid $warning-sub2;
      }
    }
  }

  &--plus {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    height: 2.5rem;
    color: $gray6;
    font-weight: 400;
    font-size: $base-size;
    padding: 0.5rem;
  }

  details {
    display: block;

    summary {
      display: flex;
      align-items: center;
      background: transparent;
      position: relative;
      cursor: pointer;
      width: 100%;
      font-weight: 400;
      font-size: 0.9rem;
      grid-gap: 0;
      padding-left: 0.5rem;

      &:hover {
        color: $dark;

        &::before {
          color: $dark;
        }
      }
    }

    &[open] {
      summary {
        color: $dark;
      }
    }
  }

  &--drop {
    display: flex;
    align-items: center;
    max-height: $item-height;
    font-size: $base-size;
    font-weight: 400 !important;
    gap: 0.25rem;
    padding: 0;

    .menu {
      width: 100%;

      details {
        summary {
          justify-content: center;
        }
        .wrapper {
          display: flex;
          flex-direction: column;
          text-align: center;
          position: absolute;
          left: 100%;
          top: 1.5rem;
          min-width: 10rem;
          max-height: 11.5rem;
          z-index: 50;
          transform: translate(-50%, 0px);

          ul {
            max-height: 11.5rem;
            padding-left: 0;
            overflow-x: hidden;
            overflow-y: auto;
            list-style: none;
            text-align: left;
            border: $gray3 solid 1px;
            border-radius: 0.5rem;
            box-shadow: 0rem 0rem 0.4rem 0.1rem
              rgba($color: $gray2, $alpha: 0.7);
            background: $white;

            li {
              position: static;
              padding: 0.5rem;
              margin: 0.2rem;

              .wrapper {
                position: absolute;
                display: none;
                min-width: 12rem;
                left: -12rem;
                z-index: 10;
              }

              &:hover {
                color: $dark;
                background-color: $light;
                .wrapper {
                  display: block;
                }
              }

              &:active {
                font-weight: 600;
              }
            }
          }
        }
      }

      &__custom1 {
        line-height: 1.2;
        // width: 100%;
        // border: 1px solid $gray4;
        // border-radius: 0.2rem;
        // color: $dark;
        // min-height: 2.5rem;
        // background-color: $white;
        // &.opened {
        //   border-radius: 0;
        //   border: 2px solid $gray6;
        // }
        summary {
          transform: translateY(5px);
          div {
            font-size: $base-size;
            span {
              color: $gray5;
            }
          }
        }
        .wrapper {
          top: 2.5rem !important;
          width: 100% !important;
          ul li {
            padding: 0.3rem 0.3rem !important;
            border-top: 1px solid $gray3;
          }
        }
      }
    }
  }

  &--pop {
    display: flex;
    align-items: center;
    color: $gray1;
    min-width: 1.5rem;
    min-height: 1.5rem;
    font-size: $base-size;
    font-weight: 400;
    line-height: 0.8;
    padding: 0;
    // z-index: 10;

    .menu {
      position: absolute;
      top: 0;
      margin-left: 4px;

      details {
        min-width: 1rem;
        summary {
          &::before {
            margin-left: -1rem;
            color: transparent;
          }
        }
      }
    }
  }

  .drop {
    position: relative;
  }

  .pop {
    min-width: math.div($item-width, 1.5);
    width: max-content;
    height: 100%;
    border: $gray3 solid 1px;
    border-radius: 0.4rem;
    box-shadow: 0rem 0rem 0.8rem 0.1rem rgba($color: $gray2, $alpha: 0.7);
    // background-color: $white;
    position: relative;
    z-index: 3;
  }
}

</style>