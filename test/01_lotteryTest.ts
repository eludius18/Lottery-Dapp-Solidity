import { deployments, ethers, waffle } from "hardhat";
import { BigNumber, Signer } from "ethers";
import { Lottery } from "../../typechain-types/contracts";
import { Deployment } from "hardhat-deploy/dist/types";
import { expect, assert } from "chai";
import { advanceBlock, advanceBlocks, increaseTime, latestBlockTimestamp } from "./test-helpers/time";
import { makeSnapshot, snapshot } from "./test-helpers/snapshot";
import { parseUnits } from "ethers/lib/utils";
import Web3 from "web3";
import { Transaction } from "web3-eth";

describe("DutchAuction Test suite", async function () {
    let accounts: Signer[];
    let lotteryDeployment: Deployment;
    let lotteryContract: Lottery;
    let owner: Signer;
    let alice: Signer;
    let bob: Signer;
    let miniumPayment:number = 2;
    const provider = waffle.provider;

    before(async function () {
      accounts = await ethers.getSigners();
      owner = accounts[0];
      alice = accounts[1];
      bob = accounts[2];
      lotteryDeployment = await deployments.get("Lottery");
      lotteryContract = await ethers.getContractAt(
        "Lottery",
        lotteryDeployment.address
      );
    });

    describe("Variables Checks", () => {
        it("should initialize with the correct minium payment", async () => {
            const id: number = await makeSnapshot();
            const result = await lotteryContract.getMiniumPayment();
            expect(result).to.equal(miniumPayment);
            snapshot(id);
        });
        it("should allow Owner to change Minium Payment Value", async () => {
            const id: number = await makeSnapshot();
            await lotteryContract.connect(owner).changeDefaultMiniumPayment(5);
            const result = await lotteryContract.getMiniumPayment();
            expect(result).to.equal(5);
            snapshot(id);
        });
        it("should allow anyone to get balance in lottery", async () => {
            const id: number = await makeSnapshot();
            await lotteryContract.connect(alice).enterLottery({value: 5});
            await lotteryContract.connect(bob).enterLottery({value: 5});
            const result = await lotteryContract.getBalance();
            expect(result).to.equal(10);
            snapshot(id);
        });
    });

    describe("enterLottery function checks", () => {
        it("should allow only values greater than 0", async () => {
            const id: number = await makeSnapshot();
            await expect(lotteryContract.connect(alice).enterLottery({value: 0})).to.revertedWith("You must send Ether to enter the lottery");
            snapshot(id);
        });
        it("shoul not allow amounts of ether that doesn't meet Minium value Payment defined", async () => {
            const id: number = await makeSnapshot();
            await expect(lotteryContract.connect(alice).enterLottery({value: 1})).to.revertedWith("You must send a Minium amout of Ether");
            snapshot(id);
        });
        it("should not allow to enter ether when the Smart Contract is paused", async () => {
            const id: number = await makeSnapshot();
            await lotteryContract.connect(owner).pause();
            await expect(lotteryContract.connect(alice).enterLottery({value: 4})).to.revertedWith("Pausable: paused");
            snapshot(id);
        });
        it("should allow anyone can use enter function", async () => {
            const id: number = await makeSnapshot();
            await lotteryContract.connect(alice).enterLottery({value: 3});
            await lotteryContract.connect(bob).enterLottery({value: 5});
            snapshot(id);
        });
    });
    describe("selectWinner function checks", () => {
        it("should allow Only to Owner to use selectWinner function", async () => {
            const id: number = await makeSnapshot();
            await lotteryContract.connect(alice).enterLottery({value: 3});
            await expect (lotteryContract.connect(bob).selectWinner()).to.revertedWith("Ownable: caller is not the owner");
            snapshot(id);
        });
        it("should send all amount in Lottery Smart Contracts sent to Winner", async () => {
            const id: number = await makeSnapshot();
            await lotteryContract.connect(alice).enterLottery({value: 3});
            await lotteryContract.connect(bob).enterLottery({value: 10});
            await lotteryContract.connect(owner).selectWinner();
            const lotteryBalance = await lotteryContract.connect(owner).getBalance();
            expect(lotteryBalance).to.equal(0);
            snapshot(id);
        });
        it("should allow users can send ether as many times as they want before distributing the prizes", async () => {
            const id: number = await makeSnapshot();
            await lotteryContract.connect(alice).enterLottery({value: 3});
            await lotteryContract.connect(bob).enterLottery({value: 5});
            await lotteryContract.connect(bob).enterLottery({value: 12});
            await lotteryContract.connect(owner).selectWinner();
            const lotteryBalance = await lotteryContract.connect(owner).getBalance();
            expect(lotteryBalance).to.equal(0);
            snapshot(id);
        });
    });
    describe("Whole Test()", () => {
        describe("Send ether and Select Winner", () => {
            it("should allow Alice to send 3 ether and win the Lottery if its the only who send ether", async () => {
                await lotteryContract.connect(alice).enterLottery({value: 3});
                await lotteryContract.connect(owner).selectWinner();
                const lotteryBalance = await lotteryContract.connect(owner).getBalance();
                expect(lotteryBalance).to.equal(0);
            });
            it("should allow Alice to send 3 ether and Bob to send 5 ether before distributing the prizes", async () => {
                await lotteryContract.connect(alice).enterLottery({value: 3});
                await lotteryContract.connect(bob).enterLottery({value: 5});
                await lotteryContract.connect(owner).selectWinner();
                const lotteryBalance = await lotteryContract.connect(owner).getBalance();
                expect(lotteryBalance).to.equal(0);
            });
        });
    });
});