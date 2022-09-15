import React, { useState, useEffect } from 'react'
import axios from "axios";
import styled from 'styled-components'
import { useParams, useNavigate } from 'react-router-dom';
import { Add, Remove } from '@material-ui/icons';
import { mobile } from '../responsive';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader


const Container = styled.div`
    display: flex;
    flex-direction: column;
`;

const Cart = styled.div`
`;

const ItemWrapper = styled.div`
    display: flex;
    gap: 400px;
    padding: 50px;
    ${mobile({ padding: "10px", flexDirection: "column"})}
`;

const InfoContainer = styled.div`
    ${mobile({ padding: "10px"})}
`;

const Title = styled.h1`
    font-weight: 200;
`;

const Size = styled.h3`
    font-weight: 200;
`;

const Price = styled.span`
    font-weight: 100;
    width: 110%;
    font-size: 20px;
`;


const AddContainer = styled.div`
    margin: 15px;
    width: 50%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    justify-content: space-between;
    ${mobile({ width: "100%"})}
`;

const AmountContainer = styled.div`
    display: flex;
    align-items: center;
    font-weight: 700;
`;

const Amount = styled.span`
    width: 30px;
    height: 30px;
    border-radius: 10px;
    border: 1px solid teal;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0px 5px;
`;

const Button = styled.button`
    padding: 5px;
    border: 2px solid teal;
    background-color: white;
    cursor: pointer;
    font-weight: 500;
    &:hover{
        background-color: #f8f4f4;
    }
`;

const Summary = styled.div`
    flex: 1;
    border: 0.5px solid lightgray;
    border-radius: 10px;
    padding: 20px;
    height: 50vh;
`;

const SummaryTitle = styled.h1`
    font-weight: 200;
`;

const SummaryItem = styled.div`
    margin: 30px 0px;
    display: flex;
    justify-content: space-between;
    font-weight: ${props=>props.type === "total" && "500"};
    font-size: ${props=>props.type === "total" && "24px"};
`;

const SummaryItemText = styled.span``;

const SummaryItemPrice = styled.span``;

const ButtonPay = styled.button`
    width: 100%;
    padding: 10px;
    cursor: pointer;
    background-color: black;
    color: white;
    font-weight: 600;
`;

const Item = () => {
  const [items, setItems] = useState([]);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [amount, setAmount] = useState(items.price);
  const navigate = useNavigate();


  useEffect(() => {

    const getItems = async () => {
        try{
            const res = await axios.get(`http://localhost:5000/api/items/${id}`);
            setItems(res.data);
            setLoading(false);
        }catch(err){
            console.log(err);
        }
    };

    getItems();

},[id])

const handleQuantity = (type) => {
    if(type==="dec"){
        quantity > 1 && setQuantity(quantity-1);
    } else {
        setQuantity(quantity+1);
    }
};

const handleClick = () => {
    setAmount(quantity*items.price);
    window.scroll({
        top: document.body.offsetHeight,
        left: 0, 
        behavior: 'smooth',
    });
}
const payClick = async () => {
    await axios.post(`http://localhost:5000/api/orders/`, {
        itemId: items._id, 
        title: items.title, 
        amount: amount, 
        priceItem: items.price
    })
    alert(`You created a new order! Your outstanding balance: $${amount}`);
    navigate('/');
}
  
return (
    !loading && (
        <Container>
            <ItemWrapper>
                <InfoContainer>
                    <Title>{items.title}</Title>
                    <Size>Size: {items.size}</Size>
                    <Price>Price: $ {items.price}</Price>
                        <AddContainer>
                            <AmountContainer>
                                <Remove onClick={() => handleQuantity("dec")} />
                                <Amount>{quantity}</Amount>
                                <Add onClick={() => handleQuantity("inc")} />
                            </AmountContainer>
                            <Button onClick={handleClick}>Add To Cart</Button>
                        </AddContainer>
                </InfoContainer>
                <Carousel showArrows={true} width="50%" sx={{margin: "100px"}}>
                    { items.img.map((img) => (
                        <img src={img} alt="" />
                ))}
                </Carousel> 
            </ItemWrapper>
            <Cart>
                <Summary>
                       <SummaryTitle>ORDER SUMMARY</SummaryTitle> 
                       <SummaryItem>
                           <SummaryItemText>Subtotal <br/> (For {quantity} units)</SummaryItemText>
                           <SummaryItemPrice>$ {amount}</SummaryItemPrice>
                       </SummaryItem>
                       <SummaryItem>
                           <SummaryItemText>Estimated Shipping</SummaryItemText>
                           <SummaryItemPrice>$ 5.90</SummaryItemPrice>
                       </SummaryItem>
                       <SummaryItem>
                           <SummaryItemText>Shipping Discount</SummaryItemText>
                           <SummaryItemPrice>$ -5.90</SummaryItemPrice>
                       </SummaryItem>
                       <SummaryItem type="total">
                           <SummaryItemText>Total</SummaryItemText>
                           <SummaryItemPrice>$ {amount}</SummaryItemPrice>
                       </SummaryItem>
                       {/* <StripeCheckout
                            name="B. RAND"
                            image="https://avatars.githubusercontent.com/u/1486366?v=4"
                            billingAddress
                            shippingAddress
                            description={`Your total is $${cart.total}`}
                            amount={cart.total*100}
                            token={onToken}
                            stripeKey={KEY}
                       > */}
                           <ButtonPay onClick={payClick}>CHECKOUT NOW</ButtonPay>
{/*                        </StripeCheckout>
 */}                </Summary>
            </Cart>           
        </Container>
        )
    )
}

export default Item