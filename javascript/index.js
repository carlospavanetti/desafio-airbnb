import StaysList from './stays-list.js';

document.addEventListener('DOMContentLoaded', async function () {
  const staysList = new StaysList('São José dos Campos');
  const staysSection = document.querySelector('.stays');
  staysSection.append(await staysList.element());
});
