// Creating a class to represent a block in the blockchain
// Index = where the block sits on the chain
// Timestamp = when the block was created
// Data = any type of data we want to associate with this block e.g. transaction details such as amount sent, sender, receiver
// PreviousHash = string that contains the hash of the block before this one ensuring the integrity of the blockchain
const SHA256 = require('crypto-js/sha256');

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress; // Public key
        this.toAddress = toAddress; // Public key
        this.amount = amount; // Amount of coins sent
    }
}

class Block{
    constructor(timestamp, transactions, previousHash = ''){
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash(); // Hash of the block
        this.nonce = 0; // Random number that has nothing to do with the block but can be changed to affect the hash of the block
    }

    calculateHash(){
        // Hash function to calculate the hash of the block
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }
    
    mineBlock(difficulty){
        // Keep changing the nonce until the hash of the block starts with enough 0s
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++; // Increment the nonce
            this.hash = this.calculateHash(); // Calculate the hash of the block
        }

        console.log("Block mined: " + this.hash);
    }
}


class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()] // Array that will hold all the blocks in our blockchain
        this.difficulty = 2; // Difficulty of the proof of work algorithm
        this.pendingTransactions = []; // Transactions that haven't been put into a block yet
        this.miningReward = 100; // Reward for mining a block
    }

    createGenesisBlock(){
        return new Block(0, "01/01/2023", "Genesis block", "0"); // Manually create the first block in the chain
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1]; // Return the last block in the chain
    }

    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTransactions); // Create a new block with the pending transactions
        block.mineBlock(this.difficulty); // Mine the block with the difficulty

        console.log('Block successfully mined!');
        this.chain.push(block); // Add the block to the chain

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
         ]; // Reset the pending transactions and add a new transaction to send the mining reward
    }   
    
    createTransaction(transaction){
        this.pendingTransactions.push(transaction); // Add the transaction to the pending transactions
    }

    getBalanceOfAddress(address){
        let balance = 0; // Start the balance at 0

        for(const block of this.chain){ // Loop through the blocks in the chain
            for(const trans of block.transactions){ // Loop through the transactions in the block
                if(trans.fromAddress === address){ // If the address is the sender
                    balance -= trans.amount; // Subtract the amount from the balance
                }

                if(trans.toAddress === address){ // If the address is the receiver
                    balance += trans.amount; // Add the amount to the balance
                }
            }
        }

        return balance; // Return the balance
    }

    isChainValid(){
        // Loop through the chain and check if the hash of each block is valid
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i]; // Current block
            const previousBlock = this.chain[i - 1]; // Previous block

            // Check if the hash of the current block is valid
            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            // Check if the previous hash of the current block is equal to the hash of the previous block
            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }

        // If the chain is valid
        return true;
    }
}

// Testing the blockchain
let ArtemisCoin = new Blockchain();
ArtemisCoin.createTransaction(new Transaction('address1', 'address2', 100));
ArtemisCoin.createTransaction(new Transaction('address2', 'address1', 50));

console.log('\n Starting the miner...');
ArtemisCoin.minePendingTransactions('artemis-address');

console.log('\nBalance of Artemis is', ArtemisCoin.getBalanceOfAddress('artemis-address'));

console.log('\n Starting the miner again...');
ArtemisCoin.minePendingTransactions('artemis-address');

console.log('\nBalance of Artemis is', ArtemisCoin.getBalanceOfAddress('artemis-address'));

// console.log('Mining block 1...');
// ArtemisCoin.addBlock(new Block(1, "01/02/2023", {amount: 4}));

// console.log('Mining block 2...');
// ArtemisCoin.addBlock(new Block(2, "05/02/2023", {amount: 10}));

// console.log('Is blockchain valid? ' + ArtemisCoin.isChainValid()); // Check if the blockchain is valid

// ArtemisCoin.chain[1].data = {amount: 100};
// ArtemisCoin.chain[1].hash = ArtemisCoin.chain[1].calculateHash();

// console.log('Is blockchain valid? ' + ArtemisCoin.isChainValid()); // Tamper with the data to check if the blockchain is still valid    

//console.log(JSON.stringify(ArtemisCoin, null, 4)); // Print the blockchain to the console

