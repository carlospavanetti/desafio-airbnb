document.addEventListener('DOMContentLoaded', async function () {
  const staysSource = new HardcodedStaysSource();
  const stays = await staysSource.content();

  const tree = await domTreeFromStays(stays);
  const staysList = document.querySelector('.stays-list');
  tree.forEach(node => staysList.append(node));
});

function HardcodedStaysSource() {
  this.content = async () => [{
    "photo": "https://a0.muscache.com/im/pictures/e6c4b347-49c7-4840-8c00-df36a2a273da.jpg?aki_policy=x_large",
    "property_type": "Apartamento",
    "name": "Apartment in Son Parc, wonderful views",
    "price": 433
  },
  {
    "photo": "https://a0.muscache.com/im/pictures/4a5326cb-95e4-4220-a4d8-c91f50cf784c.jpg?aki_policy=xx_large",
    "property_type": "Apartamento",
    "name": "APARTAMENTO IDEAL PAREJAS EN SON PARC",
    "price": 368
  }]
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