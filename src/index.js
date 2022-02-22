const humanList = document.querySelector('#human-list');
const companyList = document.querySelector('#company-list');
const companySelector = document.querySelector('#the-selector');
const form = document.querySelector('form');
const submitButton = document.querySelector('#submit-button');

//list of employees by company doesn't update after employee delete
const handleItem = async (ev) => {
  try {
    if (ev.target.id === 'human-name') {
      const itemId = ev.target.getAttribute('data-id');
      await axios.delete(`/api/humans/${itemId}`);
    }
    if (ev.target.id === 'company-name') {
      const companyId = ev.target.getAttribute('data-id');
      displayCompanyRoster(companyId);
    }
    if (ev.target.id === 'quit-job') {
      const unshackledId = ev.path[1].getAttribute('id') * 1;
      console.log(unshackledId);
      await axios.post(`/api/humans/quit/${unshackledId}`);
    }
    init();
  } catch (error) {
    console.log(error);
  }
};

const displayCompanyRoster = async (companyId) => {
  if (!companyId) {
    return;
  }
  const companyToList = await axios.get(`/api/companies/${companyId}`);
  companyList.innerHTML = `
  <h2>${companyToList.data.name}</h2>
  ${companyToList.data.employees
    .map((x) => {
      return `<li>${x.name}</li>`;
    })
    .join('')}
  `;
};

// const quitJob = async (ev) => {
//   const unshackledId = ev.path[1].getAttribute('id') * 1;
//   try {
//     await axios.put('/api/humans/quit');
//     init();
//   } catch (error) {
//     console.log(error);
//   }
// };

const createHuman = async (ev) => {
  try {
    ev.preventDefault();
    const formName = form.name.value;
    const formCompany = form.companyselect.value;
    const response = await axios.post(
      `/api/humans/create/${[formName, formCompany]}`
    );
    init();
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
          return `<li id="${x.id}">
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
    displayCompanyRoster();
  } catch (error) {
    console.log(error); //client console
  }
};

init();

humanList.addEventListener('click', handleItem);
submitButton.addEventListener('click', createHuman);
