const { Web3 } = require('web3');
require('dotenv').config();

// ============================================
// KONFIGURASI
// ============================================

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = process.env.RPC_URL;
const INITIAL_OWNER = process.env.WALLET_ADDRESS;

// Paste ABI dan Bytecode dari Remix di sini
const USDC_ABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "initialOwner",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "allowance",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "needed",
                "type": "uint256"
            }
        ],
        "name": "ERC20InsufficientAllowance",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "balance",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "needed",
                "type": "uint256"
            }
        ],
        "name": "ERC20InsufficientBalance",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "approver",
                "type": "address"
            }
        ],
        "name": "ERC20InvalidApprover",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "receiver",
                "type": "address"
            }
        ],
        "name": "ERC20InvalidReceiver",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            }
        ],
        "name": "ERC20InvalidSender",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            }
        ],
        "name": "ERC20InvalidSpender",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "OwnableInvalidOwner",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "OwnableUnauthorizedAccount",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "burn",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "burnFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "mint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

const USDC_BYTECODE = '608060405234801561000f575f5ffd5b5060405161182b38038061182b83398181016040528101906100319190610267565b806040518060400160405280600a81526020017f55534420436972636c65000000000000000000000000000000000000000000008152506040518060400160405280600481526020017f555344430000000000000000000000000000000000000000000000000000000081525081600390816100ad91906104cf565b5080600490816100bd91906104cf565b5050505f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603610130575f6040517f1e4fbdf700000000000000000000000000000000000000000000000000000000815260040161012791906105ad565b60405180910390fd5b61013f8161014660201b60201c565b50506105c6565b5f60055f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690508160055f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b5f5ffd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f6102368261020d565b9050919050565b6102468161022c565b8114610250575f5ffd5b50565b5f815190506102618161023d565b92915050565b5f6020828403121561027c5761027b610209565b5b5f61028984828501610253565b91505092915050565b5f81519050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f600282049050600182168061030d57607f821691505b6020821081036103205761031f6102c9565b5b50919050565b5f819050815f5260205f209050919050565b5f6020601f8301049050919050565b5f82821b905092915050565b5f600883026103827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82610347565b61038c8683610347565b95508019841693508086168417925050509392505050565b5f819050919050565b5f819050919050565b5f6103d06103cb6103c6846103a4565b6103ad565b6103a4565b9050919050565b5f819050919050565b6103e9836103b6565b6103fd6103f5826103d7565b848454610353565b825550505050565b5f5f905090565b610414610405565b61041f8184846103e0565b505050565b5b81811015610442576104375f8261040c565b600181019050610425565b5050565b601f8211156104875761045881610326565b61046184610338565b81016020851015610470578190505b61048461047c85610338565b830182610424565b50505b505050565b5f82821c905092915050565b5f6104a75f198460080261048c565b1980831691505092915050565b5f6104bf8383610498565b9150826002028217905092915050565b6104d882610292565b67ffffffffffffffff8111156104f1576104f061029c565b5b6104fb82546102f6565b610506828285610446565b5f60209050601f831160018114610537575f8415610525578287015190505b61052f85826104b4565b865550610596565b601f19841661054586610326565b5f5b8281101561056c57848901518255600182019150602085019450602081019050610547565b868310156105895784890151610585601f891682610498565b8355505b6001600288020188555050505b505050505050565b6105a78161022c565b82525050565b5f6020820190506105c05f83018461059e565b92915050565b611258806105d35f395ff3fe608060405234801561000f575f5ffd5b50600436106100f3575f3560e01c806370a082311161009557806395d89b411161006457806395d89b411461025d578063a9059cbb1461027b578063dd62ed3e146102ab578063f2fde38b146102db576100f3565b806370a08231146101e9578063715018a61461021957806379cc6790146102235780638da5cb5b1461023f576100f3565b806323b872dd116100d157806323b872dd14610163578063313ce5671461019357806340c10f19146101b157806342966c68146101cd576100f3565b806306fdde03146100f7578063095ea7b31461011557806318160ddd14610145575b5f5ffd5b6100ff6102f7565b60405161010c9190610ea6565b60405180910390f35b61012f600480360381019061012a9190610f57565b610387565b60405161013c9190610faf565b60405180910390f35b61014d6103a9565b60405161015a9190610fd7565b60405180910390f35b61017d60048036038101906101789190610ff0565b6103b2565b60405161018a9190610faf565b60405180910390f35b61019b6103e0565b6040516101a8919061105b565b60405180910390f35b6101cb60048036038101906101c69190610f57565b6103e8565b005b6101e760048036038101906101e29190611074565b6103fe565b005b61020360048036038101906101fe919061109f565b610412565b6040516102109190610fd7565b60405180910390f35b610221610457565b005b61023d60048036038101906102389190610f57565b61046a565b005b61024761048a565b60405161025491906110d9565b60405180910390f35b6102656104b2565b6040516102729190610ea6565b60405180910390f35b61029560048036038101906102909190610f57565b610542565b6040516102a29190610faf565b60405180910390f35b6102c560048036038101906102c091906110f2565b610564565b6040516102d29190610fd7565b60405180910390f35b6102f560048036038101906102f0919061109f565b6105e6565b005b6060600380546103069061115d565b80601f01602080910402602001604051908101604052809291908181526020018280546103329061115d565b801561037d5780601f106103545761010080835404028352916020019161037d565b820191905f5260205f20905b81548152906001019060200180831161036057829003601f168201915b5050505050905090565b5f5f61039161066a565b905061039e818585610671565b600191505092915050565b5f600254905090565b5f5f6103bc61066a565b90506103c9858285610683565b6103d4858585610716565b60019150509392505050565b5f6006905090565b6103f0610806565b6103fa828261088d565b5050565b61040f61040961066a565b8261090c565b50565b5f5f5f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20549050919050565b61045f610806565b6104685f61098b565b565b61047c8261047661066a565b83610683565b610486828261090c565b5050565b5f60055f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b6060600480546104c19061115d565b80601f01602080910402602001604051908101604052809291908181526020018280546104ed9061115d565b80156105385780601f1061050f57610100808354040283529160200191610538565b820191905f5260205f20905b81548152906001019060200180831161051b57829003601f168201915b5050505050905090565b5f5f61054c61066a565b9050610559818585610716565b600191505092915050565b5f60015f8473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2054905092915050565b6105ee610806565b5f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff160361065e575f6040517f1e4fbdf700000000000000000000000000000000000000000000000000000000815260040161065591906110d9565b60405180910390fd5b6106678161098b565b50565b5f33905090565b61067e8383836001610a4e565b505050565b5f61068e8484610564565b90507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8110156107105781811015610701578281836040517ffb8f41b20000000000000000000000000000000000000000000000000000000081526004016106f89392919061118d565b60405180910390fd5b61070f84848484035f610a4e565b5b50505050565b5f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610786575f6040517f96c6fd1e00000000000000000000000000000000000000000000000000000000815260040161077d91906110d9565b60405180910390fd5b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036107f6575f6040517fec442f050000000000000000000000000000000000000000000000000000000081526004016107ed91906110d9565b60405180910390fd5b610801838383610c1d565b505050565b61080e61066a565b73ffffffffffffffffffffffffffffffffffffffff1661082c61048a565b73ffffffffffffffffffffffffffffffffffffffff161461088b5761084f61066a565b6040517f118cdaa700000000000000000000000000000000000000000000000000000000815260040161088291906110d9565b60405180910390fd5b565b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036108fd575f6040517fec442f050000000000000000000000000000000000000000000000000000000081526004016108f491906110d9565b60405180910390fd5b6109085f8383610c1d565b5050565b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff160361097c575f6040517f96c6fd1e00000000000000000000000000000000000000000000000000000000815260040161097391906110d9565b60405180910390fd5b610987825f83610c1d565b5050565b5f60055f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690508160055f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b5f73ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff1603610abe575f6040517fe602df05000000000000000000000000000000000000000000000000000000008152600401610ab591906110d9565b60405180910390fd5b5f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610b2e575f6040517f94280d62000000000000000000000000000000000000000000000000000000008152600401610b2591906110d9565b60405180910390fd5b8160015f8673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f8573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20819055508015610c17578273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92584604051610c0e9190610fd7565b60405180910390a35b50505050565b5f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610c6d578060025f828254610c6191906111ef565b92505081905550610d3b565b5f5f5f8573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2054905081811015610cf6578381836040517fe450d38c000000000000000000000000000000000000000000000000000000008152600401610ced9392919061118d565b60405180910390fd5b8181035f5f8673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2081905550505b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610d82578060025f8282540392505081905550610dcc565b805f5f8473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f82825401925050819055505b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051610e299190610fd7565b60405180910390a3505050565b5f81519050919050565b5f82825260208201905092915050565b8281835e5f83830152505050565b5f601f19601f8301169050919050565b5f610e7882610e36565b610e828185610e40565b9350610e92818560208601610e50565b610e9b81610e5e565b840191505092915050565b5f6020820190508181035f830152610ebe8184610e6e565b905092915050565b5f5ffd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f610ef382610eca565b9050919050565b610f0381610ee9565b8114610f0d575f5ffd5b50565b5f81359050610f1e81610efa565b92915050565b5f819050919050565b610f3681610f24565b8114610f40575f5ffd5b50565b5f81359050610f5181610f2d565b92915050565b5f5f60408385031215610f6d57610f6c610ec6565b5b5f610f7a85828601610f10565b9250506020610f8b85828601610f43565b9150509250929050565b5f8115159050919050565b610fa981610f95565b82525050565b5f602082019050610fc25f830184610fa0565b92915050565b610fd181610f24565b82525050565b5f602082019050610fea5f830184610fc8565b92915050565b5f5f5f6060848603121561100757611006610ec6565b5b5f61101486828701610f10565b935050602061102586828701610f10565b925050604061103686828701610f43565b9150509250925092565b5f60ff82169050919050565b61105581611040565b82525050565b5f60208201905061106e5f83018461104c565b92915050565b5f6020828403121561108957611088610ec6565b5b5f61109684828501610f43565b91505092915050565b5f602082840312156110b4576110b3610ec6565b5b5f6110c184828501610f10565b91505092915050565b6110d381610ee9565b82525050565b5f6020820190506110ec5f8301846110ca565b92915050565b5f5f6040838503121561110857611107610ec6565b5b5f61111585828601610f10565b925050602061112685828601610f10565b9150509250929050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f600282049050600182168061117457607f821691505b60208210810361118757611186611130565b5b50919050565b5f6060820190506111a05f8301866110ca565b6111ad6020830185610fc8565b6111ba6040830184610fc8565b949350505050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f6111f982610f24565b915061120483610f24565b925082820190508082111561121c5761121b6111c2565b5b9291505056fea2646970667358221220e391c6bd14d6df880953f08597807a3f0099163f05e5baf41ba6f4b60b0c1ff664736f6c634300081f0033'; // Paste bytecode USDC dari Remix

