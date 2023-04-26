import dayjs from 'dayjs';
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

export default ({ app }, inject) => {
  inject('toDate', time => dayjs(time).format('YYYY-MM-DD'));
  inject('formatDate', time => dayjs(time).format('DD MMM YYYY'));
  inject('toTime', time => dayjs(time).format('HH:mm'));
  inject('toDateTime', time => dayjs(time).format('YYYY-MM-DD HH:mm:ss'));
  inject('displayDate', date => dayjs(date).fromNow()) // display distance in days
};
