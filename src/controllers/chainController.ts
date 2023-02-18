import express from 'express'
import { Request, Response } from 'express'
import IControllerBase from '../interfaces/IControllerBase';
import Block from '../models/block';
import Blockchain from '../models/blockchain';
import Transaction from '../models/transaction';

const blockchain = new Blockchain();

class ChainController implements IControllerBase {
    public path = '/chain';
    public router = express.Router();

    constructor() {
        this.initRoutes();
    }

    public initRoutes() {
        this.router.get(this.path, this.getBlockchain);
        this.router.post(this.path + '/mine', this.mineNewBlock);
        this.router.get(this.path + '/transactions', this.getPendingTransactions);
        this.router.post(this.path + '/transactions/new', this.addNewTransaction);
        this.router.post(this.path + '/nodes/add', this.addNewNode);
        this.router.get(this.path + '/nodes/conflicts/resolve', this.resolveNodeConflicts);
    }

    public getBlockchain(req: Request, res: Response) {
        const chain = blockchain.chain;
        const chainLength = blockchain.getChainLength();

        res.json({
            chain,
            length: chainLength
        });
    }

    public mineNewBlock(req: Request, res: Response) {
        const latestBlock: Block = blockchain.getLatestBlock();
        const lastProof: number = latestBlock.proof;
        const proof: number = latestBlock.calculateProofOfWork(lastProof);

        const block = blockchain.addBlock(proof, latestBlock.hash);

        res.json({
            message: 'A new Block has been mined.',
            index: block.index,
            transactions: block.transactions,
            timestamp: block.timestamp,
            proof: block.proof,
            previousHash: block.previousHash
        });
    }

    public getPendingTransactions(req: Request, res: Response) {
        const latestTransactions: Transaction[] = blockchain.currentTransactions;

        res.send({
            message: 'Fetching pending transactions',
            transactions: latestTransactions
        });
    }

    public addNewTransaction(req: Request, res: Response) {
        const { sender, recipient, amount }: Transaction = req.body;

        if (!sender) {
            throw new Error('Missing request body parameter: sender');
        }
        if (!recipient) {
            throw new Error('Missing request body parameter: recipient');
        }
        if (!amount) {
            throw new Error('Missing request body parameter: amount');
        }

        const index = blockchain.addNewTransaction(sender, recipient, amount);

        res.send({
            message: `New transaction/s will be added to block number ${index}`
        });
    }

    public addNewNode(req: Request, res: Response) {
        const nodes: Array<string> = req.body?.nodes;

        if (!nodes || nodes.length === 0) {
            throw new Error('Missing request body parameter: nodes');
        }

        for (const node of nodes) {
            blockchain.addNewNode(node);
        }

        res.send({
            message: 'New nodes have been added to the blockchain',
            nodes: blockchain.network.nodes
        });
    }

    public resolveNodeConflicts(req: Request, res: Response) {
        const isBlockchainReplaced = blockchain.resolveConflicts();

        if (isBlockchainReplaced) {
            res.send({
                message: 'The chain has been replaced',
                chain: blockchain.chain
            });
        } else {
            res.send({
                message: 'The chain is authoritative and is not replaced',
                chain: blockchain.chain
            });
        }
    }
}

export default ChainController;