// import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import { getRepository, getCustomRepository } from 'typeorm';
import Category from '../models/Category';
import AppError from '../errors/AppError';

interface RequestDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: RequestDTO): Promise<Transaction> {
    // TODO

    let categoryFetched;
    const categoryRepository = getRepository(Category);
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const checkCategoryExists = await categoryRepository.findOne({
      where: { title: category },
    });

    const totalBalance = await transactionsRepository.getBalance();

    if (type === 'outcome' && value > totalBalance.total) {
      throw new AppError('outcome cannot be greater than total balance');
    }

    if (checkCategoryExists) categoryFetched = checkCategoryExists;
    else {
      categoryFetched = categoryRepository.create({ title: category });
      await categoryRepository.save(categoryFetched);
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: categoryFetched,
    });
    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
