import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import Web3 from "web3";

describe("SwapLab Test", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployContractsFixture() {
   
    const [owner, acc1] = await ethers.getSigners();
    const SwapLab = await ethers.getContractFactory("SwapLab");
    const TestToken = await ethers.getContractFactory("TestToken");
    
    const testToken = await TestToken.deploy();
    await testToken.deployed();
    const swapLab = await SwapLab.deploy(testToken.address);
    await swapLab.deployed();
    
    const claimDrop = async() => {
      await testToken.connect(acc1).selfClaimDrop();
    }

    const balanceOf = async(who: string) => { return await testToken.balanceOf(who); }

    return { acc1, claimDrop, balanceOf, owner, testToken, swapLab };
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

    it("Should swapToken successFully", async function () {
      const { swapLab, testToken, acc1, owner, balanceOf, claimDrop} = await loadFixture(deployContractsFixture);
      const acc1Address = acc1.address;
      const swaplabAddr = swapLab.address;

      const amountToSwap = Web3.utils.toHex("3000");
      const deposit = Web3.utils.toHex("3000000000000000000000");
      await balanceOf(acc1Address).then(async(intiBal) => {
        await swapLab.connect(owner).deposit({value: deposit});
        const initContractBalance = await (await ethers.getSigner(swaplabAddr)).getBalance();
        console.log("Owner Balance", await (await ethers.getSigner(owner.address)).getBalance());
        console.log("InitContract Balance after deposit", initContractBalance.toString());

        await claimDrop().then(async() => {
          await balanceOf(acc1Address).then(async(retVal) => {
            expect(retVal).to.be.gt(intiBal);
            await testToken.connect(acc1).approve(swaplabAddr, amountToSwap).then(async(x) => {
              if(x) {
                await swapLab.connect(acc1).swapERC20ForCelo(testToken.address);
                const newBal = await balanceOf(acc1.address);
                const newContractBal = await (await ethers.getSigner(swaplabAddr)).getBalance();
                console.log("newContractBal", newContractBal);
                expect(newContractBal).to.be.lt(initContractBalance);
                expect(newBal.toString()).to.be.equal('2000000000000000000000'); 
              }
            })
          })
        })
      })


    });

  });
});
