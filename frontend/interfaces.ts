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
  value?: string | import('ethers').BigNumber;
  functionName: string;
  cancelLoading?: () => void;
  providerOrSigner?: any,
  account?: string;
  amount?: string | BigNumber;
}

export interface Result {
  balanceOrAllowance: BigNumber;
  data: Data;
}

export interface CardProps {
  step: string;
  label?: string;
  name?: string;
  heading?: string;
  description?: string;
  displayChild?: boolean;
  textFieldType?: string;
  button_1_start?: string;
  button_2_start?: string;
  button_3_start?: string;
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

export interface Provider {
  amount: BigNumber;
  timeProvided: BigNumber;
  position: BigNumber;
  isExist: boolean;
}

export interface Data {
  _totalLiquidity: BigNumber;
  _swapfee: BigNumber;
  _totalFeeReceived: BigNumber;
  _totalProvider: BigNumber;
  _provider: Provider;
}

export const data = {
  _totalLiquidity: BigNumber(0),
  _swapfee: BigNumber(0),
  _totalFeeReceived: BigNumber(0),
  _totalProvider: BigNumber(0),
  _provider: {
    amount: BigNumber(0),
    timeProvided: BigNumber(0),
    position: BigNumber(0),
    isExist: false
  },
}