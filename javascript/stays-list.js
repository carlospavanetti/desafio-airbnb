import { RemoteStaysSource } from './services/stays.js';
import { RemoteTemplateSource } from './services/template.js';

import Stay from './stay.js';
import Pagination from './pagination.js';

const apiEndpoint = "https://api.sheety.co/30b6e400-9023-4a15-8e6c-16aa4e3b1e72";

export default class StaysList {
  constructor(location) {
    this._location = location;
  }

  async element() {
    await this._fetchData();
    await this._render();
    return this._rendered;
  }

  async _fetchData() {
    await Promise.all([
      this._fetchStays(),
      this._fetchTemplate()
    ]);
    const params = new URLSearchParams(window.location.search);
    const page = params.get('page') || 1;
    this._pagination = new Pagination({ data: this._stays, page, itemsPerPage: 7 });
  }

  async _fetchStays() {
    const staysSource = new RemoteStaysSource(apiEndpoint);
    this._stays = await staysSource.stays();
  }

  async _fetchTemplate() {
    const templateSource = new RemoteTemplateSource('_templates/_stays-list.html');
    this._template = await templateSource.content();
  }

  async _render() {
    if (!this._rendered) {
      this._rendered = this._template.cloneNode(true);
      const staysCount = this._rendered.querySelector('[data-elem="stays-count"]');
      const staysLocation = this._rendered.querySelector('[data-elem="stays-location"]');
      staysCount.innerText = this._stays.length;
      staysLocation.innerText = this._location;
    }
    await Promise.all(
      this._pagination.data().map(async stay => {
        const node = new Stay({ location: this._location, ...stay });
        this._rendered.append(await node.element());
      })
    );
    this._rendered.lastChild.classList.add('stay--last')
    this._rendered.append(await this._pagination.element());
  }
}
