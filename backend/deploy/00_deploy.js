module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer, feeTo } = await getNamedAccounts();

  const token = await deploy("TestToken", {
    from: deployer,
    args: [],
    log: true,
  });

  await deploy("SwapLab", {
    from: deployer,
    args: [ token?.address ],
    log: true,
  });
};

module.exports.tags = ["DRythm"];
