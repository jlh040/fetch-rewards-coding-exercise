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

/** POST /transactions - create new transaction from data; return `{ payer, points, timestamp }` */

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

    
    expect(transactions[0]).toEqual(transaction2);
    expect(transactions[3]).toEqual(transaction4);
    
  });
});

/** GET /points - get the point balances for all payers; return `{ payer1Name: points, payer2Name: points, ... }` */

describe('GET /points', () => {
  test('accurately returns points for all payers', async () => {
    const transaction1 = {
      payer: 'MILLER COORS',
      points: 300,
      timestamp: '2020-09-17 04:54:22Z'
    };
    const transaction2 = {
      payer: 'DANNON',
      points: 470,
      timestamp: '2021-12-17 04:54:22Z'
    };
    const transaction3 = {
      payer: 'UNILEVER',
      points: 250,
      timestamp: '2017-05-13 08:30:45Z'
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
      .get('/points')

    expect(resp4.body).toEqual({
      DANNON: 470,
      UNILEVER: 250,
      'MILLER COORS': 300
    });
  });
});

describe('POST /points', () => {
  test('returns a list containing all payers', async () => {
    const transaction = {
      payer: 'MILLER COORS',
      points: 670,
      timestamp: '2022-06-17 04:54:22Z'
    };

    const resp = await request(app)
      .post('/transactions')
      .send(transaction);

    const resp2 = await request(app)
      .post('/points')
      .send({points: 500});

    expect(resp2.body.length).toBe(partners.length);
  });

  test(`returns an error if you don't have enough points`, async () => {
    const transaction = {
      payer: 'DANNON',
      points: 1000,
      timestamp: '2005-10-09 03:00:22Z'
    };

    const resp = await request(app)
      .post('/transactions')
      .send(transaction);

    const resp2 = await request(app)
      .post('/points')
      .send({points: 2500})

    expect(resp2.statusCode).toBe(400);
  });

  test('returns an array', async () => {
    const transaction = {
      payer: 'UNILEVER',
      points: 550,
      timestamp: '2010-11-09 05:02:31Z'
    };

    const resp = await request(app)
      .post('/transactions')
      .send(transaction);

    const resp2 = await request(app)
      .post('/points')
      .send({points: 250})
    
    expect(resp2.body).toBeInstanceOf(Array);
  })
})
