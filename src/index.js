const humanList = document.querySelector('#human-list');
const companyList = document.querySelector('#company-list');
const companySelector = document.querySelector('#the-selector');
// const submitButton = document.querySelector('button');
// console.log(quitButton);

//list of employees by company doesn't update after employee delete
const handleItem = async (ev) => {
  try {
    if (ev.target.id === 'human-name') {
      const itemId = ev.target.getAttribute('data-id');
      // console.log(itemId);
      await axios.delete(`/api/humans/${itemId}`);
    }
    if (ev.target.id === 'company-name') {
      const companyId = ev.target.getAttribute('data-id');
      const companyToList = await axios.get(`/api/companies/${companyId}`);
      // console.log(companyToList);
      companyList.innerHTML = `
      <h2>${companyToList.data.name}</h2>
      ${companyToList.data.employees
        .map((x) => {
          return `<li>${x.name}</li>`;
        })
        .join('')}
      `;
    }
    init();
  } catch (error) {
    console.log(error);
  }
};

const quitJob = (ev) => {
  console.log(ev.target.name);
};

const newHuman = async (ev) => {
  try {
    ev.preventDefault();
    await axios.post('/api/humans');
    console.log('hi');
  } catch (error) {
    console.log(error);
  }
};

const init = async () => {
  try {
    const content = await axios.get('/api/humans');
    const mainList = `
      ${content.data
        .map((x) => {
          return `<li>
          <span id="human-name" data-id="${x.id}">${x.name}</span> of 
          <span id="company-name" data-id="${x.company.id}">${x.company.name}</span>
          <button id="quit-job" >Quit</button>
          </li>`;
        })
        .join('')}
    `;
    const companyList = await axios.get('/api/companies');
    const selectorList = `
    ${companyList.data.map((x) => {
      return `
      <option value="${x.id}">${x.name}</option>
      `;
    })}
    `;
    humanList.innerHTML = mainList;
    companySelector.innerHTML = selectorList;
  } catch (error) {
    console.log(error); //client console
  }
};

init();
const quitButton = document.querySelector('#quit-job');

humanList.addEventListener('click', handleItem);
quitButton.addEventListener('click', quitJob);
