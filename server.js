//db--------------------------
const Sequelize = require('sequelize');
const db = new Sequelize('postgres://localhost/dealers_choice_spa');
const faker = require('faker/dist/faker');

const Human = db.define('human', {
  name: {
    type: Sequelize.STRING,
  },
  quitJob: {
    type: Sequelize.VIRTUAL,
    get: function () {
      this.companyId = null;
    },
  },
});

const Company = db.define('company', {
  name: {
    type: Sequelize.STRING,
  },
  product: {
    type: Sequelize.STRING,
  },
});

Human.belongsTo(Company);
Company.hasMany(Human, { as: 'employees' });

const syncAndSeed = async () => {
  try {
    await db.sync({ force: true });
    await createCompany(8);
    await createHuman(12);
  } catch (error) {
    console.log(error);
  }
};

//randomize data seeding-------------------
let numberOfEmployers;
const createCompany = async (num) => {
  try {
    for (let i = 0; i < num; i++) {
      await Company.create({
        name: faker.company.companyName(),
        product: faker.commerce.productName(),
      });
    }
    numberOfEmployers = await Company.count();
  } catch (error) {
    console.log(error);
  }
};

const createHuman = async (num) => {
  try {
    for (let i = 0; i < num; i++) {
      const rand = Math.ceil(Math.random() * numberOfEmployers);
      await Human.create({
        name: faker.name.findName(),
        companyId: rand,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//express---------------------
const express = require('express');
const app = express();
const path = require('path');
// const bodyParser = require('body-parser');

app.use('/src', express.static(path.join(__dirname, 'src')));
app.use(express.urlencoded());

const init = async () => {
  try {
    await syncAndSeed();
    console.log('~~~~~~~~~~~~~~~synced~~~~~~~~~~~~~~~');
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`glistening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

init();

//routies--------------------------
app.get('/', (req, res) => {
  res.redirect('/api');
});

app.get('/api', (req, res, next) => {
  try {
    res.sendFile(path.join(__dirname, 'index.html'));
  } catch (error) {
    next(error);
  }
});

app.get('/api/humans', async (req, res, next) => {
  try {
    const response = await Human.findAll({
      include: [Company],
    });
    res.send(response);
  } catch (error) {}
});

app.delete('/api/humans/:id', async (req, res, next) => {
  try {
    const trash = await Human.findByPk(req.params.id);
    await trash.destroy();
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

app.post('/api/humans', async (req, res, next) => {
  try {
    console.log(req.body);
    res.send`
    <html>
      ${req.body}
    </html>
    `;
  } catch (error) {
    next(error);
  }
});

app.get('/api/companies', async (req, res, next) => {
  try {
    const response = await Company.findAll({});
    res.send(response);
  } catch (error) {}
});

app.get(`/api/companies/:id`, async (req, res, next) => {
  try {
    const companyToList = await Company.findByPk(req.params.id, {
      include: [{ model: Human, as: 'employees' }],
    });
    res.send(companyToList);
  } catch (error) {
    console.log(error);
  }
});
