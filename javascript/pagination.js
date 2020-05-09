import { RemoteTemplateSource } from './services/template.js';

export default class Pagination {
  constructor({ data, page, itemsPerPage }) {
    this._data = data;
    this._page = Number(page);
    this._itemsPerPage = Number(itemsPerPage);
  }

  async element() {
    await this._fetchTemplate();
    this._render();
    return this._rendered;
  }

  data() {
    const cursor = this._itemsPerPage * (this._page - 1);
    const limit = this._itemsPerPage * this._page;
    return this._data.slice(cursor, limit);
  }

  async _fetchTemplate() {
    const templateSource = new RemoteTemplateSource('/_templates/_pagination.html');
    this._template = await templateSource.content();
  }

  _render() {
    const pageCount = Math.ceil(this._data.length / this._itemsPerPage);
    const showBefore = this._page > 1;
    const showAfter = this._page < pageCount;
    this._rendered = this._template.cloneNode(true);
    const beforeArrow = this._rendered.querySelector('[data-elem="before-arrow"]');
    const beforePage = this._rendered.querySelector('[data-elem="before-page"]');
    const afterArrow = this._rendered.querySelector('[data-elem="after-arrow"]');
    const afterPage = this._rendered.querySelector('[data-elem="after-page"]');
    const currentPage = this._rendered.querySelector('[data-elem="current-page"]');
    currentPage.innerText = this._page;
    if (!showBefore) {
      this._rendered.removeChild(beforeArrow);
      this._rendered.removeChild(beforePage);
    } else {
      const goBack = () => window.location.href = `?page=${this._page - 1}`;
      beforePage.innerText = this._page - 1;
      beforePage.addEventListener('click', goBack);
      beforeArrow.addEventListener('click', goBack);
    }
    if (!showAfter) {
      this._rendered.removeChild(afterArrow);
      this._rendered.removeChild(afterPage);
    } else {
      const goNext = () => window.location.href = `?page=${this._page + 1}`;
      afterPage.innerText = this._page + 1;
      afterPage.addEventListener('click', goNext);
      afterArrow.addEventListener('click', goNext);
    }
  }

  _optimizedPhoto() {
    return this._photo.replace('aki_policy=x_large', 'aki_policy=medium');
  }
}
