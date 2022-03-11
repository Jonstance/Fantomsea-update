// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";



pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


contract NFT is ERC721URIStorage{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address contractAddress;
    address adminAddress;

    constructor(address marketplaceAddress, address administratorAddress) ERC721("Fantomsea Tokens", "FSEA"){
        contractAddress = marketplaceAddress;
        adminAddress = administratorAddress;
    }
    function createToken(string memory tokenURI) public returns (uint){
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        setApprovalForAll(contractAddress, true);
        return newItemId;
    }
    
    function changeMarketAddress(address payable newMarketAddress) public payable {
        require(msg.sender == adminAddress, "UnAuthorized to take this action");
        contractAddress =  newMarketAddress;
    }
    
    function changeAdminAddress(address payable newAdminAddress) public payable{
     require(msg.sender == adminAddress, "UnAuthorized to take this action");
    adminAddress = newAdminAddress;
    }
}