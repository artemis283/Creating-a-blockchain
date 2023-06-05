// Creating a class to represent a block in the blockchain
// Index = where the block sits on the chain
// Timestamp = when the block was created
// Data = any type of data we want to associate with this block e.g. transaction details such as amount sent, sender, receiver
// PreviousHash = string that contains the hash of the block before this one ensuring the integrity of the blockchain
const SHA256 = require('crypto-js/sha256');

class Block{
    constructor(index, timestamp, data, previousHash = ''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash(); // Hash of the block
    }

    calculateHash(){
        // Hash function to calculate the hash of the block
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()] // Array that will hold all the blocks in our blockchain
    }

    createGenesisBlock(){
        return new Block(0, "01/01/2023", "Genesis block", "0"); // Manually create the first block in the chain
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1]; // Return the last block in the chain
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash; // Set the previous hash to the hash of the latest block
        newBlock.hash = newBlock.calculateHash(); // Calculate the hash of the new block
        this.chain.push(newBlock); // Add the new block onto the chain
    }
}

// Testing the blockchain
let ArtemisCoin = new Blockchain();
ArtemisCoin.addBlock(new Block(1, "01/02/2023", {amount: 4}));
ArtemisCoin.addBlock(new Block(2, "05/02/2023", {amount: 10}));

console.log(JSON.stringify(ArtemisCoin, null, 4)); // Print the blockchain to the console
