const request = require('supertest');
const app = require('./app');

beforeEach(() => {
  partners = [
    {payer: 'DANNON', points: 0},
    {payer: 'UNILEVER', points: 0},
    {payer: 'MILLER COORS', points: 0}
  ];

  transactions = [];
});

afterEach(() => {
  transactions.length = 0;
});

describe('POST /transactions', () => {
  test('creates a new transaction', async () => {
    const transaction = {
      payer: 'DANNON',
      points: 450,
      timestamp: '2013-06-13 17:54:22Z'
    };

    const resp = await request(app)
      .post('/transactions')
      .send(transaction);

    expect(resp.statusCode).toBe(201);
    expect(resp.body).toEqual(transaction);
  });

  test('adds a transaction to the transactions array', async () => {
    const transaction = {
      payer: 'UNILEVER',
      points: 200,
      timestamp: '2021-07-10 17:54:22Z'
    };

    const resp = await request(app)
      .post('/transactions')
      .send(transaction);
    
    expect(transactions.length).toBe(1);

  })
})