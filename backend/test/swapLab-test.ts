import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumberish } from "ethers";
import { hexlify } from "ethers/lib/utils";
import { ethers } from "hardhat";
import Web3 from "web3";

const DEPOSIT = Web3.utils.toHex("3000000000000000000000");
const SWAPFEE = Web3.utils.toHex("100000000000000000");
const AMOUNT_TO_SWAP = Web3.utils.toHex("3000000000000000000000");

describe("SwapLab Test", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployContractsFixture() {
   
    const [owner, acc1, acc2] = await ethers.getSigners();
    const SwapLab = await ethers.getContractFactory("SwapLab");
    const TestToken = await ethers.getContractFactory("TestToken");
    
    const testToken = await TestToken.deploy();
    await testToken.deployed();
    const swapLab = await SwapLab.deploy(testToken.address);
    await swapLab.deployed();
    
    const claimDrop = async() => {
      await testToken.connect(acc1).selfClaimDrop();
    }

    const addLiquidityAndTest = async(from:SignerWithAddress, value: BigNumberish) => {
      await swapLab.connect(from).addLiquidity({value: value});
      const balAfterAddLiquidity = await getBalance(swapLab.address);
      const data = await getdata(from);
      expect(balAfterAddLiquidity).to.equal(value.toString());
      expect(data._provider.amount._hex).to.equal(value.toString());
      expect(data._totalLiquidity._hex).to.equal(value.toString());
      expect(data._totalProvider._hex).to.equal(hexlify(1));
    }

    const removeLiquidityAndTest = async(from:SignerWithAddress, value: BigNumberish) => {
      await addLiquidityAndTest(from, value);
      const balContractAfterAddLiquidity = await getBalance(swapLab.address);
      const balFromAfterAddLiquidity = await getBalance(from.address);
      await swapLab.connect(from).removeLiquidity();

      const balContractAfterRemoveLiquidity = await getBalance(swapLab.address);
      const balFromAfterRemoveLiquidity = await getBalance(from.address);
      const data = await getdata(from);
      expect(balContractAfterRemoveLiquidity).to.be.lessThan(balContractAfterAddLiquidity);
      expect(balFromAfterRemoveLiquidity).to.be.greaterThan(balFromAfterAddLiquidity);
      expect(data._provider.amount._hex).to.equal(hexlify(0));
      expect(data._totalLiquidity._hex).to.equal(hexlify(0));
      expect(data._totalProvider._hex).to.equal(hexlify(0));
    }

    const splitFee = async(from:SignerWithAddress) => {
      return await swapLab.connect(from).splitFee();
    }

    const getdata = async(from: SignerWithAddress) => {
      return await swapLab.connect(from).getData();
    }

    const getBalance = async(who:string) => {
      return await (await ethers.getSigner(who)).getBalance()
    }

    const swapAndTest = async(from: SignerWithAddress, provider: SignerWithAddress) => {
      await balanceOf(from.address).then(async(intiBal) => {
        await addLiquidityAndTest(provider, DEPOSIT);

        await claimDrop().then(async() => {
          await balanceOf(from.address).then(async(retVal) => {
            expect(retVal).to.be.gt(intiBal);
            await testToken.connect(acc1).approve(swapLab.address, AMOUNT_TO_SWAP).then(async(x) => {
              if(x) {
                await swapLab.connect(acc1).swapERC20ForCelo(testToken.address, {value: SWAPFEE});
                const newBal = await balanceOf(acc1.address);
                const newContractBal = await (await ethers.getSigner(swapLab.address)).getBalance();
                expect(newBal.toString()).to.be.equal('2000000000000000000000'); 
              }
            })
          })
        })
      })
      
    }

    const balanceOf = async(who: string) => { return await testToken.balanceOf(who); }

    return { 
      acc1, 
      acc2,
      owner,
      getdata,
      swapLab, 
      splitFee,
      claimDrop, 
      balanceOf, 
      testToken,
      getBalance,
      swapAndTest,
      addLiquidityAndTest,
      removeLiquidityAndTest,
    };
  }

  describe("Deployment", function () {
    it("Should set Metadata correctly", async function () {
      const { testToken } = await loadFixture(deployContractsFixture);
      const totalSupply = Web3.utils.toHex("5000000000000000000000");
      expect((await testToken.name())).to.equal("CELOG Token");
      expect((await testToken.symbol())).to.equal("CELOG");
      expect((await testToken.decimals())).to.equal(18);
      expect(Web3.utils.toHex((await testToken.totalSupply()).toString())).eq(Web3.utils.toHex(totalSupply));
    });

    it("Should add liquidity successFully", async function () {
      const { acc1, addLiquidityAndTest } = await loadFixture(deployContractsFixture);
        await addLiquidityAndTest(acc1, DEPOSIT);
    });

    it("Should remove liquidity successFully", async function () {
      const { acc1, removeLiquidityAndTest } = await loadFixture(deployContractsFixture);
      await removeLiquidityAndTest(acc1, DEPOSIT);
    });

    it("Should swapToken successFully", async function () {
      const { acc1, swapAndTest, acc2 } = await loadFixture(deployContractsFixture);
      await swapAndTest(acc1, acc2);
    });

    it("Should split successFully", async function () {
      const { acc1, acc2, swapAndTest, swapLab, getBalance } = await loadFixture(deployContractsFixture);
      await swapAndTest(acc1, acc2);
      const intiBalAcc2B4Split = await getBalance(acc2.address);
      const intiBalContractB4Split = await getBalance(swapLab.address);
      await swapLab.connect(acc2).splitFee();
      const balAcc2AfterSplit = await getBalance(acc2.address);
      const balContractAfterSplit = await getBalance(swapLab.address);
      expect(balAcc2AfterSplit.gt(intiBalAcc2B4Split)).to.be.true;
      expect(balContractAfterSplit.toString()).to.be.lessThan(intiBalContractB4Split);
    });

    it("Should revert if not provider trying to split", async function () {
      const { acc1, acc2, owner, swapAndTest, addLiquidityAndTest, swapLab, getBalance } = await loadFixture(deployContractsFixture);
      await swapAndTest(acc1, owner);
      expect(swapLab.connect(acc2).splitFee()).to.revertedWith("Not a provider");
    });

    it("Should revert if no fee is generated", async function () {
      const { acc2, addLiquidityAndTest, swapLab } = await loadFixture(deployContractsFixture);
      await addLiquidityAndTest(acc2, DEPOSIT);
      expect(swapLab.connect(acc2).splitFee()).to.revertedWith("Fee cannot be split at this time");
    });

  });
});
