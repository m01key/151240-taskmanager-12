import {COLORS} from "../const.js";
import {getRandomInteger} from "../utils/common.js";


const generateDescription = () => {
  const descriptions = [`Изучить теорию`, `Сделать домашку`, `Пройти интенсив на соточку`];
  return descriptions[getRandomInteger(0, descriptions.length - 1)];
};

const getRandomColor = () => {
  const randomIndex = getRandomInteger(0, COLORS.length - 1);
  return COLORS[randomIndex];
};


const generateDate = () => {

  const isDate = Boolean(getRandomInteger(0, 1));
  if (!isDate) {
    return null;
  }

  const maxDaysGap = 7;
  const currentDate = new Date();
  currentDate.setHours(23, 59, 59, 999);
  currentDate.setDate(currentDate.getDate() + getRandomInteger(-maxDaysGap, maxDaysGap));

  return currentDate;
};


const generateTask = () => {

  const description = generateDescription();
  const dueDate = generateDate();
  const repeating = dueDate === null ?
    {
      mo: false,
      tu: false,
      we: Boolean(getRandomInteger(0, 1)),
      th: false,
      fr: Boolean(getRandomInteger(0, 1)),
      sa: false,
      su: false,
    }
    : {
      mo: false,
      tu: false,
      we: false,
      th: false,
      fr: false,
      sa: false,
      su: false
    };


  return {
    description,
    dueDate,
    repeating,
    color: getRandomColor(),
    isArchive: Boolean(getRandomInteger(0, 1)),
    isFavorite: Boolean(getRandomInteger(0, 1)),
  };

};


export {generateTask};


