import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { of, throwError } from 'rxjs';
import { IBalance } from './interfaces/balance.interface';
import { ICustomer } from './interfaces/customer.interface';
import { ITransaction } from './interfaces/transaction.interface';
import { PixService } from './pix.service';

const customer: ICustomer = {
  account: 'any_account',
  agency: 'any_agency',
  customerID: 'any_id',
};

const transaction: ITransaction = {
  customerID: 'any_id',
  email: 'any_email@email.com',
  key: '000.000.000-00',
  value: 4000,
};

describe('PixService', () => {
  let pixService: PixService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PixService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    pixService = module.get<PixService>(PixService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(pixService).toBeDefined();
  });

  describe('getAllContingencyTransaction', () => {
    it('should be able get all pending transactions', async () => {
      const expected: ITransaction[] = [transaction];

      jest.spyOn(httpService, 'get').mockReturnValueOnce(
        of({
          status: 200,
          statusText: 'OK',
          config: {},
          headers: {},
          data: expected,
        }),
      );

      const result = await pixService.getAllContingencyTransaction();

      expect(result).toEqual(expected);
    });

    it('should be able has not pending transactions', async () => {
      const expected: ITransaction[] = [];

      jest.spyOn(httpService, 'get').mockReturnValueOnce(
        of({
          status: 200,
          statusText: 'OK',
          config: {},
          headers: {},
          data: [],
        }),
      );

      const result = await pixService.getAllContingencyTransaction();

      expect(result).toEqual(expected);
    });

    it('should throw an unexpected error', () => {
      jest
        .spyOn(httpService, 'get')
        .mockReturnValueOnce(throwError(new Error()));

      expect(pixService.getAllContingencyTransaction()).rejects.toThrowError();
    });
  });

  describe('getAllBanksAndClients', () => {
    it('should be able get all pending transactions', async () => {
      const expected: ICustomer[] = [customer];

      jest.spyOn(httpService, 'get').mockReturnValueOnce(
        of({
          status: 200,
          statusText: 'OK',
          config: {},
          headers: {},
          data: [
            {
              bank: 'Will Bank',
              customers: [customer],
            },
          ],
        }),
      );

      const result = await pixService.getAllBanksAndClients();

      expect(result).toEqual(expected);
    });

    it('should be able has not banks and clients', async () => {
      const expected: ITransaction[] = [];

      jest.spyOn(httpService, 'get').mockReturnValueOnce(
        of({
          status: 200,
          statusText: 'OK',
          config: {},
          headers: {},
          data: [],
        }),
      );

      const result = await pixService.getAllBanksAndClients();

      expect(result).toEqual(expected);
    });

    it('should throw an unexpected error', () => {
      jest
        .spyOn(httpService, 'get')
        .mockReturnValueOnce(throwError(new Error()));

      expect(pixService.getAllBanksAndClients()).rejects.toThrowError();
    });
  });

  describe('getBalance', () => {
    it('should be able get account balance', async () => {
      const expected: IBalance = { balance: 5000 };

      jest.spyOn(httpService, 'get').mockReturnValueOnce(
        of({
          status: 200,
          statusText: 'OK',
          config: {},
          headers: {},
          data: expected,
        }),
      );

      const result = await pixService.getBalance();

      expect(result).toEqual(expected.balance);
    });

    it('should throw an unexpected error', () => {
      jest
        .spyOn(httpService, 'get')
        .mockReturnValueOnce(throwError(new Error()));

      expect(pixService.getBalance()).rejects.toThrowError();
    });
  });

  describe('resendContingencyList', () => {
    it('should be able throws if has not customers', () => {
      jest.spyOn(pixService, 'getAllBanksAndClients').mockResolvedValueOnce([]);

      expect(pixService.resendContingencyList()).rejects.toThrowError();
    });

    it('should be able throws if has not transactions to send', () => {
      jest
        .spyOn(pixService, 'getAllBanksAndClients')
        .mockResolvedValueOnce([customer]);

      jest
        .spyOn(pixService, 'getAllContingencyTransaction')
        .mockResolvedValueOnce([]);

      expect(pixService.resendContingencyList()).rejects.toThrowError();
    });

    it('should be able throws if any methos throws', () => {
      jest
        .spyOn(pixService, 'getAllBanksAndClients')
        .mockRejectedValueOnce(new Error());

      expect(pixService.resendContingencyList()).rejects.toThrowError();
    });

    it('should be able send all transactions', async () => {
      const expected: ITransaction = {
        ...transaction,
        key: '00000000000',
        bank: {
          account: 'any_account',
          agency: 'any_agency',
        },
      };

      jest
        .spyOn(pixService, 'getAllContingencyTransaction')
        .mockResolvedValueOnce([transaction]);

      jest
        .spyOn(pixService, 'getAllBanksAndClients')
        .mockResolvedValueOnce([customer]);

      jest.spyOn(pixService, 'getBalance').mockResolvedValueOnce(5000);

      const result = await pixService.resendContingencyList();

      expect(result).toEqual([expected]);
    });
  });
});
