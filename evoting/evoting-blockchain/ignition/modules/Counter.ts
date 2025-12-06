import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("BinusUKMVotingModule", (m) => {
  const voting = m.contract("BinusUKMVoting");


  return { voting };
});
