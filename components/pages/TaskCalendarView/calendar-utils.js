let eventGuid = 0
let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today
// let endStr = new Date('22/11/2021').toISOString().replace(/T.*$/, '')
// console.log(todayStr)

export const SAMPLE_EVENTS = [
  {
    id: createEventId(),
    title: 'Demo Event 1',
    dueDate: 'Nov 22, 2021',
    completed: false,
    start: todayStr,
    // end: '2021-11-22'
  },
  {
    id: createEventId(),
    title: 'Demo Timed event',
    dueDate: '22/11/2021',
    completed: true,
    start: todayStr + 'T12:00:00'
  }
]

export function createEventId() {
  return String(eventGuid++)
}