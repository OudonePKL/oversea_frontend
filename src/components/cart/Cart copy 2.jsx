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

const Cart = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const [cartItems, setCartItems] = useState([]);
  const [show_payment, set_show_payment] = useState(false);
  const navigate = useNavigate();

  const [cart, setCart] = useState(() => {
    const localCart = localStorage.getItem("cart");
    return localCart ? JSON.parse(localCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, color, size, quantity) => {
    const existingProduct = cart.find(
      (item) =>
        item.id === product.id &&
        item.store_name === product.store_name &&
        item.color === color &&
        item.size === size
    );

    if (existingProduct) {
      setCart(
        cart.map((item) =>
          item.id === product.id &&
          item.store_name === product.store_name &&
          item.color === color &&
          item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity, color, size }]);
    }
  };

  const removeFromCart = (id, store_name, color, size) => {
    setCart(
      cart.filter(
        (item) =>
          !(
            item.id === id &&
            item.store_name === store_name &&
            item.color === color &&
            item.size === size
          )
      )
    );
  };

  const updateQuantity = (id, store_name, color, size, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id, store_name, color, size);
    } else {
      setCart(
        cart.map((item) =>
          item.id === id &&
          item.store_name === store_name &&
          item.color === color &&
          item.size === size
            ? { ...item, quantity }
            : item
        )
      );
    }
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  const getTotalPrice = () => {
    return cart.reduce(
      (total, item) => total + item.price * (item.quantity || 0),
      0
    );
  };

  const handlePayment = (store_name) => {
    const storeItems = cart.filter((item) => item.store_name === store_name);
    alert(
      `Payment for ${store_name} completed successfully!\nTotal Price: $${getTotalPriceForStore(
        store_name
      ).toFixed(2)}`
    );
    setCart(cart.filter((item) => item.store_name !== store_name));
  };

  const getTotalPriceForStore = (store_name) => {
    const storeItems = cart.filter((item) => item.store_name === store_name);
    return storeItems.reduce(
      (total, item) => total + item.price * (item.quantity || 0),
      0
    );
  };

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

  console.log("Cart:", cart); // Add this line to debug

  if (!cart) {
    return <div className="cart">Loading...</div>;
  }

  const stores = [...new Set(cart.map((item) => item.store_name))];

  const handlePay = () => {
    set_show_payment(true);
  };

  return (
    <div className="cart">
      <h2>Cart</h2>
      <p>Total Items: {getTotalItems()}</p>
      <p>Total Price: ${getTotalPrice().toFixed(2)}</p>
      {stores.map((store) => (
        <div key={store} className="store">
          <h3>{store}</h3>
          <ul>
            {cart
              .filter((item) => item.store_name === store)
              .map((item, index) => (
                <li
                  key={`${item.id}-${item.store_name}-${index}`}
                  className="cart-item"
                >
                  <span>
                    {item.name} - ${item.price} x {item.quantity} - {item.color}
                    , {item.size}
                  </span>
                  <div>
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          store,
                          item.color,
                          item.size,
                          item.quantity - 1
                        )
                      }
                    >
                      -
                    </button>
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          store,
                          item.color,
                          item.size,
                          item.quantity + 1
                        )
                      }
                    >
                      +
                    </button>
                    <button
                      onClick={() =>
                        removeFromCart(item.id, store, item.color, item.size)
                      }
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
          </ul>
          <button className="payment-btn" onClick={() => handlePayment(store)}>
            Pay ${getTotalPriceForStore(store).toFixed(2)}
          </button>
        </div>
      ))}

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

              {stores.length === 0 ? (
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
                        <p>{getTotalItems}</p>
                      </div>
                      <hr />
                      <div className="box_item_total_text">
                        <h3>Total: </h3>
                        <p>{getTotalPrice}</p>
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
    </div>
  );
};

export default Cart;
