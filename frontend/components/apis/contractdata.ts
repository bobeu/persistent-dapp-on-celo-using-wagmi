import swapLab from "../../../backend/deployments/alfajores/SwapLab.json";
import testToken from "../../../backend/deployments/alfajores/TestToken.json";

export default function getContractData() {
  return {
    swapAbi: swapLab.abi,
    swapLabAddr: swapLab.address,
    testTokenAbi: testToken.abi,
    testAddr: testToken.address,
  }
}