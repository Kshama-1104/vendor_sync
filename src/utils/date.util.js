const moment = require('moment');

class DateUtil {
  format(date, format = 'YYYY-MM-DD HH:mm:ss') {
    return moment(date).format(format);
  }

  parse(dateString, format) {
    return moment(dateString, format);
  }

  now() {
    return moment();
  }

  addDays(date, days) {
    return moment(date).add(days, 'days');
  }

  addHours(date, hours) {
    return moment(date).add(hours, 'hours');
  }

  subtractDays(date, days) {
    return moment(date).subtract(days, 'days');
  }

  isBefore(date1, date2) {
    return moment(date1).isBefore(date2);
  }

  isAfter(date1, date2) {
    return moment(date1).isAfter(date2);
  }

  diff(date1, date2, unit = 'days') {
    return moment(date1).diff(moment(date2), unit);
  }

  startOfDay(date) {
    return moment(date).startOf('day');
  }

  endOfDay(date) {
    return moment(date).endOf('day');
  }

  startOfWeek(date) {
    return moment(date).startOf('week');
  }

  endOfWeek(date) {
    return moment(date).endOf('week');
  }

  startOfMonth(date) {
    return moment(date).startOf('month');
  }

  endOfMonth(date) {
    return moment(date).endOf('month');
  }

  parsePeriod(period) {
    const now = moment();
    
    switch (period) {
      case '7d':
        return {
          start: now.clone().subtract(7, 'days'),
          end: now
        };
      case '30d':
        return {
          start: now.clone().subtract(30, 'days'),
          end: now
        };
      case '90d':
        return {
          start: now.clone().subtract(90, 'days'),
          end: now
        };
      case '1y':
        return {
          start: now.clone().subtract(1, 'year'),
          end: now
        };
      default:
        return {
          start: now.clone().subtract(7, 'days'),
          end: now
        };
    }
  }
}

module.exports = new DateUtil();


