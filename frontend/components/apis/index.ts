import getContractData from "./contractdata";
import { InstanceProps, OptionProps, TransactionReceipt, transactionReceipt } from "../../interfaces";
import { ethers, Contract, ContractReceipt} from "ethers";

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

async function sendTransaction(options: OptionProps) {
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

  let result :TransactionReceipt = {
    trx: null,
    read: null
  };
  
  switch (functionName) {
    case 'swap':
      const txn = await swapLab.swapERC20ForCelo(testAddr);
      await txn?.wait(2).then((rec: ContractReceipt) => {
        result.trx = rec;
        if(cancelLoading) cancelLoading();
      });
      break;

    case 'clearAllowance':
      const txn_ = await token.decreaseAllowance(swapLabAddr, amount);
      await txn_?.wait(2).then((rec: ContractReceipt) => {
        result.trx = rec;
        if(cancelLoading) cancelLoading();
      });
      break;

    case 'deposit':
      const txn_1 = await swapLab.deposit({value: value});
      await txn_1?.wait(2).then((rec: ContractReceipt) => {
        result.trx = rec;
        if(cancelLoading) cancelLoading();
      });
      break;

    case 'claim':
      const txn_2 = await token.selfClaimDrop();
      await txn_2?.wait(2).then((rec: ContractReceipt) => {
        result.trx = rec;
        if(cancelLoading) cancelLoading();
      });
      break;

    case 'approve':
      const txn_3 = await token.approve(swapLabAddr, amount);
      await txn_3?.wait(2).then((rec: ContractReceipt) => {
        result.trx = rec;
        if(cancelLoading) cancelLoading();
      });
      break;

    default:
      const res = await token_noSigner.balanceOf(account);
      if(cancelLoading) cancelLoading();
      result.read = res;
      break;
    }
      
  return result;
}

export default sendTransaction;