import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();
    const income = transactions.reduce((sum, transaction) => {
      console.log('income teste', transaction.value);
      if (transaction.type === 'income') return sum + Number(transaction.value);
      else return sum + 0;
    }, 0);

    console.log(income);

    const outcome = transactions.reduce((sum, transaction) => {
      if (transaction.type === 'outcome')
        return sum + Number(transaction.value);
      else return sum + 0;
    }, 0);

    const total = income - outcome;

    let balance: Balance = { income, outcome, total };

    return balance;
    // TODO
  }
}

export default TransactionsRepository;
