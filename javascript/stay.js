import { RemoteTemplateSource } from './services/template.js';

export default class Stay {
  constructor({ location, photo, name, price, property_type }) {
    this._location = location;
    this._photo = photo;
    this._name = name;
    this._price = price;
    this._property_type = property_type;
  }

  async element() {
    await this._fetchTemplate();
    this._render();
    return this._rendered;
  }

  async _fetchTemplate() {
    const templateSource = new RemoteTemplateSource('/_templates/_stay.html');
    this._template = await templateSource.content();
  }

  _render() {
    this._rendered = this._template.cloneNode(true);
    const photo = this._rendered.querySelector('[data-elem="photo"]');
    const name = this._rendered.querySelector('[data-elem="name"]');
    const price = this._rendered.querySelector('[data-elem="price"]');
    const property_type = this._rendered.querySelector('[data-elem="property-type"]');
    photo.src = this._photo;
    name.innerText = this._name;
    price.innerText = this._price;
    property_type.innerText = `${this._property_type} em ${this._location}`;
  }
}
