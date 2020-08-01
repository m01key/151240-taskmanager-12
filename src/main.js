'use strict'

import { createMenuMarkup } from './view/menu.js';
import { createFilterMarkup } from './view/filter.js';
import { createBoardMarkup } from './view/board.js';
import { createSortMarkup } from './view/sort.js';
import { createTaskMarkup } from './view/task.js';
import { createTaskEditMarkup } from './view/task-edit.js';
import { createMoreButtonMarkup } from './view/more-button.js';


const TASKS_COUNT = 3;


const mainElement = document.querySelector('.main');
const menuElement = mainElement.querySelector('.main__control');


const render = (container, markup, place) => {
  container.insertAdjacentHTML(place, markup);
}


render(menuElement, createMenuMarkup(), 'beforeend');
render(menuElement, createFilterMarkup(), 'afterend');
render(mainElement, createBoardMarkup(), 'beforeend');

const boardTaskElement = mainElement.querySelector('.board__tasks');

render(boardTaskElement, createSortMarkup(), 'beforebegin');

for (let i = 0; i < TASKS_COUNT; i++) {
  render(boardTaskElement, createTaskMarkup(), 'afterbegin');
}

render(boardTaskElement, createMoreButtonMarkup(), 'afterend');
render(boardTaskElement, createTaskEditMarkup(), 'afterbegin');
