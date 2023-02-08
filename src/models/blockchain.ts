import axios from 'axios';
import Block from "../models/block";
import Network from "./network";
import Transaction from "./transaction";

export default class Blockchain {
    public readonly network: Network;
    public chain: Array<Block> = [];
    public currentTransactions: Array<Transaction> = [];

    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.currentTransactions = [];
        this.network = new Network();
    }

    /**
    * Returns the whole blockchain length
    *
    * @return {number} The blockchain length
    */
    public getChainLength = (): number => {
        return this.chain.length;
    }

    /**
    * Returns the last mined block in the blockchain
    *
    * @return {Block} The last block
    */
    public getLatestBlock(): Block {
        return this.chain[this.chain.length - 1];
    }

    /**
    * Create a new block in the Blockchain
    *
    * @param {number} proof The proof number given by the Proof of Work algorithm
    * @param {string} previousHash The previous block hash
    * @return {Block} A new block
    */
    public addBlock(proof: number, previousHash: string = undefined): Block {
        const newBlock = new Block(this.chain.length + 1, this.currentTransactions, new Date().getTime(), proof, previousHash ?? this.getLatestBlock().hash);

        this.currentTransactions = [];
        this.chain.push(newBlock);

        return newBlock;
    }

    /**
    * Creates a new transaction that will go in the next mined block
    *
    * @param {string} sender The address of the sender
    * @param {string} recipient The address of the recipient
    * @param {number} amount The amount that is being transferred
    * @return {number} Returns the index of the next block which is to be mined where the transaction should go
    */
    public addNewTransaction(sender: string, recipient: string, amount: number): number {
        const newTransaction = new Transaction(sender, recipient, amount);

        this.currentTransactions.push(newTransaction);

        return this.getLatestBlock().index + 1;
    }

    /**
    * Verifies whether the blockchain is valid by comparing the block hashes
    *
    * @param {Block[]} chain The blockchain that needs to be verified
    * @return {boolean} True or false based on the hash calculations
    */
    public isChainValid(chain: Block[]): boolean {
        const chainLength = chain.length;

        for (let i = 1; i < chainLength; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }

    /**
    * Resolve conflicts between the blockchain nodes using the "Longest Chain" rule
    * The the "Longest Chain" rule states that the version of the blockchain with the
    * most blocks is considered the authoritative version
    *
    * @return {boolean} True if conflicts were resolved and there is a new chain
    *                   False if the current chain remains
    */
    public async resolveConflicts(): Promise<boolean> {
        let newChain: Block[] = null;
        let maxLength = this.chain.length;

        for (const node of this.network.nodes) {
            const response: { chain: Block[], length: number } = await axios.get(`${node}/chain`);
            const nodeBlockchain = response;

            if (nodeBlockchain.length > maxLength && this.isChainValid(nodeBlockchain.chain)) {
                maxLength = nodeBlockchain.length;
                newChain = nodeBlockchain.chain;
            }
        }

        if (newChain) {
            this.chain = newChain;
            return true;
        }

        return false;
    }

    private createGenesisBlock(): Block {
        return new Block(this.chain.length + 1, null, null, null, '');
    }
}