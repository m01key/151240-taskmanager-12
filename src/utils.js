const getRandomInteger = (a = 1, b = 0) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};


const getCurrentDate = () => {

  const currentDate = new Date();
  currentDate.setHours(23, 59, 59, 999);

  return currentDate;

};


export const isTaskExpiringToday = (dueDate) => {
  if (dueDate === null) {
    return false;
  }

  const currentDate = getCurrentDate();

  return currentDate.getTime() === dueDate.getTime();
};


const isTaskExpired = (dueDate) => {
  if (dueDate === null) {
    return false;
  }

  const currentDate = getCurrentDate();

  return currentDate.getTime() > dueDate.getTime();
};

const isTaskRepeating = (repeating) => {
  return Object.values(repeating).some(Boolean);
};

const humanizeTaskDueDate = (dueDate) => {
  return dueDate.toLocaleString(`en-US`, {day: `numeric`, month: `long`});
};


export {getRandomInteger, isTaskExpired, isTaskRepeating, humanizeTaskDueDate};