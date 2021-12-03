let eventGuid = 0
let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today
// let endStr = new Date('22/11/2021').toISOString().replace(/T.*$/, '')
// console.log(todayStr)

export const SAMPLE_EVENTS = [
  {
    id: createEventId(),
    title: 'Demo Event 123',
    dueDate: 'Nov 30, 2021',
    completed: false,
    start: todayStr,
    // end: '2021-11-22'
  },
  {
    id: createEventId(),
    title: 'Demo Timed 12',
    dueDate: 'Nov 30, 2021',
    completed: true,
    start: todayStr //  + 'T12:00:00'
  },
  {
    id: createEventId(),
    title: 'Demo Timed c',
    dueDate: 'Nov 30, 2021',
    completed: true,
    start: todayStr //  + 'T12:00:00'
  },
  {
    id: createEventId(),
    title: 'Demo Timed d',
    dueDate: 'Nov 30, 2021',
    completed: true,
    start: todayStr //  + 'T12:00:00'
  }
]

export function createEventId() {
  return String(eventGuid++)
}