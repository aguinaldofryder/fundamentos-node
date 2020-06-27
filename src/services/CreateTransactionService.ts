import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: Request): Transaction {
    const { total } = this.transactionsRepository.getBalance();

    this.checkAmountLessThanBalance(type, value, total);

    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
    });
    return transaction;
  }

  private checkAmountLessThanBalance(
    type: string,
    value: number,
    total: number,
  ): void {
    if (type === 'outcome' && value > total) {
      throw new Error(
        'The amount posted is greater than the amount avaliable in cash',
      );
    }
  }
}

export default CreateTransactionService;