const RIDESHARING_ABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_usdcAddress",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "OwnableInvalidOwner",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "OwnableUnauthorizedAccount",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "token",
                "type": "address"
            }
        ],
        "name": "SafeERC20FailedOperation",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "driverAddress",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "name",
                "type": "string"
            }
        ],
        "name": "DriverRegistered",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "rideId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "driver",
                "type": "address"
            }
        ],
        "name": "RideAccepted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "rideId",
                "type": "uint256"
            }
        ],
        "name": "RideCancelled",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "rideId",
                "type": "uint256"
            }
        ],
        "name": "RideCompletedByDriver",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "rideId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "driver",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "fare",
                "type": "uint256"
            }
        ],
        "name": "RideFinalized",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "rideId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "RideFunded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "rideId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "rider",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "fare",
                "type": "uint256"
            }
        ],
        "name": "RideRequested",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "rideId",
                "type": "uint256"
            }
        ],
        "name": "RideStarted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "newUSDCAddress",
                "type": "address"
            }
        ],
        "name": "USDCAddressUpdated",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_rideId",
                "type": "uint256"
            }
        ],
        "name": "acceptRide",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_rideId",
                "type": "uint256"
            }
        ],
        "name": "cancelRide",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_user",
                "type": "address"
            }
        ],
        "name": "checkAllowance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_user",
                "type": "address"
            }
        ],
        "name": "checkUserBalance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_rideId",
                "type": "uint256"
            }
        ],
        "name": "completeRide",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_rideId",
                "type": "uint256"
            }
        ],
        "name": "confirmArrival",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "driverList",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "drivers",
        "outputs": [
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "plateNumber",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "vehicleType",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "ratePerKm",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "isRegistered",
                "type": "bool"
            },
            {
                "internalType": "bool",
                "name": "isAvailable",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_rideId",
                "type": "uint256"
            }
        ],
        "name": "fundRide",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getAvailableRides",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "rideId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "rider",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "driver",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "pickupLocation",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "destination",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "distance",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "fare",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "notes",
                        "type": "string"
                    },
                    {
                        "internalType": "enum RideSharing.RideStatus",
                        "name": "status",
                        "type": "uint8"
                    },
                    {
                        "internalType": "uint256",
                        "name": "createdAt",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct RideSharing.Ride[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getContractBalance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_driverAddress",
                "type": "address"
            }
        ],
        "name": "getDriver",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "plateNumber",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "vehicleType",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "ratePerKm",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "isRegistered",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "isAvailable",
                        "type": "bool"
                    }
                ],
                "internalType": "struct RideSharing.Driver",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getDriverCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_driverAddress",
                "type": "address"
            }
        ],
        "name": "getDriverRides",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "rideId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "rider",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "driver",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "pickupLocation",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "destination",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "distance",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "fare",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "notes",
                        "type": "string"
                    },
                    {
                        "internalType": "enum RideSharing.RideStatus",
                        "name": "status",
                        "type": "uint8"
                    },
                    {
                        "internalType": "uint256",
                        "name": "createdAt",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct RideSharing.Ride[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_rideId",
                "type": "uint256"
            }
        ],
        "name": "getRide",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "rideId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "rider",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "driver",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "pickupLocation",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "destination",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "distance",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "fare",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "notes",
                        "type": "string"
                    },
                    {
                        "internalType": "enum RideSharing.RideStatus",
                        "name": "status",
                        "type": "uint8"
                    },
                    {
                        "internalType": "uint256",
                        "name": "createdAt",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct RideSharing.Ride",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getRiderRides",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "rideId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "rider",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "driver",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "pickupLocation",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "destination",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "distance",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "fare",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "notes",
                        "type": "string"
                    },
                    {
                        "internalType": "enum RideSharing.RideStatus",
                        "name": "status",
                        "type": "uint8"
                    },
                    {
                        "internalType": "uint256",
                        "name": "createdAt",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct RideSharing.Ride[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getTotalRides",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_plateNumber",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_vehicleType",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "_ratePerKm",
                "type": "uint256"
            }
        ],
        "name": "registerDriver",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_pickupLocation",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_destination",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "_distance",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_notes",
                "type": "string"
            }
        ],
        "name": "requestRide",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "rideCounter",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "rides",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "rideId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "rider",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "driver",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "pickupLocation",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "destination",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "distance",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "fare",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "notes",
                "type": "string"
            },
            {
                "internalType": "enum RideSharing.RideStatus",
                "name": "status",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "createdAt",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_newUSDCAddress",
                "type": "address"
            }
        ],
        "name": "setUSDCAddress",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_rideId",
                "type": "uint256"
            }
        ],
        "name": "startRide",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "usdcToken",
        "outputs": [
            {
                "internalType": "contract IERC20",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

const RIDESHARING_BYTECODE = '608060405234801561000f575f5ffd5b50604051615c81380380615c8183398181016040528101906100319190610295565b3360015f819055505f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036100a9575f6040517f1e4fbdf70000000000000000000000000000000000000000000000000000000081526004016100a091906102cf565b60405180910390fd5b6100b88161017460201b60201c565b505f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603610127576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161011e90610342565b60405180910390fd5b8060025f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505f60058190555050610360565b5f60015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690508160015f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b5f5ffd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f6102648261023b565b9050919050565b6102748161025a565b811461027e575f5ffd5b50565b5f8151905061028f8161026b565b92915050565b5f602082840312156102aa576102a9610237565b5b5f6102b784828501610281565b91505092915050565b6102c98161025a565b82525050565b5f6020820190506102e25f8301846102c0565b92915050565b5f82825260208201905092915050565b7f496e76616c6964205553444320616464726573730000000000000000000000005f82015250565b5f61032c6014836102e8565b9150610337826102f8565b602082019050919050565b5f6020820190508181035f83015261035981610320565b9050919050565b6159148061036d5f395ff3fe608060405234801561000f575f5ffd5b50600436106101a7575f3560e01c80639348bf64116100f7578063c416dd0b11610095578063e97098001161006f578063e9709800146104d9578063e9c14b1e14610509578063f0010c0914610525578063f2fde38b14610543576101a7565b8063c416dd0b14610471578063c51562cb1461048d578063d10bb9b5146104a9576101a7565b8063a9cbcb23116100d1578063a9cbcb23146103fd578063aaf5bfc31461041b578063ae7784d714610437578063b10fefc014610453576101a7565b80639348bf641461039357806398a3f6c6146103b1578063a6f07b29146103e1576101a7565b80635205f112116101645780636f9fb98a1161013e5780636f9fb98a1461031d578063715018a61461033b5780637c7b0ff4146103455780638da5cb5b14610375576101a7565b80635205f112146102985780635f210a1a146102d157806365c301ab146102ed576101a7565b80630a9bfef5146101ab57806311eac855146101db5780631881c5fc146101f95780631a197a26146102155780632be17d26146102455780634aa6018614610263575b5f5ffd5b6101c560048036038101906101c09190613f49565b61055f565b6040516101d29190613f8c565b60405180910390f35b6101e3610600565b6040516101f09190614000565b60405180910390f35b610213600480360381019061020e919061417f565b610625565b005b61022f600480360381019061022a9190613f49565b6108e7565b60405161023c9190613f8c565b60405180910390f35b61024d61098a565b60405161025a9190613f8c565b60405180910390f35b61027d60048036038101906102789190613f49565b610996565b60405161028f969594939291906142b1565b60405180910390f35b6102b260048036038101906102ad9190614325565b610b79565b6040516102c89a999897969594939291906143d2565b60405180910390f35b6102eb60048036038101906102e69190614325565b610da5565b005b61030760048036038101906103029190613f49565b6111e5565b604051610314919061457b565b60405180910390f35b6103256114b6565b6040516103329190613f8c565b60405180910390f35b610343611555565b005b61035f600480360381019061035a9190614325565b611568565b60405161036c919061469e565b60405180910390f35b61037d611895565b60405161038a91906146be565b60405180910390f35b61039b6118bd565b6040516103a89190614877565b60405180910390f35b6103cb60048036038101906103c69190614325565b611d69565b6040516103d891906146be565b60405180910390f35b6103fb60048036038101906103f69190614325565b611da4565b005b6104056121d6565b6040516104129190614877565b60405180910390f35b61043560048036038101906104309190613f49565b61264c565b005b610451600480360381019061044c9190614325565b612748565b005b61045b612a0f565b6040516104689190613f8c565b60405180910390f35b61048b60048036038101906104869190614325565b612a15565b005b6104a760048036038101906104a29190614325565b612c60565b005b6104c360048036038101906104be9190613f49565b612fb4565b6040516104d09190614877565b60405180910390f35b6104f360048036038101906104ee9190614897565b613504565b6040516105009190613f8c565b60405180910390f35b610523600480360381019061051e9190614325565b613802565b005b61052d613a4d565b60405161053a9190613f8c565b60405180910390f35b61055d60048036038101906105589190613f49565b613a56565b005b5f60025f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166370a08231836040518263ffffffff1660e01b81526004016105ba91906146be565b602060405180830381865afa1580156105d5573d5f5f3e3d5ffd5b505050506040513d601f19601f820116820180604052508101906105f99190614963565b9050919050565b60025f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60035f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f206004015f9054906101000a900460ff16156106b2576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016106a9906149d8565b60405180910390fd5b5f81116106f4576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016106eb90614a40565b60405180910390fd5b5f845111610737576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161072e90614aa8565b60405180910390fd5b6040518060c001604052808581526020018481526020018381526020018281526020016001151581526020016001151581525060035f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f820151815f0190816107ba9190614cba565b5060208201518160010190816107d09190614cba565b5060408201518160020190816107e69190614cba565b50606082015181600301556080820151816004015f6101000a81548160ff02191690831515021790555060a08201518160040160016101000a81548160ff021916908315150217905550905050600633908060018154018082558091505060019003905f5260205f20015f9091909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055503373ffffffffffffffffffffffffffffffffffffffff167f9b956fafd6b420070aaa3307dcf792c7a34a3118d4271ee745e1472b281a2f1f856040516108d99190614d89565b60405180910390a250505050565b5f60025f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663dd62ed3e83306040518363ffffffff1660e01b8152600401610944929190614da9565b602060405180830381865afa15801561095f573d5f5f3e3d5ffd5b505050506040513d601f19601f820116820180604052508101906109839190614963565b9050919050565b5f600680549050905090565b6003602052805f5260405f205f91509050805f0180546109b590614af3565b80601f01602080910402602001604051908101604052809291908181526020018280546109e190614af3565b8015610a2c5780601f10610a0357610100808354040283529160200191610a2c565b820191905f5260205f20905b815481529060010190602001808311610a0f57829003601f168201915b505050505090806001018054610a4190614af3565b80601f0160208091040260200160405190810160405280929190818152602001828054610a6d90614af3565b8015610ab85780601f10610a8f57610100808354040283529160200191610ab8565b820191905f5260205f20905b815481529060010190602001808311610a9b57829003601f168201915b505050505090806002018054610acd90614af3565b80601f0160208091040260200160405190810160405280929190818152602001828054610af990614af3565b8015610b445780601f10610b1b57610100808354040283529160200191610b44565b820191905f5260205f20905b815481529060010190602001808311610b2757829003601f168201915b505050505090806003015490806004015f9054906101000a900460ff16908060040160019054906101000a900460ff16905086565b6004602052805f5260405f205f91509050805f015490806001015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690806002015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690806003018054610be890614af3565b80601f0160208091040260200160405190810160405280929190818152602001828054610c1490614af3565b8015610c5f5780601f10610c3657610100808354040283529160200191610c5f565b820191905f5260205f20905b815481529060010190602001808311610c4257829003601f168201915b505050505090806004018054610c7490614af3565b80601f0160208091040260200160405190810160405280929190818152602001828054610ca090614af3565b8015610ceb5780601f10610cc257610100808354040283529160200191610ceb565b820191905f5260205f20905b815481529060010190602001808311610cce57829003601f168201915b505050505090806005015490806006015490806007018054610d0c90614af3565b80601f0160208091040260200160405190810160405280929190818152602001828054610d3890614af3565b8015610d835780601f10610d5a57610100808354040283529160200191610d83565b820191905f5260205f20905b815481529060010190602001808311610d6657829003601f168201915b505050505090806008015f9054906101000a900460ff1690806009015490508a565b806005548110610dea576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610de190614e1a565b60405180910390fd5b610df2613ada565b5f60045f8481526020019081526020015f209050806001015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610e97576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610e8e90614e82565b60405180910390fd5b60016006811115610eab57610eaa61435f565b5b816008015f9054906101000a900460ff166006811115610ece57610ecd61435f565b5b14610f0e576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610f0590614eea565b60405180910390fd5b5f816006015411610f54576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610f4b90614f52565b60405180910390fd5b5f60025f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663dd62ed3e33306040518363ffffffff1660e01b8152600401610fb1929190614da9565b602060405180830381865afa158015610fcc573d5f5f3e3d5ffd5b505050506040513d601f19601f82011682018060405250810190610ff09190614963565b90508160060154811015611039576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161103090614fba565b60405180910390fd5b5f60025f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166370a08231336040518263ffffffff1660e01b815260040161109491906146be565b602060405180830381865afa1580156110af573d5f5f3e3d5ffd5b505050506040513d601f19601f820116820180604052508101906110d39190614963565b9050826006015481101561111c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161111390615022565b60405180910390fd5b61116e3330856006015460025f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16613b27909392919063ffffffff16565b6002836008015f6101000a81548160ff021916908360068111156111955761119461435f565b5b0217905550847f511a050ad0c6a45be2872d52ca217329acca8687343ec8e8dfd4689d12f7ba7884600601546040516111ce9190613f8c565b60405180910390a25050506111e1613ba9565b5050565b6111ed613e1d565b60035f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f206004015f9054906101000a900460ff16611279576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016112709061508a565b60405180910390fd5b60035f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f206040518060c00160405290815f820180546112d090614af3565b80601f01602080910402602001604051908101604052809291908181526020018280546112fc90614af3565b80156113475780601f1061131e57610100808354040283529160200191611347565b820191905f5260205f20905b81548152906001019060200180831161132a57829003601f168201915b5050505050815260200160018201805461136090614af3565b80601f016020809104026020016040519081016040528092919081815260200182805461138c90614af3565b80156113d75780601f106113ae576101008083540402835291602001916113d7565b820191905f5260205f20905b8154815290600101906020018083116113ba57829003601f168201915b505050505081526020016002820180546113f090614af3565b80601f016020809104026020016040519081016040528092919081815260200182805461141c90614af3565b80156114675780601f1061143e57610100808354040283529160200191611467565b820191905f5260205f20905b81548152906001019060200180831161144a57829003601f168201915b5050505050815260200160038201548152602001600482015f9054906101000a900460ff161515151581526020016004820160019054906101000a900460ff1615151515815250509050919050565b5f60025f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b815260040161151191906146be565b602060405180830381865afa15801561152c573d5f5f3e3d5ffd5b505050506040513d601f19601f820116820180604052508101906115509190614963565b905090565b61155d613bb2565b6115665f613c39565b565b611570613e54565b8160055481106115b5576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016115ac90614e1a565b60405180910390fd5b60045f8481526020019081526020015f20604051806101400160405290815f8201548152602001600182015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001600282015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200160038201805461169590614af3565b80601f01602080910402602001604051908101604052809291908181526020018280546116c190614af3565b801561170c5780601f106116e35761010080835404028352916020019161170c565b820191905f5260205f20905b8154815290600101906020018083116116ef57829003601f168201915b5050505050815260200160048201805461172590614af3565b80601f016020809104026020016040519081016040528092919081815260200182805461175190614af3565b801561179c5780601f106117735761010080835404028352916020019161179c565b820191905f5260205f20905b81548152906001019060200180831161177f57829003601f168201915b5050505050815260200160058201548152602001600682015481526020016007820180546117c990614af3565b80601f01602080910402602001604051908101604052809291908181526020018280546117f590614af3565b80156118405780601f1061181757610100808354040283529160200191611840565b820191905f5260205f20905b81548152906001019060200180831161182357829003601f168201915b50505050508152602001600882015f9054906101000a900460ff16600681111561186d5761186c61435f565b5b600681111561187f5761187e61435f565b5b8152602001600982015481525050915050919050565b5f60015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b60605f600f90505f5f90505f5f90505b600554811080156118dd57508282105b1561196a573373ffffffffffffffffffffffffffffffffffffffff1660045f8381526020019081526020015f206001015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1603611957578180611953906150d5565b9250505b8080611962906150d5565b9150506118cd565b505f8167ffffffffffffffff81111561198657611985614031565b5b6040519080825280602002602001820160405280156119bf57816020015b6119ac613e54565b8152602001906001900390816119a45790505b5090505f5f90505f5f90505b600554811080156119db57508382105b15611d5e573373ffffffffffffffffffffffffffffffffffffffff1660045f8381526020019081526020015f206001015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1603611d4b5760045f8281526020019081526020015f20604051806101400160405290815f8201548152602001600182015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001600282015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001600382018054611b2690614af3565b80601f0160208091040260200160405190810160405280929190818152602001828054611b5290614af3565b8015611b9d5780601f10611b7457610100808354040283529160200191611b9d565b820191905f5260205f20905b815481529060010190602001808311611b8057829003601f168201915b50505050508152602001600482018054611bb690614af3565b80601f0160208091040260200160405190810160405280929190818152602001828054611be290614af3565b8015611c2d5780601f10611c0457610100808354040283529160200191611c2d565b820191905f5260205f20905b815481529060010190602001808311611c1057829003601f168201915b505050505081526020016005820154815260200160068201548152602001600782018054611c5a90614af3565b80601f0160208091040260200160405190810160405280929190818152602001828054611c8690614af3565b8015611cd15780601f10611ca857610100808354040283529160200191611cd1565b820191905f5260205f20905b815481529060010190602001808311611cb457829003601f168201915b50505050508152602001600882015f9054906101000a900460ff166006811115611cfe57611cfd61435f565b5b6006811115611d1057611d0f61435f565b5b8152602001600982015481525050838381518110611d3157611d3061511c565b5b60200260200101819052508180611d47906150d5565b9250505b8080611d56906150d5565b9150506119cb565b508194505050505090565b60068181548110611d78575f80fd5b905f5260205f20015f915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b806005548110611de9576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611de090614e1a565b60405180910390fd5b611df1613ada565b5f60045f8481526020019081526020015f209050806001015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161480611eb05750806002015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b611eef576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611ee690615193565b60405180910390fd5b5f6006811115611f0257611f0161435f565b5b816008015f9054906101000a900460ff166006811115611f2557611f2461435f565b5b1480611f65575060016006811115611f4057611f3f61435f565b5b816008015f9054906101000a900460ff166006811115611f6357611f6261435f565b5b145b80611fa4575060026006811115611f7f57611f7e61435f565b5b816008015f9054906101000a900460ff166006811115611fa257611fa161435f565b5b145b611fe3576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611fda906151fb565b60405180910390fd5b5f816008015f9054906101000a900460ff1690506006826008015f6101000a81548160ff0219169083600681111561201e5761201d61435f565b5b0217905550600260068111156120375761203661435f565b5b81600681111561204a5761204961435f565b5b036120c8575f826006015490506120c6836001015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff168260025f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16613cfc9092919063ffffffff16565b505b5f73ffffffffffffffffffffffffffffffffffffffff16826002015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161461219b57600160035f846002015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2060040160016101000a81548160ff0219169083151502179055505b837f0c23eb44b06124e00526761c3c77095fc814bb72c9be3ac1e58f0bc2ebfe4f7e60405160405180910390a250506121d2613ba9565b5050565b60605f600a90505f5f90505f5f90505b600554811080156121f657508282105b15612268575f600681111561220e5761220d61435f565b5b60045f8381526020019081526020015f206008015f9054906101000a900460ff1660068111156122415761224061435f565b5b03612255578180612251906150d5565b9250505b8080612260906150d5565b9150506121e6565b505f8167ffffffffffffffff81111561228457612283614031565b5b6040519080825280602002602001820160405280156122bd57816020015b6122aa613e54565b8152602001906001900390816122a25790505b5090505f5f90505f5f90505b600554811080156122d957508482105b15612641575f60068111156122f1576122f061435f565b5b60045f8381526020019081526020015f206008015f9054906101000a900460ff1660068111156123245761232361435f565b5b0361262e5760045f8281526020019081526020015f20604051806101400160405290815f8201548152602001600182015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001600282015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200160038201805461240990614af3565b80601f016020809104026020016040519081016040528092919081815260200182805461243590614af3565b80156124805780601f1061245757610100808354040283529160200191612480565b820191905f5260205f20905b81548152906001019060200180831161246357829003601f168201915b5050505050815260200160048201805461249990614af3565b80601f01602080910402602001604051908101604052809291908181526020018280546124c590614af3565b80156125105780601f106124e757610100808354040283529160200191612510565b820191905f5260205f20905b8154815290600101906020018083116124f357829003601f168201915b50505050508152602001600582015481526020016006820154815260200160078201805461253d90614af3565b80601f016020809104026020016040519081016040528092919081815260200182805461256990614af3565b80156125b45780601f1061258b576101008083540402835291602001916125b4565b820191905f5260205f20905b81548152906001019060200180831161259757829003601f168201915b50505050508152602001600882015f9054906101000a900460ff1660068111156125e1576125e061435f565b5b60068111156125f3576125f261435f565b5b81526020016009820154815250508383815181106126145761261361511c565b5b6020026020010181905250818061262a906150d5565b9250505b8080612639906150d5565b9150506122c9565b508194505050505090565b612654613bb2565b5f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036126c2576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016126b990615263565b60405180910390fd5b8060025f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508073ffffffffffffffffffffffffffffffffffffffff167f904c8a9be36c5a65a055d7e0810b84781ffeeaf5ad2cbe78591929cccbf9b6dc60405160405180910390a250565b80600554811061278d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161278490614e1a565b60405180910390fd5b612795613ada565b5f60045f8481526020019081526020015f209050806001015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461283a576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401612831906152cb565b60405180910390fd5b6004600681111561284e5761284d61435f565b5b816008015f9054906101000a900460ff1660068111156128715761287061435f565b5b146128b1576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016128a890615333565b60405180910390fd5b6005816008015f6101000a81548160ff021916908360068111156128d8576128d761435f565b5b02179055505f816006015490505f826002015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050600160035f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2060040160016101000a81548160ff0219169083151502179055506129b1818360025f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16613cfc9092919063ffffffff16565b8073ffffffffffffffffffffffffffffffffffffffff16857f50e11fbcfa32b08208aaa0d745ae037f9c911d0844abad8f42ffdc9c422ddc9b846040516129f89190613f8c565b60405180910390a3505050612a0b613ba9565b5050565b60055481565b60035f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f206004015f9054906101000a900460ff16612aa1576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401612a989061539b565b60405180910390fd5b806005548110612ae6576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401612add90614e1a565b60405180910390fd5b5f60045f8481526020019081526020015f209050806002015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614612b8b576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401612b8290615429565b60405180910390fd5b60036006811115612b9f57612b9e61435f565b5b816008015f9054906101000a900460ff166006811115612bc257612bc161435f565b5b14612c02576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401612bf990615491565b60405180910390fd5b6004816008015f6101000a81548160ff02191690836006811115612c2957612c2861435f565b5b0217905550827f4052be00993fa4e08846b5344d3c5989f1e56050f7b55ce922464d74f153b5cc60405160405180910390a2505050565b60035f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f206004015f9054906101000a900460ff16612cec576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401612ce39061539b565b60405180910390fd5b806005548110612d31576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401612d2890614e1a565b60405180910390fd5b5f60045f8481526020019081526020015f2090505f6006811115612d5857612d5761435f565b5b816008015f9054906101000a900460ff166006811115612d7b57612d7a61435f565b5b14612dbb576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401612db2906154f9565b60405180910390fd5b60035f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2060040160019054906101000a900460ff16612e48576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401612e3f90615561565b60405180910390fd5b5f60035f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20600301548260050154612e99919061557f565b905033826002015f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508082600601819055506001826008015f6101000a81548160ff02191690836006811115612f0d57612f0c61435f565b5b02179055505f60035f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2060040160016101000a81548160ff0219169083151502179055503373ffffffffffffffffffffffffffffffffffffffff16847fcb890c33fd108e736800f548e422bb587b58384dea0bbc2849e4b904ce455bbc60405160405180910390a350505050565b60605f600a90505f5f90505f5f90505b60055481108015612fd457508282105b156130b2578473ffffffffffffffffffffffffffffffffffffffff1660045f8381526020019081526020015f206002015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614801561308b57505f60068111156130555761305461435f565b5b60045f8381526020019081526020015f206008015f9054906101000a900460ff1660068111156130885761308761435f565b5b14155b1561309f57818061309b906150d5565b9250505b80806130aa906150d5565b915050612fc4565b505f8167ffffffffffffffff8111156130ce576130cd614031565b5b60405190808252806020026020018201604052801561310757816020015b6130f4613e54565b8152602001906001900390816130ec5790505b5090505f5f90505f5f90505b6005548110801561312357508382105b156134f7578673ffffffffffffffffffffffffffffffffffffffff1660045f8381526020019081526020015f206002015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161480156131da57505f60068111156131a4576131a361435f565b5b60045f8381526020019081526020015f206008015f9054906101000a900460ff1660068111156131d7576131d661435f565b5b14155b156134e45760045f8281526020019081526020015f20604051806101400160405290815f8201548152602001600182015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001600282015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020016003820180546132bf90614af3565b80601f01602080910402602001604051908101604052809291908181526020018280546132eb90614af3565b80156133365780601f1061330d57610100808354040283529160200191613336565b820191905f5260205f20905b81548152906001019060200180831161331957829003601f168201915b5050505050815260200160048201805461334f90614af3565b80601f016020809104026020016040519081016040528092919081815260200182805461337b90614af3565b80156133c65780601f1061339d576101008083540402835291602001916133c6565b820191905f5260205f20905b8154815290600101906020018083116133a957829003601f168201915b5050505050815260200160058201548152602001600682015481526020016007820180546133f390614af3565b80601f016020809104026020016040519081016040528092919081815260200182805461341f90614af3565b801561346a5780601f106134415761010080835404028352916020019161346a565b820191905f5260205f20905b81548152906001019060200180831161344d57829003601f168201915b50505050508152602001600882015f9054906101000a900460ff1660068111156134975761349661435f565b5b60068111156134a9576134a861435f565b5b81526020016009820154815250508383815181106134ca576134c961511c565b5b602002602001018190525081806134e0906150d5565b9250505b80806134ef906150d5565b915050613113565b5081945050505050919050565b5f5f8311613547576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161353e9061560a565b60405180910390fd5b5f85511161358a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161358190615672565b60405180910390fd5b5f8451116135cd576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016135c4906156da565b60405180910390fd5b5f60055490506040518061014001604052808281526020013373ffffffffffffffffffffffffffffffffffffffff1681526020015f73ffffffffffffffffffffffffffffffffffffffff1681526020018781526020018681526020018581526020015f81526020018481526020015f600681111561364e5761364d61435f565b5b81526020014281525060045f8381526020019081526020015f205f820151815f01556020820151816001015f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506040820151816002015f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060608201518160030190816137119190614cba565b5060808201518160040190816137279190614cba565b5060a0820151816005015560c0820151816006015560e08201518160070190816137519190614cba565b50610100820151816008015f6101000a81548160ff0219169083600681111561377d5761377c61435f565b5b0217905550610120820151816009015590505060055f8154809291906137a2906150d5565b91905055503373ffffffffffffffffffffffffffffffffffffffff16817f54ae564e5bca6e1fe8b8da57b977869728091509f6fda4b7ca70f5f103196de45f6040516137ee9190615731565b60405180910390a380915050949350505050565b60035f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f206004015f9054906101000a900460ff1661388e576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016138859061539b565b60405180910390fd5b8060055481106138d3576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016138ca90614e1a565b60405180910390fd5b5f60045f8481526020019081526020015f209050806002015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614613978576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161396f90615794565b60405180910390fd5b6002600681111561398c5761398b61435f565b5b816008015f9054906101000a900460ff1660068111156139af576139ae61435f565b5b146139ef576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016139e6906157fc565b60405180910390fd5b6003816008015f6101000a81548160ff02191690836006811115613a1657613a1561435f565b5b0217905550827f1caef5aba80487f3eb64526a934f8250dd2591d249cd4f14756041c0ff93607d60405160405180910390a2505050565b5f600554905090565b613a5e613bb2565b5f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603613ace575f6040517f1e4fbdf7000000000000000000000000000000000000000000000000000000008152600401613ac591906146be565b60405180910390fd5b613ad781613c39565b50565b60025f5403613b1e576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401613b1590615864565b60405180910390fd5b60025f81905550565b613ba3848573ffffffffffffffffffffffffffffffffffffffff166323b872dd868686604051602401613b5c93929190615882565b604051602081830303815290604052915060e01b6020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff8381831617835250505050613d7b565b50505050565b60015f81905550565b613bba613e16565b73ffffffffffffffffffffffffffffffffffffffff16613bd8611895565b73ffffffffffffffffffffffffffffffffffffffff1614613c3757613bfb613e16565b6040517f118cdaa7000000000000000000000000000000000000000000000000000000008152600401613c2e91906146be565b60405180910390fd5b565b5f60015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690508160015f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b613d76838473ffffffffffffffffffffffffffffffffffffffff1663a9059cbb8585604051602401613d2f9291906158b7565b604051602081830303815290604052915060e01b6020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff8381831617835250505050613d7b565b505050565b5f5f60205f8451602086015f885af180613d9a576040513d5f823e3d81fd5b3d92505f519150505f8214613db3576001811415613dce565b5f8473ffffffffffffffffffffffffffffffffffffffff163b145b15613e1057836040517f5274afe7000000000000000000000000000000000000000000000000000000008152600401613e0791906146be565b60405180910390fd5b50505050565b5f33905090565b6040518060c001604052806060815260200160608152602001606081526020015f81526020015f151581526020015f151581525090565b6040518061014001604052805f81526020015f73ffffffffffffffffffffffffffffffffffffffff1681526020015f73ffffffffffffffffffffffffffffffffffffffff16815260200160608152602001606081526020015f81526020015f8152602001606081526020015f6006811115613ed257613ed161435f565b5b81526020015f81525090565b5f604051905090565b5f5ffd5b5f5ffd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f613f1882613eef565b9050919050565b613f2881613f0e565b8114613f32575f5ffd5b50565b5f81359050613f4381613f1f565b92915050565b5f60208284031215613f5e57613f5d613ee7565b5b5f613f6b84828501613f35565b91505092915050565b5f819050919050565b613f8681613f74565b82525050565b5f602082019050613f9f5f830184613f7d565b92915050565b5f819050919050565b5f613fc8613fc3613fbe84613eef565b613fa5565b613eef565b9050919050565b5f613fd982613fae565b9050919050565b5f613fea82613fcf565b9050919050565b613ffa81613fe0565b82525050565b5f6020820190506140135f830184613ff1565b92915050565b5f5ffd5b5f5ffd5b5f601f19601f8301169050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b61406782614021565b810181811067ffffffffffffffff8211171561408657614085614031565b5b80604052505050565b5f614098613ede565b90506140a4828261405e565b919050565b5f67ffffffffffffffff8211156140c3576140c2614031565b5b6140cc82614021565b9050602081019050919050565b828183375f83830152505050565b5f6140f96140f4846140a9565b61408f565b9050828152602081018484840111156141155761411461401d565b5b6141208482856140d9565b509392505050565b5f82601f83011261413c5761413b614019565b5b813561414c8482602086016140e7565b91505092915050565b61415e81613f74565b8114614168575f5ffd5b50565b5f8135905061417981614155565b92915050565b5f5f5f5f6080858703121561419757614196613ee7565b5b5f85013567ffffffffffffffff8111156141b4576141b3613eeb565b5b6141c087828801614128565b945050602085013567ffffffffffffffff8111156141e1576141e0613eeb565b5b6141ed87828801614128565b935050604085013567ffffffffffffffff81111561420e5761420d613eeb565b5b61421a87828801614128565b925050606061422b8782880161416b565b91505092959194509250565b5f81519050919050565b5f82825260208201905092915050565b8281835e5f83830152505050565b5f61426982614237565b6142738185614241565b9350614283818560208601614251565b61428c81614021565b840191505092915050565b5f8115159050919050565b6142ab81614297565b82525050565b5f60c0820190508181035f8301526142c9818961425f565b905081810360208301526142dd818861425f565b905081810360408301526142f1818761425f565b90506143006060830186613f7d565b61430d60808301856142a2565b61431a60a08301846142a2565b979650505050505050565b5f6020828403121561433a57614339613ee7565b5b5f6143478482850161416b565b91505092915050565b61435981613f0e565b82525050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602160045260245ffd5b6007811061439d5761439c61435f565b5b50565b5f8190506143ad8261438c565b919050565b5f6143bc826143a0565b9050919050565b6143cc816143b2565b82525050565b5f610140820190506143e65f83018d613f7d565b6143f3602083018c614350565b614400604083018b614350565b8181036060830152614412818a61425f565b90508181036080830152614426818961425f565b905061443560a0830188613f7d565b61444260c0830187613f7d565b81810360e0830152614454818661425f565b90506144646101008301856143c3565b614472610120830184613f7d565b9b9a5050505050505050505050565b5f82825260208201905092915050565b5f61449b82614237565b6144a58185614481565b93506144b5818560208601614251565b6144be81614021565b840191505092915050565b6144d281613f74565b82525050565b6144e181614297565b82525050565b5f60c083015f8301518482035f8601526145018282614491565b9150506020830151848203602086015261451b8282614491565b915050604083015184820360408601526145358282614491565b915050606083015161454a60608601826144c9565b50608083015161455d60808601826144d8565b5060a083015161457060a08601826144d8565b508091505092915050565b5f6020820190508181035f83015261459381846144e7565b905092915050565b6145a481613f0e565b82525050565b6145b3816143b2565b82525050565b5f61014083015f8301516145cf5f8601826144c9565b5060208301516145e2602086018261459b565b5060408301516145f5604086018261459b565b506060830151848203606086015261460d8282614491565b915050608083015184820360808601526146278282614491565b91505060a083015161463c60a08601826144c9565b5060c083015161464f60c08601826144c9565b5060e083015184820360e08601526146678282614491565b91505061010083015161467e6101008601826145aa565b506101208301516146936101208601826144c9565b508091505092915050565b5f6020820190508181035f8301526146b681846145b9565b905092915050565b5f6020820190506146d15f830184614350565b92915050565b5f81519050919050565b5f82825260208201905092915050565b5f819050602082019050919050565b5f61014083015f8301516147165f8601826144c9565b506020830151614729602086018261459b565b50604083015161473c604086018261459b565b50606083015184820360608601526147548282614491565b9150506080830151848203608086015261476e8282614491565b91505060a083015161478360a08601826144c9565b5060c083015161479660c08601826144c9565b5060e083015184820360e08601526147ae8282614491565b9150506101008301516147c56101008601826145aa565b506101208301516147da6101208601826144c9565b508091505092915050565b5f6147f08383614700565b905092915050565b5f602082019050919050565b5f61480e826146d7565b61481881856146e1565b93508360208202850161482a856146f1565b805f5b85811015614865578484038952815161484685826147e5565b9450614851836147f8565b925060208a0199505060018101905061482d565b50829750879550505050505092915050565b5f6020820190508181035f83015261488f8184614804565b905092915050565b5f5f5f5f608085870312156148af576148ae613ee7565b5b5f85013567ffffffffffffffff8111156148cc576148cb613eeb565b5b6148d887828801614128565b945050602085013567ffffffffffffffff8111156148f9576148f8613eeb565b5b61490587828801614128565b93505060406149168782880161416b565b925050606085013567ffffffffffffffff81111561493757614936613eeb565b5b61494387828801614128565b91505092959194509250565b5f8151905061495d81614155565b92915050565b5f6020828403121561497857614977613ee7565b5b5f6149858482850161494f565b91505092915050565b7f44726976657220616c72656164792072656769737465726564000000000000005f82015250565b5f6149c2601983614241565b91506149cd8261498e565b602082019050919050565b5f6020820190508181035f8301526149ef816149b6565b9050919050565b7f52617465206d7573742062652067726561746572207468616e203000000000005f82015250565b5f614a2a601b83614241565b9150614a35826149f6565b602082019050919050565b5f6020820190508181035f830152614a5781614a1e565b9050919050565b7f4e616d652063616e6e6f7420626520656d7074790000000000000000000000005f82015250565b5f614a92601483614241565b9150614a9d82614a5e565b602082019050919050565b5f6020820190508181035f830152614abf81614a86565b9050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f6002820490506001821680614b0a57607f821691505b602082108103614b1d57614b1c614ac6565b5b50919050565b5f819050815f5260205f209050919050565b5f6020601f8301049050919050565b5f82821b905092915050565b5f60088302614b7f7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82614b44565b614b898683614b44565b95508019841693508086168417925050509392505050565b5f614bbb614bb6614bb184613f74565b613fa5565b613f74565b9050919050565b5f819050919050565b614bd483614ba1565b614be8614be082614bc2565b848454614b50565b825550505050565b5f5f905090565b614bff614bf0565b614c0a818484614bcb565b505050565b5b81811015614c2d57614c225f82614bf7565b600181019050614c10565b5050565b601f821115614c7257614c4381614b23565b614c4c84614b35565b81016020851015614c5b578190505b614c6f614c6785614b35565b830182614c0f565b50505b505050565b5f82821c905092915050565b5f614c925f1984600802614c77565b1980831691505092915050565b5f614caa8383614c83565b9150826002028217905092915050565b614cc382614237565b67ffffffffffffffff811115614cdc57614cdb614031565b5b614ce68254614af3565b614cf1828285614c31565b5f60209050601f831160018114614d22575f8415614d10578287015190505b614d1a8582614c9f565b865550614d81565b601f198416614d3086614b23565b5f5b82811015614d5757848901518255600182019150602085019450602081019050614d32565b86831015614d745784890151614d70601f891682614c83565b8355505b6001600288020188555050505b505050505050565b5f6020820190508181035f830152614da1818461425f565b905092915050565b5f604082019050614dbc5f830185614350565b614dc96020830184614350565b9392505050565b7f5269646520646f6573206e6f74206578697374000000000000000000000000005f82015250565b5f614e04601383614241565b9150614e0f82614dd0565b602082019050919050565b5f6020820190508181035f830152614e3181614df8565b9050919050565b7f4f6e6c792072696465722063616e2066756e64000000000000000000000000005f82015250565b5f614e6c601383614241565b9150614e7782614e38565b602082019050919050565b5f6020820190508181035f830152614e9981614e60565b9050919050565b7f52696465206d75737420626520616363657074656420666972737400000000005f82015250565b5f614ed4601b83614241565b9150614edf82614ea0565b602082019050919050565b5f6020820190508181035f830152614f0181614ec8565b9050919050565b7f46617265206d7573742062652067726561746572207468616e203000000000005f82015250565b5f614f3c601b83614241565b9150614f4782614f08565b602082019050919050565b5f6020820190508181035f830152614f6981614f30565b9050919050565b7f496e73756666696369656e74205553444320616c6c6f77616e636500000000005f82015250565b5f614fa4601b83614241565b9150614faf82614f70565b602082019050919050565b5f6020820190508181035f830152614fd181614f98565b9050919050565b7f496e73756666696369656e7420555344432062616c616e6365000000000000005f82015250565b5f61500c601983614241565b915061501782614fd8565b602082019050919050565b5f6020820190508181035f83015261503981615000565b9050919050565b7f447269766572206e6f74207265676973746572656400000000000000000000005f82015250565b5f615074601583614241565b915061507f82615040565b602082019050919050565b5f6020820190508181035f8301526150a181615068565b9050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f6150df82613f74565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8203615111576151106150a8565b5b600182019050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52603260045260245ffd5b7f4f6e6c79207269646572206f72206472697665722063616e2063616e63656c005f82015250565b5f61517d601f83614241565b915061518882615149565b602082019050919050565b5f6020820190508181035f8301526151aa81615171565b9050919050565b7f43616e6e6f742063616e63656c207269646520696e2070726f677265737300005f82015250565b5f6151e5601e83614241565b91506151f0826151b1565b602082019050919050565b5f6020820190508181035f830152615212816151d9565b9050919050565b7f496e76616c6964205553444320616464726573730000000000000000000000005f82015250565b5f61524d601483614241565b915061525882615219565b602082019050919050565b5f6020820190508181035f83015261527a81615241565b9050919050565b7f4f6e6c792072696465722063616e20636f6e6669726d000000000000000000005f82015250565b5f6152b5601683614241565b91506152c082615281565b602082019050919050565b5f6020820190508181035f8301526152e2816152a9565b9050919050565b7f447269766572206d75737420636f6d706c6574652066697273740000000000005f82015250565b5f61531d601a83614241565b9150615328826152e9565b602082019050919050565b5f6020820190508181035f83015261534a81615311565b9050919050565b7f4e6f7420612072656769737465726564206472697665720000000000000000005f82015250565b5f615385601783614241565b915061539082615351565b602082019050919050565b5f6020820190508181035f8301526153b281615379565b9050919050565b7f4f6e6c792061737369676e6564206472697665722063616e20636f6d706c65745f8201527f6500000000000000000000000000000000000000000000000000000000000000602082015250565b5f615413602183614241565b915061541e826153b9565b604082019050919050565b5f6020820190508181035f83015261544081615407565b9050919050565b7f52696465206d75737420626520737461727465642066697273740000000000005f82015250565b5f61547b601a83614241565b915061548682615447565b602082019050919050565b5f6020820190508181035f8301526154a88161546f565b9050919050565b7f52696465206e6f7420617661696c61626c6500000000000000000000000000005f82015250565b5f6154e3601283614241565b91506154ee826154af565b602082019050919050565b5f6020820190508181035f830152615510816154d7565b9050919050565b7f447269766572206e6f7420617661696c61626c650000000000000000000000005f82015250565b5f61554b601483614241565b915061555682615517565b602082019050919050565b5f6020820190508181035f8301526155788161553f565b9050919050565b5f61558982613f74565b915061559483613f74565b92508282026155a281613f74565b915082820484148315176155b9576155b86150a8565b5b5092915050565b7f44697374616e6365206d7573742062652067726561746572207468616e2030005f82015250565b5f6155f4601f83614241565b91506155ff826155c0565b602082019050919050565b5f6020820190508181035f830152615621816155e8565b9050919050565b7f5069636b7570206c6f636174696f6e2063616e6e6f7420626520656d707479005f82015250565b5f61565c601f83614241565b915061566782615628565b602082019050919050565b5f6020820190508181035f83015261568981615650565b9050919050565b7f44657374696e6174696f6e2063616e6e6f7420626520656d70747900000000005f82015250565b5f6156c4601b83614241565b91506156cf82615690565b602082019050919050565b5f6020820190508181035f8301526156f1816156b8565b9050919050565b5f819050919050565b5f61571b615716615711846156f8565b613fa5565b613f74565b9050919050565b61572b81615701565b82525050565b5f6020820190506157445f830184615722565b92915050565b7f4f6e6c792061737369676e6564206472697665722063616e20737461727400005f82015250565b5f61577e601e83614241565b91506157898261574a565b602082019050919050565b5f6020820190508181035f8301526157ab81615772565b9050919050565b7f52696465206d7573742062652066756e646564206669727374000000000000005f82015250565b5f6157e6601983614241565b91506157f1826157b2565b602082019050919050565b5f6020820190508181035f830152615813816157da565b9050919050565b7f5265656e7472616e637947756172643a207265656e7472616e742063616c6c005f82015250565b5f61584e601f83614241565b91506158598261581a565b602082019050919050565b5f6020820190508181035f83015261587b81615842565b9050919050565b5f6060820190506158955f830186614350565b6158a26020830185614350565b6158af6040830184613f7d565b949350505050565b5f6040820190506158ca5f830185614350565b6158d76020830184613f7d565b939250505056fea2646970667358221220f1c7b9e05e2ee17545f16050d15be172ea27205b472d367bb73b39b99d64920b64736f6c634300081f0033'; // Paste bytecode RideSharing dari Remix

// ============================================
// FUNGSI HELPER
// ============================================

/**
 * Menunggu konfirmasi transaksi
 */
async function waitForTransaction(web3, txHash, contractName) {
    console.log(`⏳ Menunggu konfirmasi transaksi ${contractName}...`);
    console.log(`   Transaction Hash: ${txHash}`);

    let receipt = null;
    let attempts = 0;
    const maxAttempts = 60; // 5 menit (60 * 5 detik)

    while (receipt === null && attempts < maxAttempts) {
        try {
            receipt = await web3.eth.getTransactionReceipt(txHash);
            if (receipt === null) {
                await new Promise(resolve => setTimeout(resolve, 5000)); // Tunggu 5 detik
                attempts++;
                process.stdout.write('.');
            }
        } catch (error) {
            console.error(`\n❌ Error saat menunggu konfirmasi:`, error.message);
            attempts++;
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }

    console.log('\n');

    if (receipt === null) {
        throw new Error('Timeout: Transaksi tidak terkonfirmasi dalam 5 menit');
    }

    if (receipt.status === false || receipt.status === 0n) {
        throw new Error('Transaksi gagal! Status: Failed');
    }

    return receipt;
}

/**
 * Deploy USDC Contract
 */
async function deployUSDC(web3, account) {
    console.log('\n🚀 ===== DEPLOY USDC CONTRACT =====\n');

    try {
        const usdcContract = new web3.eth.Contract(USDC_ABI);

        const deployTx = usdcContract.deploy({
            data: USDC_BYTECODE,
            arguments: [INITIAL_OWNER] // constructor parameter: initialOwner
        });

        // Estimasi gas
        const gas = await deployTx.estimateGas({ from: account.address });
        console.log(`📊 Estimasi Gas: ${gas}`);

        // Get current gas price
        const gasPrice = await web3.eth.getGasPrice();
        console.log(`💰 Gas Price: ${web3.utils.fromWei(gasPrice, 'gwei')} Gwei`);

        // Deploy contract
        console.log('📤 Mengirim transaksi deployment USDC...');
        const tx = await deployTx.send({
            from: account.address,
            gas: gas.toString(),
            gasPrice: gasPrice.toString()
        });

        const usdcAddress = tx.options.address;
        console.log(`✅ USDC Contract berhasil di-deploy!`);
        console.log(`   📍 Contract Address: ${usdcAddress}`);
        console.log(`   🔗 Etherscan: https://sepolia.etherscan.io/address/${usdcAddress}`);

        return usdcAddress;

    } catch (error) {
        console.error('❌ Error saat deploy USDC:', error.message);
        throw error;
    }
}

/**
 * Deploy RideSharing Contract
 */
async function deployRideSharing(web3, account, usdcAddress) {
    console.log('\n===== DEPLOY RIDESHARING CONTRACT =====\n');

    try {
        const rideSharingContract = new web3.eth.Contract(RIDESHARING_ABI);

        const deployTx = rideSharingContract.deploy({
            data: RIDESHARING_BYTECODE,
            arguments: [usdcAddress] // constructor parameter: USDC address
        });

        // Estimasi gas
        const gas = await deployTx.estimateGas({ from: account.address });
        console.log(`Estimasi Gas: ${gas}`);

        // Get current gas price
        const gasPrice = await web3.eth.getGasPrice();
        console.log(`Gas Price: ${web3.utils.fromWei(gasPrice, 'gwei')} Gwei`);

        // Deploy contract
        console.log('Mengirim transaksi deployment RideSharing...');
        const tx = await deployTx.send({
            from: account.address,
            gas: gas.toString(),
            gasPrice: gasPrice.toString()
        });

        const rideSharingAddress = tx.options.address;
        console.log(`RideSharing Contract berhasil di-deploy!`);
        console.log(`Contract Address: ${rideSharingAddress}`);
        console.log(`Etherscan: https://sepolia.etherscan.io/address/${rideSharingAddress}`);

        return rideSharingAddress;

    } catch (error) {
        console.error('Error saat deploy RideSharing:', error.message);
        throw error;
    }
}

/**
 * Verifikasi deployment dengan memanggil fungsi di contract
 */
async function verifyDeployment(web3, usdcAddress, rideSharingAddress) {
    console.log('\n ===== VERIFIKASI DEPLOYMENT =====\n');

    try {
        // Verifikasi USDC
        const usdcContract = new web3.eth.Contract(USDC_ABI, usdcAddress);
        const usdcName = await usdcContract.methods.name().call();
        const usdcSymbol = await usdcContract.methods.symbol().call();
        const usdcDecimals = await usdcContract.methods.decimals().call();

        console.log('USDC Contract:');
        console.log(`Name: ${usdcName}`);
        console.log(`Symbol: ${usdcSymbol}`);
        console.log(`Decimals: ${usdcDecimals}`);

        // Verifikasi RideSharing
        const rideSharingContract = new web3.eth.Contract(RIDESHARING_ABI, rideSharingAddress);
        const usdcTokenAddress = await rideSharingContract.methods.usdcToken().call();
        const rideCounter = await rideSharingContract.methods.rideCounter().call();

        console.log('\nRideSharing Contract:');
        console.log(`USDC Token Address: ${usdcTokenAddress}`);
        console.log(`Ride Counter: ${rideCounter}`);
        console.log(`USDC Match: ${usdcTokenAddress.toLowerCase() === usdcAddress.toLowerCase() ? '✅' : '❌'}`);

    } catch (error) {
        console.error('Error saat verifikasi:', error.message);
    }
}

// ============================================
// MAIN FUNCTION
// ============================================

async function main() {
    console.log('\n===== DEPLOYMENT SCRIPT DIMULAI =====\n');

    // Validasi environment variables
    if (!PRIVATE_KEY || !RPC_URL || !INITIAL_OWNER) {
        console.error('Error: Pastikan PRIVATE_KEY, RPC_URL, dan WALLET_ADDRESS sudah diset di .env');
        process.exit(1);
    }

    try {
        // Inisialisasi Web3
        const web3 = new Web3(RPC_URL);
        console.log('Koneksi ke Sepolia Testnet berhasil');

        // Load account dari private key
        const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
        web3.eth.accounts.wallet.add(account);
        web3.eth.defaultAccount = account.address;

        console.log(`Deployer Address: ${account.address}`);

        // Cek balance
        const balance = await web3.eth.getBalance(account.address);
        const balanceInEth = web3.utils.fromWei(balance, 'ether');
        console.log(`Balance: ${balanceInEth} ETH`);

        if (parseFloat(balanceInEth) < 0.01) {
            console.warn('Warning: Balance ETH rendah! Pastikan Anda punya cukup ETH untuk gas fees');
        }

        // Deploy USDC Contract
        const usdcAddress = await deployUSDC(web3, account);

        // Tunggu beberapa detik sebelum deploy contract berikutnya
        console.log('\nMenunggu 10 detik sebelum deploy RideSharing...');
        await new Promise(resolve => setTimeout(resolve, 10000));

        // Deploy RideSharing Contract
        const rideSharingAddress = await deployRideSharing(web3, account, usdcAddress);

        // Verifikasi deployment
        await verifyDeployment(web3, usdcAddress, rideSharingAddress);

        // Summary
        console.log('\n\n===== DEPLOYMENT SELESAI =====\n');
        console.log('RINGKASAN:');
        console.log(`USDC Contract: ${usdcAddress}`);
        console.log(`RideSharing Contract: ${rideSharingAddress}`);
        console.log(`\nLihat di Etherscan:`);
        console.log(`USDC: https://sepolia.etherscan.io/address/${usdcAddress}`);
        console.log(`RideSharing: https://sepolia.etherscan.io/address/${rideSharingAddress}`);
        console.log('\nSimpan address contract ini untuk digunakan di frontend!\n');

    } catch (error) {
        console.error('\nError fatal:', error);
        process.exit(1);
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });