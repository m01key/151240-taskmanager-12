import {createMenuTemplate} from './view/menu.js';
import {createFilterTemplate} from './view/filter.js';
import {createTaskTemplate} from './view/task.js';
import {createTaskEditTemplate} from './view/task-edit.js';
import {createMoreButtonTemplate} from './view/more-button.js';
import {createBoardTemplate} from './view/board.js';
import {createSortTemplate} from './view/sort.js';
import {generateTask} from "./mock/task.js";
import {generateFilter} from "./mock/filter.js";


const TASKS_COUNT = 24;
const TASK_COUNT_PER_STEP = 8;

const tasks = new Array(TASKS_COUNT).fill().map(generateTask);
const filters = generateFilter(tasks);

const mainElement = document.querySelector(`.main`);
const menuElement = mainElement.querySelector(`.main__control`);


const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};


render(menuElement, createMenuTemplate(), `beforeend`);
render(menuElement, createFilterTemplate(filters), `afterend`);
render(mainElement, createBoardTemplate(), `beforeend`);

const boardElement = mainElement.querySelector(`.board`);
const boardTaskElement = boardElement.querySelector(`.board__tasks`);

render(boardTaskElement, createSortTemplate(), `beforebegin`);

for (let i = 1; i < Math.min(TASKS_COUNT, TASK_COUNT_PER_STEP); i++) {
  render(boardTaskElement, createTaskTemplate(tasks[i]), `afterbegin`);
}

render(boardTaskElement, createTaskEditTemplate(tasks[0]), `afterbegin`);


if (tasks.length > TASK_COUNT_PER_STEP) {

  let renderedTaskCount = TASK_COUNT_PER_STEP;

  render(boardTaskElement, createMoreButtonTemplate(), `afterend`);

  const loadMoreButton = boardElement.querySelector(`.load-more`);

  loadMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    tasks
      .slice(renderedTaskCount, renderedTaskCount + TASK_COUNT_PER_STEP)
      .forEach((task) => render(boardTaskElement, createTaskTemplate(task), `beforeend`));

    renderedTaskCount += TASK_COUNT_PER_STEP;

    if (renderedTaskCount >= tasks.length) {
      loadMoreButton.remove();
    }
  });
}
