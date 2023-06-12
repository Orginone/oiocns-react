import Web3 from 'web3';
import { message } from 'antd';

export class Blockchain {
  constructor(
    unitData = {
      privateKey: '0x9d917c3c6174b3365ccbc32445177219a60be0074867bcdec8eac7399637f349', //测试私钥
      address: '0xdd0d9a7c47ebf1b02e1095a7f443b3ab61abfc6b', //测试钱包地址
    },
  ) {
    this.web3 = new Web3('http://183.134.99.137:8547'); //web3客户端
    this.unitData = unitData;
    this.nftContractAddress = '0x768a71F22578Db3159C9CB21eed816aaea701836'; //nft合约地址
    this.nftContractAbi = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
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
				"name": "approved",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
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
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "ApprovalForAll",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_fromTokenId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_toTokenId",
				"type": "uint256"
			}
		],
		"name": "BatchMetadataUpdate",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_tokenId",
				"type": "uint256"
			}
		],
		"name": "MetadataUpdate",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "tokinId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "asCode",
				"type": "string"
			}
		],
		"name": "MintNft",
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
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
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
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
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
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "getApproved",
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
				"name": "wallet",
				"type": "address"
			}
		],
		"name": "getNftList",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
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
				"name": "operator",
				"type": "address"
			}
		],
		"name": "isApprovedForAll",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "asCode",
				"type": "string"
			}
		],
		"name": "mintNFT",
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
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ownerOf",
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
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
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
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "data",
				"type": "bytes"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "setApprovalForAll",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes4",
				"name": "interfaceId",
				"type": "bytes4"
			}
		],
		"name": "supportsInterface",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
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
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "tokenURI",
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
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
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
	}
]
	this.nftContract = new this.web3.eth.Contract(
	this.nftContractAbi,
	this.nftContractAddress,
  	);
    this.ProofContractAddress = '0x639874A1978065ea394a444f032400655ED55E7B'; //存证合约地址
    this.ProofContractAbi = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
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
		"inputs": [
			{
				"internalType": "string",
				"name": "proofHash",
				"type": "string"
			}
		],
		"name": "getProofSender",
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
		"inputs": [
			{
				"internalType": "string",
				"name": "proofHash",
				"type": "string"
			}
		],
		"name": "saveProof",
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
]
	this.ProofContract = new this.web3.eth.Contract(
	this.ProofContractAbi,
	this.ProofContractAddress,
  );
  }
 private web3: Web3;
  unitData: any;
 private nftContract:any
 private nftContractAddress: string;
 private nftContractAbi: any[];
 private ProofContractAddress: string;
 private ProofContractAbi: any[];
 private ProofContract:any
  /**
   * 是否需要创建钱包 创建nft
   * @param unitData 用户或单位信息 钱包地址
   * @param destination 目标
   * @returns 钱包信息
   */
  async createNFT() {
    const tokenURI = 'http://60.12.184.86:17777/meta.json'; //tokenURI地址 需要提供一个存储tokenURI的地方
    let iskey = this.unitData.address && this.unitData.privateKey; //是否已有钱包

    if (iskey == false) {
      const account = await this.web3.eth.accounts.create();
      //调用一个接口存储address和privateKey，等后端接口
    }

    const mintNFT = async (receiver:string, tokenURI:any) => {
      const nonce = await this.web3.eth.getTransactionCount(receiver, 'latest'); //get latest nonce

      //the transaction
      const nftTx = {
        from: receiver,
        to: this.nftContractAddress,
        nonce: nonce,
        gas: 500000,
        // 'maxPriorityFeePerGas': 1999999987,
        data: this.nftContract.methods.mintNFT(receiver, tokenURI).encodeABI(),
      };
      const signPromise = this.web3.eth.accounts.signTransaction(
        nftTx,
        this.unitData.privateKey,
      );
      signPromise
        .then((signedTx) => {
          this.web3.eth.sendSignedTransaction(
            signedTx.rawTransaction as string,
            async (err, hash) => {
              if (!err) {
                console.log('创建的NFT hash是：', hash);
                //每次获取hash立刻存到接口内，以备后续校对

				  const data = await this.fetchData(true,hash); //校验是否已经存到链上
				  console.log("获取到了!!!!!!!!!!!!!!!",data);

                await this.createProof(hash);
                await this.getNftList();
              } else {
                console.log(
                  'Something went wrong when submitting your transaction:',
                  err,
                );
              }
            },
          );
        })
        .catch((err) => {
          console.log('Promise failed:', err);
        });
    };

    await mintNFT(this.unitData.address, tokenURI); //生成要签名的事务数据
  }

  /**
   * 创建存证
   *
   */
  async createProof(TxHash: string) {
    const nonce = await this.web3.eth.getTransactionCount(this.unitData.address, 'latest'); //get latest nonce
    console.log('createProofNonce', nonce);

    const ProofTx = {
      //存证事务数据
      from: this.unitData.address,
      to: this.ProofContractAddress,
      nonce: nonce,
      gas: 550000,
      data: this.ProofContract.methods.saveProof(TxHash).encodeABI(),
    };
    const signPromise = this.web3.eth.accounts.signTransaction(
      //对存证事务数据签名
      ProofTx,
      this.unitData.privateKey,
    );
    signPromise.then((signedTx) => {
        this.web3.eth.sendSignedTransaction(
          signedTx.rawTransaction as string,
          async (err, hash) => {
            //存证返回链上事务hash
            if (!err) {
              console.log('创建的Proof hash是：', hash);
			  const data = await this.fetchData(true,hash);
			  console.log("获取到了Proof!!!!!!!!!!!!!!!",data);
              await this.getProofSender(TxHash);
            } else {
              console.log('Something went wrong when submitting your proof transaction:',err);
            }
          },
        );
      })
      .catch((err) => {
        console.log('Promise failed:', err);
      });
  }
  /**
   * 根据Proof被创建时的事务id，获取存证用户信息
   */
  async getProofSender(proofHash: string) {
    const result = await this.ProofContract.methods.getProofSender(proofHash).call();
    console.log('存证用户钱包地址',result); //用户钱包地址
  }
  /**
   * 根据nft被创建时的事务id，获取存证用户信息
   */
  async getNftList() {
    const result = await this.nftContract.methods.getNftList(this.unitData.address).call();
    console.log(result);
    
    result.forEach(async (v:any) => {
      await this.getTokenURI(v);
    });
    console.log('getNftList', result); //用户钱包地址
  }
  /**
   * 根据tokenId，获取TokenURI
   */
  private async getTokenURI(tokenId: number) {
    const tokenuri = await this.nftContract.methods.tokenURI(tokenId).call();
    console.log('TokenURI:', tokenuri);
  }
  /**
   * 区块链上写入数据可能延迟，传入hash判断是否已经写入
   */
  private async fetchData(isFirst = true,hash:string) {
					
	return new Promise((resolve) => {
	  const interval = setInterval(async () => {
		
		// 做请求数据的操作
		const data = await await this.web3.eth.getTransactionReceipt(
			//判断status
			hash,
		  );
		
		if (data !== null&&data.status==true) {
			
		  clearInterval(interval); // 清除定时器
		  resolve(data); // 返回数据，结束递归
		} else if (!isFirst) {
		  setTimeout(() => {
			this.fetchData(false,hash).then((data) => {
			  resolve(data); // 递归调用 fetchData 函数
			});
		  }, 5000);
		  clearInterval(interval); // 清除定时器
		}
	  }, isFirst ? 0 : 5000);
	});
  }
  
    /**
   * 监听链上返回tokenID，因为不支持events.mintNft 所以需要去轮询
   */
  private async mintNft(nftHash:string) {
	this.web3.eth.getTransaction(nftHash).then(res=>{
		console.log("getTransaction",res);
		this.nftContract.getPastEvents("MintNft",{
			filter:{owner:this.unitData.address},
			fromBlock:res.blockNumber,
			toBlock:res.blockNumber
		})
		.then((events:any)=>{
			console.log(events);
			
		})
		
	})
	
  }
}

