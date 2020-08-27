import { getRepository } from 'typeorm';
import Transaction from '../models/Transaction';

// import AppError from '../errors/AppError';
interface RequestDTO {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: RequestDTO): Promise<void> {
    const transactionRepository = getRepository(Transaction);

    const transactionToDelete = await transactionRepository.findOne({
      where: { id },
    });

    if (transactionToDelete)
      await transactionRepository.remove(transactionToDelete);
  }
}

export default DeleteTransactionService;
