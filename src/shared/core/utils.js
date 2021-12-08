import { format } from 'date-fns';
import { LICENSES } from '@shared/core/constant';

export const formatDate = (time, formatType = 'dd/MM/yyyy') => {
  if (!time) return '';
  const timeConvert = new Date(time);
  if (timeConvert.toString() === 'Invalid Date') return timeConvert.toString();
  return format(timeConvert, formatType);
};

export const getShortNodeAddress = address => {
  if (address) {
    return `${address.substr(0, 10)}...${address.substr(-4)}`;
  }
  return '-';
};

export const numberWithCommas = str =>
  str ? str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0';

export const detectTypeUser = user => {
  if (user?.is_pa) {
    return 'program assistant';
  }
  if (user?.is_super_admin) {
    return 'super admin';
  }
  return '';
}

export const formatPrice = (price, unit = '€') => {
  return `${unit} ${numberWithCommas(price)}`;
}

export const getLicenses = (license, license_other) => {
  if (+license === 5) {
    return license_other?.trim();
  } else {
    return LICENSES.find(x => +x.key === +license)?.title;
  }
}
