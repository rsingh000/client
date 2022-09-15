import React, { useState, useEffect } from 'react'
import axios from 'axios';
import '../styles/order.css';
import { Link } from 'react-router-dom';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const removeOrder = async (id) => {
        try{
            await axios.delete(`http://localhost:5000/api/orders/${id}/delete`);
            alert(`Order has been deleted!`);
            window.location.reload(false);
        }catch(err){
            console.log(err);
        }
    };

    const renderHeader = () => {
        let headerElement = ['ItemID', 'Title', 'Amount', 'PriceItem', 'Delete']
    
        return headerElement.map((key, index) => {
          return <th key={index}>{key.toUpperCase()}</th>
        })
    }

    const renderBody = () => {
        return (
          orders &&
          orders.map(({ itemId, title, amount, priceItem }) => {
            return (
              <tr key={itemId}>
                <td>{itemId}</td>
                <td>{title}</td>
                <td>{amount}</td>
                <td>{priceItem}</td>
                <td className="operation">
                  <button className="button" onClick={() => removeOrder(itemId)}>
                    Delete
                  </button>
                </td>
              </tr>
            )
          })
        )
    }

    useEffect(() => {
   
        const getOrders = async () => {
            try{
                const res = await axios.get(`http://localhost:5000/api/orders/`);
                setOrders(res.data);
                setLoading(false);
            }catch(err){
                console.log(err);
            }
        };
    
        getOrders();
    }, [])
 
    return (
        !loading && (
            <>
                <h1 id="title">Orders List</h1>
                <table id="order">
                    <thead>
                        <tr>{renderHeader()}</tr>
                    </thead>
                    <tbody>{renderBody()}</tbody>
                </table>
                <Link to="/items/63217288d2293022d15569f4">Create a New Order Here</Link>
            </>
        )
    )
}

export default Orders