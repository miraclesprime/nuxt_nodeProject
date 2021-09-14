import dayjs from 'dayjs';

export default ({ app }, inject) => {
  inject('toDate', time => dayjs(time).format('YYYY-MM-DD'));
  inject('toDateTime', time => dayjs(time).format('YYYY-MM-DD HH:mm:ss'));
};
