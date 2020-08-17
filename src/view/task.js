import {isTaskExpired, isTaskRepeating, humanizeTaskDueDate} from "../utils/task.js";
import AbstractView from "./abstract.js";


const createTaskTemplate = (task) => {
  const {color, description, dueDate, repeating, isArchive, isFavorite} = task;
  const date = dueDate !== null ? humanizeTaskDueDate(dueDate) : ``;
  const deadlineClassName = isTaskExpired(dueDate) ? `card--deadline` : ``;
  const repeatClassName = isTaskRepeating(repeating) ? `card--repeat` : ``;
  const archiveClassName = isArchive ? `card__btn--disabled` : ``;
  const favoriteClassName = isFavorite ? `card__btn--disabled` : ``;

  return `<article class="card card--${color} ${deadlineClassName} ${repeatClassName}">
          <div class="card__form">
            <div class="card__inner">
              <div class="card__control">
                <button type="button" class="card__btn card__btn--edit">
                  edit
                </button>
                <button type="button" class="card__btn card__btn--archive ${archiveClassName}">
                  archive
                </button>
                <button
                  type="button"
                  class="card__btn card__btn--favorites ${favoriteClassName}"
                >
                  favorites
                </button>
              </div>

              <div class="card__color-bar">
                <svg class="card__color-bar-wave" width="100%" height="10">
                  <use xlink:href="#wave"></use>
                </svg>
              </div>

              <div class="card__textarea-wrap">
                <p class="card__text">${description}</p>
              </div>

              <div class="card__settings">
                <div class="card__details">
                  <div class="card__dates">
                    <div class="card__date-deadline">
                      <p class="card__input-deadline-wrap">
                        <span class="card__date">${date}</span>
                        <span class="card__time">16:15</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>`;
};


export default class Task extends AbstractView {
  constructor(task) {
    super()
    this._task = task;
    this._editClickHandler = this._editClickHandler.bind(this);
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector(`.card__btn--edit`).addEventListener(`click`, this._editClickHandler);
  }
  getTemplate() {
    return createTaskTemplate(this._task);
  }
}

