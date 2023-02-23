import { ethers } from "hardhat";
import Web3 from 'web3'

async function main() {
  const feeTo = "0xA7B2387bF4C259e188751B46859fcA7E2043FEFD";
  const transferAmount = Web3.utils.toHex('100000000000000000000000');
  const removalFee = Web3.utils.toHex('10000000000');
  const DRythm = await ethers.getContractFactory("DRythm");
  const dRythm = await DRythm.deploy(feeTo);

  await dRythm.deployed();

  await dRythm.approveUploader(feeTo);
  await dRythm.approveUploader("0x16101742676EC066090da2cCf7e7380f917F9f0D");
  await dRythm.approveUploader("0xe63537C16094Fcd6b49FE6730c182eC973940F4F");
  await dRythm.setFee(removalFee, removalFee);
  await dRythm.transfer(feeTo, transferAmount);
  await dRythm.transfer("0x16101742676EC066090da2cCf7e7380f917F9f0D", transferAmount);
  await dRythm.transfer("0xe63537C16094Fcd6b49FE6730c182eC973940F4F", transferAmount);

  console.log(`DRythm depoyed to ${dRythm.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
