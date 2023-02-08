# Blockchain API example
This repository contains examples of how to implement a simple blockchain in **Node.js** with **Typescript** and **Express**. The blockchain uses an array to store the blocks, and a proof of work mechanism to secure the network.


## Installation

Clone this repository
```shell
$ git clone https://github.com/MiroslavStoyanov/blockchain-api-example.git
```
Change into the repository directory
```shell
$ cd blockchain-api-example
```
Install the dependencies
```shell
$ npm install
```
Start the server
```shell
$ npm run start
```
---

## API
The repository has the following endpoints

#### Get the whole blockchain for the current (actual) node and it length

- *Request*: `curl --location --request POST 'http://localhost:3000/chain/'`
- *Response*:
    ```JSON
    {
        "chain": [
            {
                // The genesis block
                "index": 1,
                "transactions": [],
                "timestamp": 1675865722984,
                "proof": 100,
                "previousHash": "0",
                "hash": "d56373f715d8965732b2efadf5fa1f8644d214aaf1ad2785cc7f546d33138070"
            }
        ],
        "length": 1
    }
    ```

#### Mine (add) a new block to the current blockchain

- *Request*: `curl --location --request GET 'http://localhost:3000/chain/mine'`
- *Response*:
    ```JSON
    {
        "message": "A new Block has been mined.",
        "index": 2,
        "transactions": [],
        "timestamp": 1675865814963,
        "proof": 35293,
        "previousHash": "d56373f715d8965732b2efadf5fa1f8644d214aaf1ad2785cc7f546d33138070"
    }
    ```

#### Get the pending transactions (if any) that are going to be added in the next mined block

- *Request*: `curl --location --request GET 'http://localhost:3000/chain/transactions'`
- *Response*:
    ```JSON
    {
        "message": "Fetching pending transactions",
        "transactions": [
            {
                "sender": "Sender 1",
                "recipient": "Recipient 1",
                "amount": 100
            },
            {
                "sender": "Sender 2",
                "recipient": "Recipient 2",
                "amount": 1001
            }
        ]
    }
    ```

#### Create a new transaction that will go in the next mined block

- *Request*:
    ```shell
    curl --location --request POST 'http://localhost:3000/chain/transactions/new' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "sender": "Sender 2",
        "recipient": "Recipient 2",
        "amount": 1001
    }'
    ```
- *Response*:
    ```JSON
    {
        "message": "New transaction will be added to block number ${blockNumber}"
    }
    ```

#### TODO: Add endpoints regarding adding new nodes and resolving conflicts between nodes

## Usage
The repository contains the following folders:

- `controllers`: contains Typescript controllers that provide API endpoints, allowing to test the blockchain logic
- `middleswares`: a simple logger that logs the requests
- `models`: contains simple Typescript models such as `Blockchain.ts` and `Block.ts` that contain the necessary logic to implement a working blockchain

The example will output different information about the blockchain based on the API responses listed above.

## Conclusion
This repository provides a simple implementation of a blockchain in Node.js. The code serves as a starting point for further development and experimentation with the blockchain technology.