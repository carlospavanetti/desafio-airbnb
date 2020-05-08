document.addEventListener('DOMContentLoaded', async function () {
  const apiEndpoint = "https://api.sheety.co/30b6e400-9023-4a15-8e6c-16aa4e3b1e72";
  const staysSource = new RemoteStaysSource(apiEndpoint);
  const stays = await staysSource.content();

  const tree = await domTreeFromStays(stays);
  const staysList = document.querySelector('.stays-list');
  tree.forEach(node => staysList.append(node));
});

function RemoteStaysSource(location) {
  this.location = location;
  this.content = async () => {
    const response = await fetch(this.location);
    return response.json();
  }
}

async function domTreeFromStays(stays) {
  const templateSource = new RemoteTemplateSource('/_templates/_stay.html');
  const template = await templateSource.content();

  const place = 'São José dos Campos';
  const nodes = stays.map(stay => {
    const node = template.cloneNode(true);
    const photo = node.querySelector('[data-elem="photo"]');
    const name = node.querySelector('[data-elem="name"]');
    const price = node.querySelector('[data-elem="price"]');
    const property_type = node.querySelector('[data-elem="property-type"]');
    photo.src = stay.photo;
    name.innerText = stay.name;
    price.innerText = stay.price;
    property_type.innerText = `${stay.property_type} em ${place}`;
    return node;
  });
  return nodes;
}

function RemoteTemplateSource(location) {
  this.location = location;
  this.content = async function () {
    const response = await fetch(this.location);
    const body = await response.text();
    const template = htmlFromText(body);
    return template;
  }
}

function htmlFromText(text) {
  const parser = new DOMParser();
  const document = parser.parseFromString(text, 'text/html');
  return document.querySelector('[data-elem="root"]');
}
