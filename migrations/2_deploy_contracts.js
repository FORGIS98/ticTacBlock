const TickTack = artifacts.require("tickTackBlock");

module.exports = function(deployer) {
  deployer.deploy(TickTack)
}
