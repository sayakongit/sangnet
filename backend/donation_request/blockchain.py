from web3 import Web3
import json
from django.conf import settings
import os

ABI_PATH = os.path.join(settings.BASE_DIR, 'blockchain', 'blood_donation.json')

with open(ABI_PATH, 'r') as abi_file:
    contract_abi = json.load(abi_file)

# Connect to the local Ganache instance
ganache_url = 'http://127.0.0.1:7545'  # Default Ganache URL
w3 = Web3(Web3.HTTPProvider(ganache_url))

# Smart contract address and ABI
contract_address = "0xe6C617EDf96b3CDb4D147269cBFdd195925c039A"
# contract_abi = [...]  # Load your smart contract ABI

# Create a contract instance
# contract = w3.eth.contract(abi=contract_abi, bytecode=contract_bytecode)
CONTRACT = w3.eth.contract(abi=contract_abi, address=contract_address)

# Call a function on the contract
# uint256 donorId, string memory donorName, string memory bloodGroup, uint256 donationDate, string memory location
# def print_func():
#     CONTRACT.functions.recordDonation(2,"rohan","a+", 463, "bihar",True,6).transact({'from': "0xac4a4714606C7815d57FdB9b173497eDCD80757d"})
#     result = CONTRACT.functions.getDonations().call()
#     print(result)

# print_func()

# def find_donation():
#     result = contract.functions.getDonationsForDonor(1).call()
#     print(result)

# find_donation()

# def send_post_to_contract(content):
#     nonce = w3.eth.getTransactionCount("0xae44bbe64B94001A9FA7A5215f55E9121fD5Dbec")
#     tx = contract.functions.createPost(content).buildTransaction ({
#     'chainId': 3,
#     'gas': 3000000,
#     'gasPrice': w3.toWei ('40', 'gwei'),
#     'nonce': nonce,
#     })
#     signed_tx = w3.eth.account.signTransaction (tx, "0xa751ba0222bc037a58abaa0436399964d8cde0d3238ca4556c4cefba070b85da")
#     tx_hash = w3.eth.sendRawTransaction (signed_tx.rawTransaction)
#     tx_receipt = w3.eth.waitforTransactionReceipt(tx_hash)
#     count = 0
#     while tx_receipt is None and (count < 30):
#         # time.sleep(10)
#         tx_receipt = w3.eth.getTransactionReceipt (result)
#         print (tx_receipt)