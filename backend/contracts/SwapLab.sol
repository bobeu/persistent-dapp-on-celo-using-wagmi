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
  error InsufficientLiquidyInContract(uint balThis, uint balToRec);
  error ContractAddressNotAllowed(address);

  uint public totalLiquidity;
  uint public totalFeeReceived;
  uint public totalProvider;
  uint public swapfee;

  struct SupportedAsset {
    bool isSupported;
    uint rate;
  }

  struct Provider {
    uint amount;
    uint timeProvided;
    uint position;
    bool isExist;
  }

  address[] public providersAddress;

  mapping(address => SupportedAsset) public supportedAssets;
  mapping(address => Provider) public liqProviders;

  modifier onlyEOA() {
    if(Address.isContract(msg.sender)) revert ContractAddressNotAllowed(msg.sender);
    _;
  }

  modifier isProvider() {
    require(liqProviders[msg.sender].amount > 0, "Not a provider");
    _;
  }

  constructor(address _supportedAsset) {
    address[] memory sAsset = new address[](1);
    uint[] memory rates = new uint[](1);
    sAsset[0] = _supportedAsset;
    rates[0] = 50 * (10 ** 18);
    swapfee = 1e17 wei;
    providersAddress.push(msg.sender);

    _setNewAsset(
      sAsset, 
      rates
    );
  }

  function _setNewAsset(
    address[] memory _supportedAssets, 
    uint[] memory rates
  ) private {
    require(
      _supportedAssets.length == rates.length, 
      "Length mismatch");
    for (uint i = 0; i < _supportedAssets.length; i++) {
      supportedAssets[_supportedAssets[i]] = SupportedAsset(
        true,
        rates[i]
      );
    }
  }

  function setNewAsset(    
    address[] memory _supportedAssets, 
    uint[] memory rates
  ) public onlyOwner {
    _setNewAsset(_supportedAssets, rates);
  }

  function swapERC20ForCelo(address asset) payable public onlyEOA nonReentrant {
    SupportedAsset memory sat = supportedAssets[asset];
    if(!sat.isSupported) revert UnSupportedAsset(asset);
    uint mantissa = 10 ** 18;
    uint amountToSwap = IERC20(asset).allowance(msg.sender, address(this));
    require(amountToSwap > mantissa && amountToSwap.div(mantissa).mod(100) == 0, "Invalid token request");
    uint fee = swapfee;
    require(msg.value >= fee, "Insufficient value to pay swap fee");
    uint valInCelo = amountToSwap.div(mantissa).mul(1e9 wei);
    if(valInCelo > totalLiquidity) revert InsufficientLiquidyInContract(totalLiquidity, valInCelo);
    totalFeeReceived = totalFeeReceived.add(fee);
    totalLiquidity = totalLiquidity.sub(valInCelo);
    require(IERC20(asset).transferFrom(msg.sender, owner(), amountToSwap), "Failed");
    Address.sendValue(payable(msg.sender), valInCelo);
  }

  /**@dev
   * We try to be fair with those that have previous liquidity in the pool
   * by backdating the time liquidity was provided.
   */
  function addLiquidity() public payable onlyEOA {
    require(msg.value > 0,"Insufficient value");
    Provider memory prov = liqProviders[msg.sender];
    uint position = prov.position;
    if(prov.isExist == false) {
      position = providersAddress.length;
      totalProvider ++;
      providersAddress.push(msg.sender);
    } else {
      if(providersAddress[position] == address(0)) {
        providersAddress[position] = msg.sender;
      }
    }
    liqProviders[msg.sender] = Provider(
      prov.amount.add(msg.value),
      prov.timeProvided > 0 ? _now().sub(prov.timeProvided).div(2).add(prov.timeProvided) : _now(),
      position,
      true
    );

    totalLiquidity = totalLiquidity.add(msg.value);
  }

  /**@dev 
   * If provider has no liquidity balance left in the pool, their
   * provided time is reset.
   */
  function removeLiquidity() public onlyEOA isProvider nonReentrant {
    Provider memory prov = liqProviders[msg.sender];
    liqProviders[msg.sender] = Provider(
      0, 
      0,
      prov.position,
      prov.isExist
    );
    totalProvider --;
    totalLiquidity = totalLiquidity.sub(prov.amount); 
    uint amtToRec = prov.amount;
    providersAddress[prov.position] = address(0);
    if(address(this).balance < prov.amount) amtToRec = address(this).balance;
    Address.sendValue(payable(msg.sender), amtToRec);
  }

  function _now() internal view returns(uint) {
    return block.timestamp;
  }

  /**@dev 
   * Anyone can call this function to split fee among the providers.
   */
  function splitFee() public onlyEOA isProvider nonReentrant {
    uint availableFee = totalFeeReceived;
    require(availableFee > 0, "Fee cannot be split at this time");
    totalFeeReceived = 0;
    uint providers = providersAddress.length;
    uint each = availableFee.div(providers);
    for(uint i = 0; i < providers; i++) {
      address to = providersAddress[i];
      if(to != address(0)) {
        Address.sendValue(payable(to), each);
      }
    }
  }

  function getData() public view returns(
    uint _totalLiquidity,
    uint _swapfee,
    uint _totalFeeReceived,
    uint _totalProvider,
    Provider memory _provider
  ) {
    _totalLiquidity = totalLiquidity;
    _swapfee = swapfee;
    _totalFeeReceived = totalFeeReceived;
    _totalProvider = totalProvider;
    _provider = liqProviders[msg.sender];

    return(
      _totalLiquidity,
      _swapfee,
      _totalFeeReceived,
      _totalProvider,
      _provider
    );
  }


}