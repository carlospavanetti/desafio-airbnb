
export function RemoteTemplateSource(location) {
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
  return document.querySelector('body > *');
}
