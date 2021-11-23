<template>
  <div>
    <task-actions />
    <div id='myDiv'>
    <FullCalendar class='demo-app-calendar' :options='calendarOptions'>
        <template v-slot:eventContent='arg'>
          <div style='overflow: hidden;'>
            <span v-if='arg.event.extendedProps.completed == false'>
                <b style="font-size: 14px; color: red">&#10003;</b>
            </span>
            <span v-else>
                &#9989;
            </span>
              <b>{{ arg.timeText }}</b>
              <i>{{ arg.event.title }}</i>
              <br/>
              <i>Due Date: {{arg.event.extendedProps.dueDate}}</i>
          </div>
        </template>
      </FullCalendar>
    </div>
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
// import timeGridPlugin from '@fullcalendar/timegrid'
import { SAMPLE_EVENTS, createEventId } from './calendar-utils'

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
  components: {FullCalendar},
  data: function() {
    return {
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
      let title = prompt('Please enter a new title for your event')
      let calendarApi = selectInfo.view.calendar

      calendarApi.unselect() // clear date selection

      if (title) {
        calendarApi.addEvent({
          id: createEventId(),
          title,
          dueDate: '22/11/2021',
          completed: false,
          start: selectInfo.startStr,
          end: selectInfo.endStr,
          allDay: selectInfo.allDay
        })
      }
    },

    handleEventClick(clickInfo) {
      if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
        clickInfo.event.remove()
      }
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
    }

  }
};
</script>

<style scoped>
#myDiv {
  max-height: 75vh; 
  overflow: auto; 
  box-sizing: content-box; 
  width: 100%; 
  padding: 3px;
}
</style>
