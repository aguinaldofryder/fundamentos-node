import { uuid } from 'uuidv4';
import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const income = this.reduceValueTransactionByType('income');
    const outcome = this.reduceValueTransactionByType('outcome');
    const total = income - outcome;

    const balance: Balance = { income, outcome, total };
    return balance;
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({
      title,
      value,
      type,
    });
    this.transactions.push(transaction);

    return transaction;
  }

  private reduceValueTransactionByType(type: 'income' | 'outcome'): number {
    const checkTransaction = this.getCheckTransactionByType(type);

    const total = this.transactions
      .filter(checkTransaction)
      .reduce(this.agregateValueTransaction, 0);

    return total;
  }

  private getCheckTransactionByType(
    type: 'income' | 'outcome',
  ): (transaction: Transaction) => boolean {
    return type === 'income'
      ? this.checkTransactionTypeIsIncome
      : this.checkTransactionTypeIsOutcome;
  }

  private checkTransactionTypeIsIncome(transaction: Transaction): boolean {
    return transaction.type === 'income';
  }

  private checkTransactionTypeIsOutcome(transaction: Transaction): boolean {
    return transaction.type === 'outcome';
  }

  private agregateValueTransaction(
    total: number,
    transaction: Transaction,
  ): number {
    return total + transaction.value;
  }
}

export default TransactionsRepository;
