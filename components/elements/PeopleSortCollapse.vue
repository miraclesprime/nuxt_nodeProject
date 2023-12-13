<template>
    <div >
      <div
        :class="{
          'detail-collapse__header': true,
          'detail-collapse__header--non-expandable': nonExpandable,
          'header-fixed': fixHeader,
          'light': themeColor,
          'dark': !themeColor
        }"
      >
      <!-- :variant="dark" -->
          <bib-icon
          v-if="!fixed"
          ref="icon"
          icon="arrow-down"
          :scale="0.6"
          @click="
              () => {
                if (!fixed) openDetails();
              }
                "
        ></bib-icon>
        <people-sort-button  dropdown="" label="People"  :themeColor="themeColor" >
                  <template v-slot:menu >
                      <ul class="move-people-dropdown">
                          <li class="d-flex align-center">
                          <span class="ml-05" @click="changeSortPeople('Most_Tasks_Todo')">Most Tasks Todo</span>
                          </li>
                          <li class="d-flex align-center">
                          <span class="ml-05" @click="changeSortPeople('Least_Tasks_Todo')">Least Tasks Todo</span>
                          </li>
                          <li class="d-flex align-center">
                          <span class="ml-05" @click="changeSortPeople('Most_Task_Completed')">Most Task Completed</span>
                          </li>
                          <li class="d-flex align-center">
                          <span class="ml-05" @click="changeSortPeople('Least_Task_Completed')">Least Task Completed</span>
                          </li>
                      </ul>
                  </template>
              </people-sort-button>
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
        :style="{'height':collapseStatus=='true'?`calc(100vh - ${favoHeight}px) !important`:`calc(100vh - 400px) !important`}"
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
        collapseStatus:"true",
        favoriteProjects:[],
        favoHeight:0,
        collapseCount:0
      };
    },
    computed: {
      getLabelWeight() {
        return `font-w-${this.labelWeight}`;
      },
      ...mapGetters({
      // allTasks:"company/getInitialAllTasks",
      favoriteCollapse:"project/getCollapseStatus",
      favProjects: "project/getFavProjects",

    }),
    },
    watch: {
      // allTasks(newVal)
      // {
      //       let data = _.cloneDeep(newVal)
      //       this.sortUser= Object.values(
      //             data.reduce((acc, curr) => {
      //               if (acc[curr.userId]) {
      //                 acc[curr.userId].taskCount++;
      //                 if (curr.statusId === 5) {
      //                   acc[curr.userId].complete++;
      //                 }
      //               } else {
      //                 acc[curr.userId] = {
      //                   userId: curr.userId,
      //                   taskCount: 1,
      //                   complete: curr.statusId === 5 ? 1 : 0
      //                 };
      //               }
      //               return acc;
      //             }, {})
      //           );
      //   },
        favProjects : {
          immediate:true,
          handler(newVal){
              this.favoriteProjects=_.cloneDeep(newVal)
              if(this.favoriteProjects){
                if(this.favoriteProjects.length>5){
                  this.favoHeight=600
                }
                else {
                  this.favoHeight=400+this.favoriteProjects.length * 40
                }
              }
              else {
                this.favoHeight=400
              }
          }
        },
        favoriteCollapse:{
          immediate:true,
          handler(newValue){
            this.collapseStatus=_.cloneDeep(newValue)
          }
      },
  },
 
    methods: {

      changeSortPeople(item){
    this.$axios.$get(`company/tasks/all`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, 'Filter':'all' }
    }).then ((res)=>{
        
       let arr=[]
        arr=res.data
        arr = arr.reduce((acc, ele) => {
          return [...acc, ...ele.tasks];
        }, []);

        this.sortUser= Object.values(
          arr.reduce((acc, curr) => {
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
        console.log("111",this.sortUser)
        this.$store.commit("user/sortPeople",{sort:item,data:this.sortUser});
    });
       
    },
      openDetails() {
        let icon = this.$refs.icon.$vnode.elm;
        this.collapseCount++;
        if(this.collapseCount%2==0) {
          icon.style.transform = 'rotate(0deg)';
        }
        else {
          icon.style.transform = 'rotate(-90deg)';
        }
        
        if (this.nonExpandable){
          return;
        } 
        let collapse = this.$refs.content;
        if (collapse) {
          collapse.classList.toggle("bib-collapse");
        }
       
        if (icon) 
        {
          icon.classList.toggle("flip");
          
      }
        this.$emit("click");
      },
    },
  };
  </script>
  
  <style lang="scss">

  .light {
    &:hover {
      background-color:#f2f2f5;
        color: black;
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
  .move-people-dropdown {
     position: absolute;
     left: 50% !important; 
     transform: translate(20%,0)!important;
}
  </style>
