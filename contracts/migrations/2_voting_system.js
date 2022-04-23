const votingFactory = artifacts.require("votingFactory");

module.exports = function (deployer) {
  deployer.deploy(votingFactory);
};

