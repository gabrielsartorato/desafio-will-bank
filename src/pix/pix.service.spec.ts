import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { of, throwError } from 'rxjs';
import { ITransaction } from './interfaces/transaction.interface';
import { PixService } from './pix.service';

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
      const expected: ITransaction[] = [
        {
          customerID: '6b229ef3-e1fe-41e2-8c8c-fbb9e731a6f6',
          email: 'saraigrady@quigley.net',
          key: '681.512.145-38',
          value: 1541.96,
          bank: null,
        },
      ];

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
  });
});
