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

/** 404 error handler test */

describe('test for a 404', () => {
  test('returns a 404 if the resource is not found', async () => {
    const resp = await request(app)
      .get('/doesnotexist');
    
    expect(resp.statusCode).toBe(404);
  })
})

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

    await request(app)
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

    await request(app)
      .post('/transactions')
      .send(transaction1);

    await request(app)
      .post('/transactions')
      .send(transaction2);

    await request(app)
      .post('/transactions')
      .send(transaction3);

    await request(app)
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

    await request(app)
      .post('/transactions')
      .send(transaction1);

    await request(app)
      .post('/transactions')
      .send(transaction2);

    await request(app)
      .post('/transactions')
      .send(transaction3);

    const resp1 = await request(app)
      .get('/points')

    expect(resp1.body).toEqual({
      DANNON: 470,
      UNILEVER: 250,
      'MILLER COORS': 300
    });
  });
});

/** POST /points - spends a user's points; return `[ { payer, deductedPoints }, { payer, deductedPoints }, ...]` */

describe('POST /points', () => {
  test('returns a list containing all payers', async () => {
    const transaction = {
      payer: 'MILLER COORS',
      points: 670,
      timestamp: '2022-06-17 04:54:22Z'
    };

    await request(app)
      .post('/transactions')
      .send(transaction);

    const resp1 = await request(app)
      .post('/points')
      .send({points: 500});

    expect(resp1.body.length).toBe(partners.length);
  });

  test(`returns an error if you don't have enough points`, async () => {
    const transaction = {
      payer: 'DANNON',
      points: 1000,
      timestamp: '2005-10-09 03:00:22Z'
    };

    await request(app)
      .post('/transactions')
      .send(transaction);

    const resp1 = await request(app)
      .post('/points')
      .send({points: 2500})

    expect(resp1.statusCode).toBe(400);
  });

  test('returns an array', async () => {
    const transaction = {
      payer: 'UNILEVER',
      points: 550,
      timestamp: '2010-11-09 05:02:31Z'
    };

    await request(app)
      .post('/transactions')
      .send(transaction);

    const resp1 = await request(app)
      .post('/points')
      .send({points: 250})
    
    expect(resp1.body).toBeInstanceOf(Array);
  });

  test('accurately returns points and updates point balances', async () => {
    const transaction1 = {
      payer: 'DANNON',
      points: 1000,
      timestamp: '2020-11-02T14:00:00Z'
    };
    const transaction2 = {
      payer: 'UNILEVER',
      points: 200,
      timestamp: '2020-10-31T11:00:00Z'
    };
    const transaction3 = {
      payer: 'DANNON',
      points: -200,
      timestamp: '2020-10-31T15:00:00Z'
    };
    const transaction4 = {
      payer: 'MILLER COORS',
      points: 10000,
      timestamp: '2020-11-01T14:00:00Z'
    };
    const transaction5 = {
      payer: 'DANNON',
      points: 300,
      timestamp: '2020-10-31T10:00:00Z'
    };

    await request(app)
      .post('/transactions')
      .send(transaction1);
    await request(app)
      .post('/transactions')
      .send(transaction2);
    await request(app)
      .post('/transactions')
      .send(transaction3);
    await request(app)
      .post('/transactions')
      .send(transaction4);
    await request(app)
      .post('/transactions')
      .send(transaction5);

    const resp1 = await request(app)
      .post('/points')
      .send({points: 5000});

    expect(resp1.body).toEqual([
      { 'payer': 'DANNON', 'points': -100 },
      { 'payer': 'UNILEVER', 'points': -200 },
      { 'payer': 'MILLER COORS', 'points': -4700 },
    ]);

    const resp2 = await request(app)
      .get('/points');
    
    expect(resp2.body).toEqual({
      'DANNON': 1000,
      'UNILEVER': 0,
      'MILLER COORS': 5300
    });
  });
});
