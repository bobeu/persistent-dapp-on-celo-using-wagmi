// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**@title Swap ERC20 for $CELO
 * Anyone can be become a Celo or cUSD provider
 */
contract SwapLab is Ownable, ReentrancyGuard {
  using SafeMath for uint256;
  using Address for address;

  error UnSupportedAsset(address);
  error AssetIsSupported(address);
  error InsufficientFund(uint balThis, uint balToRec);
  error ContractAddressNotAllowed(address);

  struct SupportedAsset {
    bool isSupported;
    uint rate;
    uint minimumSwapValue;
    uint swapFee;
  }

  mapping(address => SupportedAsset) supportedAssets;

  constructor(address _supportedAsset) {
    uint minSwapValue = 1 * (10 ** 18);
    address[] memory sAsset = new address[](1);
    uint[] memory rates = new uint[](1);
    uint[] memory minSwapValues = new uint[](1);
    uint[] memory swapFees = new uint[](1);
    sAsset[0] = _supportedAsset;
    rates[0] = 1e18 wei;
    minSwapValues[0] = minSwapValue;
    swapFees[0] = 1e16 wei;

    _setNewAsset(
      sAsset, 
      rates,
      minSwapValues, 
      swapFees
    );
  }

  function _setNewAsset(
    address[] memory _supportedAssets, 
    uint[] memory rates,
    uint[] memory minimSwapValues,
    uint[] memory swapFees
  ) private {
    // if(supportedAssets[newAsset].isSupported) revert AssetIsSupported(newAsset);
    require(
      _supportedAssets.length == rates.length && rates.length == minimSwapValues.length && minimSwapValues.length == swapFees.length, 
      "Length mismatch");
        for (uint i = 0; i < _supportedAssets.length; i++) {
      supportedAssets[_supportedAssets[i]] = SupportedAsset(
        true,
        rates[i],
        minimSwapValues[i],
        swapFees[i]
      );
    }
  }

  function setNewAsset(    
    address[] memory _supportedAssets, 
    uint[] memory rates,
    uint[] memory minimSwapValues,
    uint[] memory swapFees 
  ) public onlyOwner {
    _setNewAsset(_supportedAssets, rates, minimSwapValues, swapFees);
  }

  function swapERC20ForCelo(address asset) payable public nonReentrant {
    SupportedAsset memory sat = supportedAssets[asset];
    if(!sat.isSupported) revert UnSupportedAsset(asset);
    uint mantissa = 10 ** IERC20Metadata(asset).decimals();
    if(Address.isContract(msg.sender)) revert ContractAddressNotAllowed(msg.sender);
    uint amountToSwap = IERC20(asset).allowance(msg.sender, address(this));
    require(amountToSwap >= sat.minimumSwapValue, "Insufficient allowance");
    uint amountCeloToReceive = amountToSwap.mul(sat.rate).div(mantissa).sub(sat.swapFee);
    uint bal = address(this).balance;
    if(amountCeloToReceive > bal) revert InsufficientFund(bal, amountCeloToReceive);
    require(IERC20(asset).transferFrom(msg.sender, owner(), amountToSwap), "Failed");
    (bool sent, ) = address(msg.sender).call{value: amountCeloToReceive}('');
    require(sent, 'Anomally detected');
  }

  function deposit() payable public {
    require(msg.value > 0,"Thank you");
  }

  function withdraw(address to, uint amount) public onlyOwner {
    require(to != address(0), 'Zero recipient');
    (bool done,) = to.call{value: amount}('');
    require(done, 'Failed');
  }

}