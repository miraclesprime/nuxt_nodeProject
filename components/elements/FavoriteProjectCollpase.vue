<template>
    <div>
      <div
        :class="{
          'detail-collapse__header': true,
          'detail-collapse__header--non-expandable': nonExpandable,
          'header-fixed': fixHeader,
          'light': themeColor,
          'dark': !themeColor
        }"
           @click="
              () => {
                if (!fixed) openDetails();
              }
                "
      >
  
         <bib-icon
          v-if="!fixed"
          ref="icon"
          icon="arrow-down"
          :scale="0.6"
        ></bib-icon>
        <div
            v-if="label"
            class="detail-collapse__header__title"
            :class="{'label-dark':themeColor,'label-light:':!themeColor}"
          >
        {{ label }}
      </div>
           
        <div class="d-flex align-center gap-0" v-if="buttons">
          <template v-for="(icon, key) of buttons">
            <div
              @click.stop="$emit(icon.event, $event)"
              class="d-flex align-center height-2 pl-0625 mr-05"
              :class="'bg-' + icon.bg + ' shape-' + icon.shape + ' ' + icon.class"
              :key="key"
            >
              <bib-icon
                :icon="icon.src"
                :scale="icon.scale"
                :variant="icon.variant"
              ></bib-icon>
              <template v-if="icon.label">
                <span
                  :class="['text-' + icon.label.variant, icon.label.class]"
                  class="font-sm font-w-500"
                >
                  <span class="ml-0625">{{ icon.label.text }} </span>
                </span>
              </template>
            </div>
          </template>
        </div>
        <div v-if="this.$slots.switcher" class="detail-collapse__switcher">
          <slot name="switcher"></slot>
        </div>
      </div>
      <div
        ref="content"
        class="detail-collapse__content mostly-customized-scrollbar"
        :class="{
          'bib-collapse': !open,
          'header-content-fixed': fixHeader,
          'detail-collapse__content_space': extraSpace,
        }"
      >
        <slot name="content"> </slot>
      </div>
    </div>
  </template>
  
  <script>

import { mapGetters } from "vuex";
  export default {
    name: "PeopleSortCollapse",
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
      variant: {
        type: String,
        default() {
          return "dark";
        },
      },
      open: {
        type: Boolean,
        default() {
          return false;
        },
      },
      fixed: {
        type: Boolean,
        default() {
          return false;
        },
      },
      labelWeight: {
        type: String,
        default() {
          return '600'
        },
      },
      nonExpandable: {
        type: Boolean,
        default: false,
      },
      buttons: {
        type: Array,
        default: null,
      },
      fixHeader: {
        type: Boolean,
        default: false,
      },
      extraSpace: {
        type: Boolean,
        default() {
          return false;
        },
      },
    },
    data() {
      return {
        id: null,
        sortUser:[],
        checkRole:false,
        collapseCount:0
      };
    },
    computed: {
      getLabelWeight() {
        return `font-w-${this.labelWeight}`;
      },
      ...mapGetters({
      allTasks:"company/getInitialAllTasks",
      isAdmin:"user/getIsAdmin"
    }),
    },
    watch: {
      allTasks(newVal)
      {
            let data = _.cloneDeep(newVal)
            this.sortUser= Object.values(
                  data.reduce((acc, curr) => {
                    if (acc[curr.userId]) {
                      acc[curr.userId].taskCount++;
                      if (curr.statusId === 5) {
                        acc[curr.userId].complete++;
                      }
                    } else {
                      acc[curr.userId] = {
                        userId: curr.userId,
                        taskCount: 1,
                        complete: curr.statusId === 5 ? 1 : 0
                      };
                    }
                    return acc;
                  }, {})
                );
        },
        isAdmin: {
        immediate: true, // Execute the watcher immediately on component mount
        handler(newValue) {
          this.updateMaxHeight(newValue);
        }
      }

  },
  mounted(){
    this.updateMaxHeight(this.isAdmin)
  },

    methods: {

      updateMaxHeight(checkRole) {
        const divElement = this.$refs.content;
        if (divElement) {
        if (checkRole) {
          divElement.style.maxHeight = '200px';
        } else {
          divElement.style.maxHeight = `${window.innerHeight - 370}px`;
        }
      }
  },
      changeSortPeople(item){
      this.$store.commit("user/sortPeople",{sort:item,data:this.sortUser});
    },
      openDetails() {
        this.collapseCount+=1
        let status=this.collapseCount%2==1?"false":"true"
          this.$store.commit("project/setCollapseStatus",status)
        if (this.nonExpandable) return;
        let collapse = this.$refs.content;
        if (collapse) collapse.classList.toggle("bib-collapse");
        let icon = this.$refs.icon.$vnode.elm;
        if(this.collapseCount%2==0){
          icon.style.transform = 'rotate(0deg)';
        }
        else {
          icon.style.transform = 'rotate(-90deg)';
        }
        if (icon) icon.classList.toggle("flip");
        this.$emit("click");
      },
    },
  };
  </script>
  
  <style lang="scss">
.label-dark {
color: grey;
font-weight: 400;
&:hover {
        color: black;
    }
}
.label-light {
  font-weight: 400;
  &:hover {
        color: white
    }
}
  .light {
    &:hover {
      background-color:#f2f2f5;
        border-radius: 4px;
    }  
  }
  .dark {
    &:hover {
      background-color: white;
        color: black;
        border-radius: 4px;
    }  
  }
  .detail-collapse {
    &__header {
      padding: 0 0.4rem 0 0.4rem !important;
      display: flex;
      align-items: center;
      height: 2.5rem;
      font-size: $base-size;
      font-weight: 600;
      margin: 0 0.4rem 0 0.4rem !important;
      grid-template-columns: 2.5rem 1fr !important;
      gap: 0.5rem !important;
      cursor: pointer;
      &--non-expandable {
        cursor: auto;
      }
      &__title {
        padding-left: 0.5rem;
        color: $gray6;
      }
 
    }
    &__content {
      height: 100%;
    }
    &__switcher {
      margin-left: auto;
    }
  
  }
  
  .header-fixed {
    position: sticky; // detail-collapse__header
    z-index: 3;
    // top: 4rem;
    top: 0;
    width: 100%;
    background: #fff;
  }
  .header-content-fixed {
    position: relative; // detail-collapse__content
    height: 100%;
    //  z-index: 2;
  }
  
  .text-white-hover:hover {
    span {
      color: #fff;
    }
  }
  
  .detail-collapse__content_space {
    margin-bottom: 1rem !important;
  }

  </style>
