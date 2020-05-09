import { RemoteTemplateSource } from './services/template.js';

export default class Pagination {
  constructor({ data, page, itemsPerPage }) {
    this._data = data;
    this._page = page;
    this._itemsPerPage = itemsPerPage;
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
    this._rendered = this._template.cloneNode(true);
  }

  _optimizedPhoto() {
    return this._photo.replace('aki_policy=x_large', 'aki_policy=medium');
  }
}
