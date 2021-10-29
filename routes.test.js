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
  });

  test('transactions are sorted from oldest to newest', async () => {
    const transaction1 = {
      payer: 'UNILEVER',
      points: 30,
      timestamp: '1999-07-10 17:54:22Z'
    };
    const transaction2 = {
      payer: 'DANNON',
      points: 750,
      timestamp: '1999-01-10 17:54:22Z'
    };
    const transaction3 = {
      payer: 'MILLER COORS',
      points: 400,
      timestamp: '1999-08-10 17:54:22Z'
    };
    const transaction4 = {
      payer: 'MILLER COORS',
      points: 250,
      timestamp: '1999-11-10 17:54:22Z'
    };

    const resp1 = await request(app)
      .post('/transactions')
      .send(transaction1);

    const resp2 = await request(app)
      .post('/transactions')
      .send(transaction2);

    const resp3 = await request(app)
      .post('/transactions')
      .send(transaction3);

    const resp4 = await request(app)
      .post('/transactions')
      .send(transaction4);

    Promise.all([resp1, resp2, resp3, resp4])
      .then(() => {
        expect(transactions[0]).toEqual(transaction2);
        expect(transactions[3]).toEqual(transaction4);
      })
    
  })
})