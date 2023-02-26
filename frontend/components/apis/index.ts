import getContractData from "./contractdata";
import { InstanceProps, OptionProps, Result, data, Data } from "../../interfaces";
import { ethers, Contract, ContractReceipt} from "ethers";
import BigNumber from "bignumber.js";

// get contract instances
function contractInstances(props: InstanceProps) {
  const {
    swapAbi,
    swapAddr,
    tokenAbi,
    tokenAddr,
    providerOrSigner
  } = props;
  if(!providerOrSigner) alert('Provider not ready. Please connect wallet!');
  const swapLab = new Contract(swapAddr, swapAbi, new ethers.providers.Web3Provider(providerOrSigner).getSigner());
  const swapLab_noSigner = new Contract(swapAddr, swapAbi, new ethers.providers.Web3Provider(providerOrSigner).getSigner());
  const token = new Contract(tokenAddr, tokenAbi, new ethers.providers.Web3Provider(providerOrSigner).getSigner());
  const token_noSigner = new Contract(tokenAddr, tokenAbi, new ethers.providers.Web3Provider(providerOrSigner).getSigner());

  return { swapLab, swapLab_noSigner, token, token_noSigner }
}

async function runContractFunc(options: OptionProps) {
  const { functionName, cancelLoading, providerOrSigner, value, account, amount } = options;
  const { swapAbi, swapLabAddr, testTokenAbi, testAddr } = getContractData();
  const { 
    swapLab,
    // swapLab_noSigner,
    token,
    token_noSigner
   } = contractInstances({
    swapAbi,
    swapAddr: swapLabAddr,
    tokenAbi: testTokenAbi,
    tokenAddr: testAddr,
    providerOrSigner
   });

  let result : Result = {
    balanceOrAllowance: BigNumber(0),
    data: data
  }

  const getData = async() : Promise<Data> => {
    return await swapLab.getData();
  }

  const getAllowance = async(owner: string | undefined) : Promise<BigNumber> => {
    return await token.allowance(owner, swapLabAddr);
  }

  const getBalance = async(alc:string | undefined) : Promise<BigNumber> => {
    return await token.balanceOf(alc);
  }
  
  switch (functionName) {
    case 'swap':
      console.log("Test addr", testAddr);
      const txn = await swapLab.swapERC20ForCelo(testAddr, {value: value});
      await txn?.wait(2).then(async(rec: ContractReceipt) => {
        if(rec) {
          result.data = await getData();
          if(cancelLoading) cancelLoading();
        }
      });
      break;

    case 'clearAllowance':
      const txn_ = await token.approve(swapLabAddr, ethers.utils.hexValue(ethers.utils.parseUnits('0')));
      await txn_?.wait(2).then(async(rec: ContractReceipt) => {
        if(rec) {
          result.balanceOrAllowance = await getAllowance(account);
          if(cancelLoading) cancelLoading();
        }
      });
      break;

    case 'addLiquidity':
      const txn_1 = await swapLab.addLiquidity({value: value});
      await txn_1?.wait(2).then(async(rec: ContractReceipt) => {
        if(rec) {
          result.data = await getData();
          if(cancelLoading) cancelLoading();
        }
      });
      break;

    case 'removeLiquidity':
      const txRs = await swapLab.removeLiquidity();
      await txRs?.wait(2).then(async(rec: ContractReceipt) => {
        if(rec) {
          result.data = await getData();
          if(cancelLoading) cancelLoading();
        }
      });
      break;

    case 'split':
      const txRs_1 = await swapLab.splitFee();
      await txRs_1?.wait(2).then(async(rec: ContractReceipt) => {
        if(rec) {
          result.data = await getData();
          if(cancelLoading) cancelLoading();
        }
      });
      break;

    case 'claim':
      const txn_2 = await token.selfClaimDrop();
      await txn_2?.wait(2).then(async(rec: ContractReceipt) => {
        if(rec) {
          result.balanceOrAllowance = await getBalance(account);
          if(cancelLoading) cancelLoading();
        }
      });
      break;

    case 'approve':
      const txn_3 = await token.approve(swapLabAddr, amount);
      await txn_3?.wait(2).then(async(rec: ContractReceipt) => {
        if(rec) {
          result.balanceOrAllowance = await getAllowance(account);
          if(cancelLoading) cancelLoading();
        }
      });
      break;

    case 'getBalance':
      result.balanceOrAllowance = await getBalance(account);
      break;

    case 'allowance':
      result.balanceOrAllowance = await getAllowance(account);
      break;

    default:
      result.data = await getData();
      break;

    }
      
  return result;
}

export default runContractFunc;