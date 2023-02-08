import { SHA256 } from "crypto-js";
import Transaction from "./transaction";

export default class Block {
    public index: number;
    public transactions: Array<Transaction>;
    public previousHash: string;
    public timestamp: number;
    public proof: number;
    public hash: string;

    constructor(index: number, transactions: Array<Transaction>, timestamp: number, proof: number, previousHash: string) {
      this.index = index || 1;
      this.transactions = transactions || [];
      this.timestamp = timestamp || Date.now();
      this.proof = proof || 100;
      this.previousHash = previousHash || '0';
      this.hash = this.calculateHash();
    }

  /**
    * Hashes the block's timestamp, transactions and previousHash properties to create a new hash
    * that will be linked to the next mined block
    *
    * @return {SHA256} Returns the hash
    */
    public calculateHash(): SHA256 {
      return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions)).toString();
    }

  /**
    * A simple Proof of Work algorithm is used here
    * We try to find a number P such that hash(P') contains 4 leading zeroes, where P is the previous P'
    * In this case P is the previous proof and P' is the new proof
    *
    * @param {number} lastProof The proof of the latest block
    * @return {number} Returns the proof number
    */
    public calculateProofOfWork(lastProof: number): number {
      let proof = 0;
      while (!this.validProof(proof, lastProof)) {
        proof++;
      }
      return proof;
    }

  /**
    * Validate the proof by the following logic: does `hash(lastProof, proof)` contain 4 leading zeroes?
    * If it does, return true. If it doesn't, return false
    *
    * @param {int} proof     The current proof
    * @param {int} lastProof The previous proof
    * @return {boolean} `true` if correct, `false` otherwise
    */
    private validProof(proof: number, lastProof: number): boolean {
      const guess = `${lastProof}${proof}`;
      const guessHash = SHA256(guess).toString();
      return guessHash.substring(0, 4) === '0000';
    }
}