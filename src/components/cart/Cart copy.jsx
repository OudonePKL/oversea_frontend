import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../header/Header";
import Menu from "../menuFooter/Menu";
import productImage from "../../img/productImage.png";
import { AiOutlineDelete } from "react-icons/ai";
import { IoIosArrowBack } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import "./cart.css";
import axios from "axios";
import Payment from "./Payment";

const Cart = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [count, set_count] = useState(1);
  var totalPrice = 0; // for eatch product
  var totalQuantity = 0; // for eatch product
  var allPrice = 0; // Price for all product in the cart
  var allQuantity = 0; // Quantity for all product in the cart

  const [show_payment, set_show_payment] = useState(false);

  var user_id = null;
  if (localStorage.getItem("user")) {
    user_id = JSON.parse(window.localStorage.getItem("user")).user_id;
  }

  useEffect(() => {
    let data = JSON.stringify({
      token: token,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + "/user/check-token",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        if (response.data.result != "success") {
          localStorage.clear();
          navigate("/loginuser");
          return;
        }
      })
      .catch((error) => {
        localStorage.clear();
        console.log(error);
        navigate("/loginuser");
        return;
      });
  }, [token]);

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems"));
    if (storedCartItems) {
      setCartItems(storedCartItems);
    }
  }, []);

  const editCartItemQuantity = (productId, newQuantity) => {
    const updatedCart = cartItems.map((item) => {
      if (item.product.id === productId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };

  const removeCartItem = (productId) => {
    const updatedCart = cartItems.filter(
      (item) => item.product.id !== productId
    );
    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };

  const CartItem = ({ item }) => {
    const handleDecrease = () => {
      const newQuantity = Math.max(1, item.quantity - 1); // Ensure quantity doesn't go below 1
      editCartItemQuantity(item.product.id, newQuantity);
    };

    const handleIncrease = () => {
      const newQuantity = item.quantity + 1;
      editCartItemQuantity(item.product.id, newQuantity);
    };

    const handleRemove = () => {
      removeCartItem(item.product.id);
    };

    return (
      // <div className="cart-item">
      //   <div>{item.product.name}</div>
      //   <div>Price: ${item.price}</div>
      //   <div>
      //     Quantity: {item.quantity}
      //     <button onClick={handleDecrease}>-</button>
      //     <button onClick={handleIncrease}>+</button>
      //     <button onClick={handleRemove}>Remove</button>
      //   </div>
      // </div>
      <div className="box_icon_order">
        <div className="btnicon_delete_order">
          <AiOutlineDelete
            id="btnicon_delete"
            onClick={handleRemove}
          />
        </div>
        <div className="box_item_icon">
          <div className="icon_minus_plus" onClick={handleDecrease}>
            -
          </div>
          <span>{item.quantity}</span>
          <div className="icon_minus_plus" onClick={handleIncrease}>
            +
          </div>
        </div>
      </div>
    );
  };

  const handlePay = () => {
    set_show_payment(true);
  };

  const orderitems = [
    {
      user: user_id,
      items: cartItems,
    },
  ];

  console.log("Cart items: ", cartItems);
  console.log(orderitems);

  return (
    <>
      {show_payment ? (
        <Payment orders={orderitems} order_from="cart" onPay={handlePay} />
      ) : (
        <>
          <Header />
          <div className="box_cart_container">
            <Link to="/" className="box_container_back_icons_back">
              <IoIosArrowBack id="icons_back" />
              <p>Back</p>
            </Link>

            {cartItems.length === 0 ? (
              <p className="no-reviews-message">No Product</p>
            ) : (
              <div>
                <div>
                  {cartItems.map((item) => (
                    <div className="box_item_gourp" key={item.id}>
                      <div className="box_item_image">
                        <img src={item.product.images} alt="" />
                        <div className="box_item_text">
                          <p>name: {item.product.name}</p>
                          <p>color: {item.color}</p>
                          <p>size: {item.size}</p>
                          <p>
                            price{" "}
                            {parseFloat(item.price).toLocaleString("en-US", {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                              useGrouping: true,
                            })}
                          </p>
                          <p hidden>
                            {(totalPrice += item.price * item.quantity)}
                          </p>
                          <p hidden>{(allQuantity += item.quantity)}</p>
                        </div>
                        {/* <div className="box_icon_order">
                          <div className="btnicon_delete_order">
                            <AiOutlineDelete
                              id="btnicon_delete"
                              onClick={() => {
                                DeleteProduct(item.id);
                              }}
                            />
                          </div>
                          <div className="box_item_icon">
                            <div className="icon_minus_plus" onClick={handleDecrease}>-</div>
                            <span>{item.quantity}</span>
                            <div className="icon_minus_plus" onClick={handleIncrease}>+</div>
                          </div>
                        </div> */}
                        <CartItem key={item.product.id} item={item} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="box_item_total">
                  <div className="cart_Total_box">
                    <h3>Cart Total</h3>
                    <div className="box_item_total_text">
                      <p>Quantity:</p>
                      <p>{allQuantity}</p>
                    </div>
                    <hr />
                    <div className="box_item_total_text">
                      <h3>Total: </h3>
                      <p>
                        {" "}
                        {parseFloat((allPrice = totalPrice)).toLocaleString(
                          "en-US",
                          {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                            useGrouping: true,
                          }
                        )}{" "}
                        Kip
                      </p>
                    </div>
                    <div className="btn">
                      <button onClick={handlePay} className="checkout_btn">
                        Checkout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* {cart_items.items.map((item) => (
          <div className="box_container_cart" key={item.id}>
            <div className="box_item_gourp">
              <div className="box_item_image">
                <img src={""} alt={`Product`} />
                <div className="box_item_text">
                  <p>name {item.product}</p>
                  <p>color {item.color}</p>
                  <p>size {item.size}</p>
                  <p>price Kip</p>
                </div>
                <div className="box_icon_order">
                  <div className="btnicon_delete_order">
                    <AiOutlineDelete id="btnicon_delete" />
                  </div>
                  <div className="box_item_icon">
                    <div className="icon_minus_plus">-</div>
                    <span>{0}</span>
                    <div className="icon_minus_plus">+</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="box_item_total">
              <div className="cart_Total_box">
                <h3>Cart Total</h3>
                <div className="box_item_total_text">
                  <p>Quantity:</p>
                  <p>{0}</p>
                </div>
                <hr />
                <div className="box_item_total_text">
                  <h3>Total: </h3>
                  <p>{0} Kip</p>
                </div>
                <div className="btn">
                  <button type="submit" className="checkout_btn">
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))} */}
          </div>
          <Menu />
        </>
      )}
    </>
  );
};

export default Cart;
