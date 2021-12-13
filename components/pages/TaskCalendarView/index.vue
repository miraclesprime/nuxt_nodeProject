<template>
  <div>
    <task-actions ref="childComponent" @change-data='taskCreate' />
    <div id='myDiv'>
    <FullCalendar class='demo-app-calendar' :options='calendarOptions'>
        <template v-slot:eventContent='arg'>
          <div style="display: flex;">
            <span v-if='arg.event.extendedProps.completed == false'>
                <div class="not-completed"></div>
            </span>
            <span v-else>
                <div class="success-checkmark"></div>
            </span>

            <div class="event-box">
              <span class='event-title' :class="{'limitTitle': isExpand}">{{ arg.event.title }}</span>
              <br>
              <span class="due-date">Due {{arg.event.extendedProps.dueDate}}</span>
            </div> 

            <div class="dropdown">
                <button class="dropbtn">...</button>
                <div class="dropdown-content">
                  <a href="#">Edit</a>
                  <a href="#">Delete</a>
                </div>
              </div> 
          </div>
        </template>
      </FullCalendar>
    </div>
    
  </div>
</template>

<script>
import FullCalendar from '../../../modules/@fullcalendar/vue'
import dayGridPlugin from '../../../modules/@fullcalendar/daygrid'
import interactionPlugin from '../../../modules/@fullcalendar/interaction'
// import timeGridPlugin from '../../../modules/@fullcalendar/timegrid'
import { SAMPLE_EVENTS, createEventId } from '../../../utils/calendar-utils'

export default {
  props: {
    tasks: {
      type: Array,
      default: []
    },
    fields: {
      type: Array,
      default: []
    },
  },
  components: {FullCalendar},
  data: function() {
    return {
      sampleAssets: SAMPLE_EVENTS,
      isExpand: true,
      calendarOptions: {
        plugins: [
          dayGridPlugin,
          // timeGridPlugin,
          interactionPlugin
        ],
        headerToolbar: {
          left: 'title', 
          right: 'dayGridMonth,dayGridWeek,dayGridDay'
        },
        views: {
          // we can specify particular view for particular layout here
        },
        initialView: 'dayGridMonth',
        windowResizeDelay: 200,
        initialEvents: SAMPLE_EVENTS,
        editable: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        weekends: true,
        // style related
        eventColor: '#7287c3',
        eventBackgroundColor: '#fcfcfc',
        eventTextColor: 'black',
        eventBorderColor: '#ccc',
        // event handling
        select: this.handleDateSelect,
        eventClick: this.handleEventClick,
        eventsSet: this.handleEvents,
        eventDrop: this.handleEventDrop,
        eventResize: this.handleEventResize,
        // Events that can be used after API is hit -------
        eventAdd: this.handleEventAdd, 
        eventChange: this.handleEventChange, 
        eventRemove: this.handleEventRemove 
      },
      currentEvents: []
    }
  }, 
  methods: {

    handleWeekendsToggle() {
      this.calendarOptions.weekends = !this.calendarOptions.weekends // update a property
    },

    handleDateSelect(selectInfo) {
      // let title = prompt('Please use add task/secton above to create your task')
      this.$refs.childComponent.showCreateTaskModal(selectInfo);
    },
    
    taskCreate($event) {
      console.log("data", $event)

      let calendarApi = $event.selectInfo.view.calendar

      calendarApi.unselect() // clear date selection
      console.log($event.title)

      if ($event.title) {
        calendarApi.addEvent({
          id: createEventId(),
          title: $event.title,
          dueDate: $event.dueDate,
          start: $event.selectInfo.startStr,
          end: $event.selectInfo.endStr,
          allDay: $event.selectInfo.allDay
        })
      }
    },

    handleEventClick(clickInfo) {
      // if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      //   clickInfo.event.remove()
      // }
      console.log('hello')
    },

    handleEvents(events) {
      this.currentEvents = events
    },

    handleEventDrop(eventDropInfo) {
      alert('Task Drop to date ' + eventDropInfo.event.startStr);
    },

    handleEventResize(eventResizeInfo) { 
      console.log(eventResizeInfo)
      alert('Task Resize from date ' + eventResizeInfo.event.startStr + ' to end date ' + eventResizeInfo.event.endStr);
    },

    // Functions handling callbacks ------
    handleEventAdd(addInfo) {
      console.log("addInfo: ", addInfo)
    },

    handleEventRemove(removeInfo) {
      console.log("remove Info: ", removeInfo)
    },

    handleEventChange(changeInfo) {
      console.log('change Info: ',  changeInfo)
    },

  },
};
</script>

<style scoped>
#myDiv {
  max-height: 75vh; 
  overflow: auto; 
  box-sizing: content-box; 
  width: 100%; 
  /* padding: 3px; */
}

.event-box {
  margin-right: auto; 
  font-size: 11px;
  color: #2E2F31; 
  padding: 2px;
}

.limitTitle {
  width: 15ch;
  overflow: hidden;
  white-space: nowrap;
}

.due-date {
  font-size: 8px; 
  color: #6d7278;
}

.event-title {
  font-weight: bold;
  text-transform: capitalize;
}

/* Dropdown Button */
.dropbtn {
  opacity: 0;
  color: grey;
  font-size: 16px;
  border: none;
  background: none;
}

/* The container <div> - needed to position the dropdown content */
.dropdown {
  position: relative;
  display: inline-block;
}

/* Dropdown Content (Hidden by Default) */
.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f1f1f1; /* dropdown content color */
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 9999;
}

/* Links inside the dropdown */
.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

/* Change color of dropdown links on hover */
.dropdown-content a:hover {background-color: #ddd;}

/* Show the dropdown menu on hover */
.dropdown:hover .dropdown-content {display: block;}

/* Change the background color of the dropdown button when the dropdown content is shown */
.dropdown:hover .dropbtn {background: none; color: grey; opacity: 1;}

a.fc-event:hover .dropbtn {
  opacity: 1;
}

/* CIRCULAR TICK */
.success-checkmark:after {
      content: '✔';
      position: relative;
      left:0; top: 5px;
      padding: 3px;
      width: 20px; 
      height: 20px;
      text-align: center;
      border: 1px solid #2E2F31;
      background: #2ba026;
      border-radius: 50%;
      margin-right: 2px;
      color: white;
      box-shadow: inset 0 1px 3px rgba(0,0,0,.3)
    }
  
  .not-completed:after {
    content: '✔';
    position: relative;
    left:0; top: 5px;
    padding: 3px;
    width: 20px; 
    height: 20px;
    text-align: center;
    border: 1px solid #2E2F31;
    background: #ccc; 
    color: rgb(95, 95, 95);
    border-radius: 50%;
    margin: 2px;
    box-shadow: inset 0 1px 3px rgba(0,0,0,.3)
  }

</style>
