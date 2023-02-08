export default class Transaction {
    public sender: string;
    public recipient: string;
    public amount: number;

    constructor(sender: string, recipient: string, amount: number) {
        this.sender = sender;
        this.recipient = recipient;
        this.amount = amount;
      }
}