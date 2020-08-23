import BoardView from "../view/board.js";
import SortView from "../view/sort.js";
import TaskListView from "../view/task-list.js";
import NoTaskView from "../view/no-task.js";
import LoadMoreButtonView from "../view/load-more-button.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {sortTaskUp, sortTaskDown} from "../utils/task.js";
import {SortType} from "../const.js";
import {updateItem} from "../utils/common.js";
import TaskPresenter from "./task.js";


const TASK_COUNT_PER_STEP = 8;

export default class BoardPresenter {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._renderedTaskCount = TASK_COUNT_PER_STEP;
    this._currenSortType = SortType.DEFAULT;

    this._taskPresenter = {};

    this._boardComponent = new BoardView();
    this._sortComponent = new SortView();
    this._taskListComponent = new TaskListView();
    this._noTaskComponent = new NoTaskView();
    this._loadMoreButtonComponent = new LoadMoreButtonView();

    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleTaskChange = this._handleTaskChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }


  init(boardTasks) {
    // Метод для инициализации (начала работы) модуля,
    // малая часть текущей функции renderBoard в main.js

    this._boardTasks = boardTasks.slice();

    // 1. В отличии от сортировки по любому параметру,
    // исходный порядок можно сохранить только одним способом -
    // сохранив исходный массив:
    this._sourcedBoardTasks = boardTasks.slice();

    render(this._boardContainer, this._boardComponent, RenderPosition.BEFOREEND);
    render(this._boardComponent, this._taskListComponent, RenderPosition.BEFOREEND);

    this._renderBoard();
  }

  _handleModeChange() {
    Object
      .values(this._taskPresenter)
      .forEach((presenter) => presenter.resetView());
  }


  _handleTaskChange(updatedTask) {
    this._boardTasks = updateItem(this._boardTasks, updatedTask);
    this._sourcedBoardTasks = updateItem(this._sourcedBoardTasks, updatedTask);
    this._taskPresenter[updatedTask.id].init(updatedTask);
  }


  _sortTasks(sortType) {
    if (this._currenSortType === sortType) {
      return;
    }

    // 2. Этот исходный массив задач необходим,
    // потому что для сортировки мы будем мутировать
    // массив в свойстве _boardTasks
    switch (sortType) {
      case SortType.DATE_UP:
        this._boardTasks.sort(sortTaskUp);
        break;
      case SortType.DATE_DOWN:
        this._boardTasks.sort(sortTaskDown);
        break;
      default:
        // 3. А когда пользователь захочет "вернуть всё, как было",
        // мы просто запишем в _boardTasks исходный массив
        this._boardTasks = this._sourcedBoardTasks.slice();
    }

    this._currenSortType = sortType;
  }


  _handleSortTypeChange(sortType) {
    // ->> Сортируем задачи
    this._sortTasks(sortType);
    // ->> Очищаем список
    this._clearTaskList();
    // ->> Рендерим список заново
    this._renderTaskList();
  }


  _renderSort() {
    // Метод для рендеринга сортировки

    render(this._boardComponent, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }


  _renderTask(task) {
    // Метод, куда уйдёт логика созданию и рендерингу компонетов задачи,
    // текущая функция renderTask в main.js

    const taskPresenter = new TaskPresenter(this._taskListComponent, this._handleTaskChange, this._handleModeChange);
    taskPresenter.init(task);
    this._taskPresenter[task.id] = taskPresenter;
  }


  _renderTasks(from, to) {
    // Метод для рендеринга N-задач за раз

    this._boardTasks
      .slice(from, to)
      .forEach((boardTask) => this._renderTask(boardTask));
  }


  _renderNoTasks() {
    // Метод для рендеринга заглушки

    render(this._boardComponent, this._noTaskComponent, RenderPosition.AFTERBEGIN);
  }


  _handleLoadMoreButtonClick() {
    this._renderTasks(this._renderedTaskCount, this._renderedTaskCount + TASK_COUNT_PER_STEP);
    this._renderedTaskCount += TASK_COUNT_PER_STEP;


    if (this._renderedTaskCount >= this._boardTasks.length) {
      remove(this._loadMoreButtonComponent);
    }
  }


  _renderLoadMoreButton() {
    render(this._boardComponent, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);
    this._loadMoreButtonComponent.setClickHandler(this._handleLoadMoreButtonClick);
  }


  _clearTaskList() {
    // this._taskListComponent.getElement().innerHTML = ``;
    Object
      .values(this._taskPresenter)
      .forEach((presenter) => presenter.destroy());
    this._taskPresenter = {};
    this._renderedTaskCount = TASK_COUNT_PER_STEP;
  }


  _renderTaskList() {
    this._renderTasks(0, Math.min(this._boardTasks.length, TASK_COUNT_PER_STEP));

    if (this._boardTasks.length > TASK_COUNT_PER_STEP) {
      this._renderLoadMoreButton();
    }
  }


  _renderBoard() {
    // Метод для инициализации (начала работы) модуля,
    // бОльшая часть текущей функции renderBoard в main.js

    if (this._boardTasks.every((task) => task.isArchive)) {
      this._renderNoTasks();
      return;
    }

    this._renderSort();
    this._renderTaskList();

  }
}
