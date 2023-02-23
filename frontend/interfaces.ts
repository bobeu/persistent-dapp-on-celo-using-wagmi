import React, { ReactNode } from 'react';
import BigNumber from "bignumber.js";
import { ContractReceipt, ethers } from 'ethers';

export const contractData = {
  dateUploaded: BigNumber(0),
  downloadCount: BigNumber(0),
  uploader: '',
  fileHash: ''
}

export interface InstanceProps {
  swapAbi: any;
  tokenAbi: any;
  swapAddr: string; 
  tokenAddr: string; 
  providerOrSigner: any
}

export interface OptionProps {
  value?: string;
  functionName: string;
  cancelLoading?: () => void;
  providerOrSigner?: any,
  account?: string;
  amount?: string | BigNumber;
}
                  
export const transactionReceipt : ContractReceipt = {
  blockHash: '',
  blockNumber: 0,
  byzantium: false,
  confirmations: 0,
  contractAddress: '',
  cumulativeGasUsed: ethers.BigNumber.from(0),
  effectiveGasPrice: ethers.BigNumber.from(0),
  from: '',
  gasUsed: ethers.BigNumber.from(0),
  logs: [],
  logsBloom: '',
  to: '',
  transactionHash: '',
  transactionIndex: 0,
  type: 0,
  events: [],
  root: '',
  status: 0
}

export interface TransactionReceipt {
  read: BigNumber | null;
  trx: ContractReceipt | null;
};

export interface CardProps {
  step: string;
  label?: string;
  name?: string;
  heading?: string;
  description?: string;
  displayChild?: boolean;
  textFieldType?: string;
  button_1_name?: string;
  button_2_name?: string;
  button_3_name?: string;
  displayTextfield?: boolean;
  isButton_1_display?: boolean;
  isButton_2_display?: boolean;
  isButton_3_display?: boolean;
  handleButton_1_Click?: () => void;
  handleButton_2_Click?: () => void;
  handleButton_3_Click?: () => void;
  handleTextfieldChange?: (e:React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  children?: ReactNode
}

export interface SpinnerProps {
  color: string;
  rest?: React.CSSProperties
}