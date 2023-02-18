# Blockchain API example
This repository contains examples of how to implement a simple blockchain using **Node.js**, **Typescript** and **Express**. The blockchain uses an array to store the blocks, and a simple proof of work mechanism to secure the network.

## Installation :robot:

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

## Getting started :closed_book:

The basic idea of the project is to create an API that exposes public endpoints which mimic the blockchain's basic functions.
You can use a tool like [Postman](https://www.postman.com/) to execute the endpoints.
The repository has the following endpoints :point_down:

#### Get chain

Get the whole blockchain and its length.

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

#### Mine new block

Mines (adds) a new block to the current blockchain.

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

#### Get pending transactions

Get the pending transactions (if any) that are going to be added in the next mined bloc.

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

#### Create new transaction

Creates a new transaction that will go in the next mined block.

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

#### Add network node

Adds a new node to the current list of nodes in the blockchain.

- *Request*:
    ```shell
    curl --location --request POST 'http://localhost:3000/chain/nodes/add' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "nodes": [
            "http://127.0.0.1:3000",
            "https://a-node-example-url.com"
        ]
    }'
    ```
- *Response*:
    ```JSON
    {
        "message": "New nodes have been added to the blockchain",
        "nodes": [
            "http://127.0.0.1:3000",
            "https://a-node-example-url.com"
        ]
    }
    ```

#### Add a new node to the network
Resolve conflicts between the blockchain nodes using the **Longest Chain** rule
The **Longest Chain** rule states that the version of the blockchain with the most blocks is considered the authoritative version
- *Request*:
    ```shell
    curl --location --request GET 'http://localhost:3000/chain/nodes/conflicts/resolve' \
    --header 'Content-Type: application/json'
    ```
- *Responses*:
    ```JSON
    {
        "message": "The chain has been replaced",
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
        ]
    }
    ```
    ```JSON
    {
        "message": "The chain is authoritative and is not replaced",
        "chain": [
            {
                // The genesis block
                "index": 1,
                "transactions": [],
                "timestamp": 1675865722984,
                "proof": 100,
                "previousHash": "0",
                "hash": "d56373f715d8965732b2efadf5fa1f8644d214aaf1ad2785cc7f546d33138070"
            },
            {
                "index": 2,
                "transactions": [],
                "timestamp": 1675865814963,
                "proof": 35293,
                "previousHash": "d56373f715d8965732b2efadf5fa1f8644d214aaf1ad2785cc7f546d33138070",
                "hash": "d56373f715d8965732b35fgjf5fa1f8644d214aaf1ad2785cc7f546d331ghtop"
            }
        ]
    }
    ```

## Usage :hammer_and_wrench:
The repository contains the following folders:

- `controllers`: contains Typescript controllers that provide API endpoints, allowing to test the blockchain logic
- `middleswares`: a simple logger that logs the requests
- `models`: contains simple Typescript models such as `Blockchain.ts`, `Block.ts`, `Trasnsaction.ts` and `Network.ts` that contain the necessary properties to implement a working blockchain.

The example will output different information about the blockchain based on the API responses [listed above](#getting-started-closed_book) :point_up:

## Conclusion
This repository provides a simple implementation of a blockchain in Node.js. The code serves as a starting point for further development and experimentation with the blockchain technology.