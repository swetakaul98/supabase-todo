const chai = require('chai');
const chaiHttp = require('chai-http');

const { expect } = chai;
const app = require('../app');

chai.use(chaiHttp);

describe('API Tests', () => {
  it('should return welcome message on / GET', (done) => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.equal('Welcome to the MY API...');
        done();
      });
  });

  it('should return all users on /api/users GET', (done) => {
    chai.request(app)
      .get('/api/users')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.equal(2);
        done();
      });
  });

  it('should return a single user on /api/users/:id GET', (done) => {
    chai.request(app)
      .get('/api/users/1')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.name).to.equal('John Doe');
        done();
      });
  });

  it('should create a new user on /api/users POST', (done) => {
    chai.request(app)
      .post('/api/users')
      .send({ name: 'Test User', email: 'test@example.com' })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body.name).to.equal('Test User');
        expect(res.body.email).to.equal('test@example.com');
        done();
      });
  });
});
