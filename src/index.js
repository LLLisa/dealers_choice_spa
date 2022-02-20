console.log('hello world will do');

const uL = document.querySelector('ul');

const removeItem = async (ev) => {
  console.log(ev.target);
  if (ev.target.tagName === 'LI') {
    try {
      const itemId = ev.target.getAttribute('data-id');
      await axios.delete(`/api/humans/${itemId}`);
    } catch (error) {
      console.log(error);
    }
  }
  init();
};

uL.addEventListener('click', removeItem);

const init = async () => {
  try {
    const content = await axios.get('/api/humans');
    console.log(content);

    uL.innerHTML = `
      ${content.data
        .map((x) => {
          return `<li data-id="${x.id}">${x.name}</li>`;
        })
        .join('')}
    `;
  } catch (error) {
    console.log(error); //client console
  }
};

init();
