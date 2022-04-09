import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { transformPixValidateKeyFactory } from '../utils/transformPixValidateKeyFactory';
import { IBalance } from './interfaces/balance.interface';
import { ICustomer, ICustomerBank } from './interfaces/customer.interface';
import { ITransaction } from './interfaces/transaction.interface';

@Injectable()
export class PixService {
  constructor(private readonly httpService: HttpService) {}

  async resendContingencyList() {
    try {
      const customersList = await this.getAllBanksAndClients();

      if (customersList.length === 0) {
        throw new HttpException(
          'Lista de clientes não encontrada',
          HttpStatus.NOT_FOUND,
        );
      }

      const pendingTransactions = await this.getAllContingencyTransaction();

      if (pendingTransactions.length === 0) {
        throw new HttpException(
          'Não há transações a serem processadas.',
          HttpStatus.NOT_FOUND,
        );
      }

      const transFormTransaction = await Promise.all(
        pendingTransactions.map(async (transaction) => {
          const customer = customersList.find(
            (customer) => customer.customerID === transaction.customerID,
          );

          const key = transformPixValidateKeyFactory(transaction.key);

          if (customer.customerID) {
            const balance = await this.getBalance();

            if (transaction.value < balance) {
              return {
                transaction: {
                  ...transaction,
                  key: key,
                  bank: {
                    agency: customer.agency,
                    account: customer.account,
                  },
                },
              };
            }
          }
        }),
      );

      const preparedToSendTransactions = transFormTransaction.filter(
        (tran) => tran,
      );

      return { preparedToSendTransactions };
    } catch (error) {
      throw new HttpException(
        'Transações não realizadas devido erro interno.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllContingencyTransaction(): Promise<ITransaction[]> {
    const { data: transactions } = await this.httpService
      .get<ITransaction[]>(
        'https://run.mocky.io/v3/c3bdfbf6-d789-4e52-829c-bddbb886c3be',
      )
      .toPromise();

    return transactions;
  }

  async getAllBanksAndClients(): Promise<ICustomer[]> {
    const { data } = await this.httpService
      .get<ICustomerBank[]>(
        'https://run.mocky.io/v3/85c286b6-e483-420f-9f2b-1ca57ae06c52',
      )
      .toPromise();

    const customersList: ICustomer[] = [];

    data.map((bandkAndCustomers) =>
      bandkAndCustomers.customers.map((customer) =>
        customersList.push(customer),
      ),
    );

    return customersList;
  }

  async getBalance(): Promise<number> {
    const { data } = await this.httpService
      .get<IBalance>(
        'https://run.mocky.io/v3/e0f453b7-620c-4479-839e-28ac58111fca',
      )
      .toPromise();

    return data.balance;
  }
}
