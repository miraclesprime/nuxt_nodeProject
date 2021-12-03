<template>
  <div>
    <task-actions />
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
    }
  }, 
  methods: {

    handleWeekendsToggle() {
      this.calendarOptions.weekends = !this.calendarOptions.weekends // update a property
    },

    handleDateSelect(selectInfo) {
      let title = alert('Please use add task/secton above to create your task')
      let calendarApi = selectInfo.view.calendar

      calendarApi.unselect() // clear date selection

      if (title) {
        calendarApi.addEvent({
          id: createEventId(),
          title,
          dueDate: 'Nov 30, 2021',
          completed: false,
          start: selectInfo.startStr,
          end: selectInfo.endStr,
          allDay: selectInfo.allDay
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
