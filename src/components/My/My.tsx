import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import styled from "styled-components";
import { ethers } from 'ethers'
import { myNfts } from '../../api/market/market'
import { ProductType } from '../../types/product'
import NftCard from '../Commons/NftCard/NftCard'


const My = () => {
    const [TotalEarned, setTotalEarned] = useState<string | null>(null);
    const [SignedNft, setSignedNft] = useState<ProductType[] | null>(null);
    const { id } = useParams();
    const navi = useNavigate();

    // @ GET Signed NFTs FROM Backend & wei Price Handling
    useEffect(() => {
        (async function(){
            // @ Get NFTs filtered by Signer
            const result = await myNfts(id);

            // @ Compute Total Earned;
            const filtered = result.data.filter((item:ProductType) => item.saleState);
            
            let sum : number = 0;

            filtered.map((item: ProductType) => {
                const wei : string = String(item.price);
                const weiToEther = ethers.utils.formatEther(wei);
                sum += Number(weiToEther);
            })
            
            setSignedNft(result.data);
            setTotalEarned(String(sum.toFixed(18)));
        })();
    }, [])
    
    return (
        <MyPageContainer>
            <div className="container">
                    {/* Head Box */}
                    <TitleBox>
                        <h1 className="landing__title">Created NFTs</h1>
                        <EarnedSpan> 총 수익량 : {TotalEarned}</EarnedSpan>
                    </TitleBox>

                    {/* NFTs */}
                    <SignedNftBox>
                        {SignedNft?.map((item : ProductType, idx: number)=> (

                                <NftCardBox key={idx}>
                                    <NftCard 
                                        _id={item._id}
                                        tokenId={item.tokenId}
                                        name={item.name}
                                        description={item.description}
                                        ipfsUrl={item.ipfsUrl}
                                        price={item.price}
                                        signer={item.signer}
                                        sig={item.sig}
                                        saleState={item.saleState}
                                        buyer={item.buyer}
                                        width="300px"
                                        onClick={() => {
                                            if(!item.saleState){
                                                navi(`/nft/${item._id}`);
                                            }
                                        }}
                                    />
                                </NftCardBox>
                        ))}
                    </SignedNftBox>


                </div>
        </MyPageContainer>
    
    )
}

export default My

const MyPageContainer = styled.div`
    padding: 5rem;
`;

const SignedNftBox = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
`;

const NftCardBox = styled.div`
    margin : 15px 0;
`;

const TitleBox = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const EarnedSpan = styled.span`
    font-style: italic;
    font-size: 18px;
    margin-right: 2rem;
`;