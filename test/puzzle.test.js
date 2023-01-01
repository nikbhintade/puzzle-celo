const {
    loadFixture
} = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { utils } = require("ethers");
const { ethers } = require("hardhat");

describe('Puzzle', () => {
    async function contractFixture() {
        const accounts = await ethers.getSigners();

        const PUZZLE = await ethers.getContractFactory("Puzzle");
        const puzzle = await PUZZLE.deploy();
        await puzzle.deployed();

        return { accounts, puzzle };
    }
    //--------------- All tests will go below this ------------------------------

    it("should be deployed correctly", async () => {
        const { puzzle } = await loadFixture(contractFixture);

        expect(await puzzle.puzzleCounter()).to.be.equal(0);
    })

    it("should create a puzzle", async () => {
        const { accounts, puzzle } = await loadFixture(contractFixture);

        const answer = ethers.utils.id("sun");
        const clue = ethers.utils.formatBytes32String("I wake up everyone, who am I")

        expect(await puzzle.createPuzzle(clue, answer)).to.emit(puzzle, "newPuzzle").withArgs(`${accounts[0].address}`, 0)
        expect(await puzzle.puzzleCounter()).to.be.equal(1);

        const _puzzle = await puzzle.puzzles(0);

        expect(_puzzle.clue).to.be.equal(clue);
        expect(_puzzle.solved).to.be.false;
    })

    it("should quzzle get solved", async () => {
        const { accounts, puzzle } = await loadFixture(contractFixture);

        const answer = ethers.utils.id("sun");
        const clue = ethers.utils.formatBytes32String("I wake up everyone, who am I")

        await puzzle.createPuzzle(clue, answer);

        const result = await puzzle.solvePuzzle(0, 'sun');
        expect(result).to.be.emit(puzzle, "solved").withArgs(`${accounts[0].address}`, 0);

        const _puzzle = await puzzle.puzzles(0);

        expect(_puzzle.solved).to.be.true;
        await expect(puzzle.solvePuzzle(0, 'sun')).to.be.revertedWith("ALREADY_SOLVED");
    })

    it("should revert if wrong answer", async () => {
        const { puzzle } = await loadFixture(contractFixture);

        const answer = ethers.utils.id("sun");
        const clue = ethers.utils.formatBytes32String("I wake up everyone, who am I")

        await puzzle.createPuzzle(clue, answer);

        expect(await puzzle.solvePuzzle(0, 'cock')).to.be.revertedWith('WRONG_ANSWER');
    })


    //------------------End of the tests ----------------------------------------

})