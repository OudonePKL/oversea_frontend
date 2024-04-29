import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./productDetails.css";
import Header from "../header/Header";
import Menu from "../menuFooter/Menu";
import Payment from "../cart/Payment";

import { IoIosArrowBack } from "react-icons/io";
import { BiStore } from "react-icons/bi";
import icon_star from "../../img/icon_star.png";
import icon_star2 from "../../img/icon_star2.png";
import user from "../../img/user.png";
import productImage from "../../img/productImage.png";
import detailproduct from "../../img/detailproduct.jpg";
import axios from "axios";
import { ToggleButtonGroup, ToggleButton } from "@mui/material";
import { FaLocationDot } from "react-icons/fa6";

function ProductDetails() {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const [store_id, set_store_id] = useState([]);
  const navigate = useNavigate();
  const product_id = useParams().goods_id;
  const [products_list, set_products_list] = useState([]);
  const [reiews_list, set_reviews_list] = useState([]);
  const [sliceNum, set_sliceNum] = useState(8);
  const [category, set_category] = useState(1);
  const storage = JSON.parse(window.localStorage.getItem("user"));

  const [showPayment, setShowPayment] = useState(false);
  const [product, setProduct] = useState(null);
  const [price, set_price] = useState(null);

  const [size, set_size] = useState(null);
  const [color, set_color] = useState(null);
  const [count, set_count] = useState(1);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);
  const [displayedReviews, setDisplayedReviews] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const [cartItems, setCartItems] = useState([]);

  console.log(size);
  console.log(color);
  console.log(count);
  console.log(product);
  console.log(reviews)
  console.log(displayedReviews.length)

  var user_id = null;
  if (localStorage.getItem("user")) {
    user_id = JSON.parse(window.localStorage.getItem("user")).user_id;
  }

  const orderitems = [
    {
      user: user_id,
      items: [
        {
          product: product,
          quantity: count,
          price: price,
          color: color,
          size: size,
        },
      ],
    },
  ];

  console.log(orderitems);

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
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + `/store/detail/${product_id}`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios
      .request(config)
      .then((response) => {
        setProduct(response.data);
        set_price(response.data.price);
        set_store_id(response.data.store_id);
        // console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, [product_id]);

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + `/store/?category=${category}`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios
      .request(config)
      .then((response) => {
        set_products_list(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [category]);

  const handleSizeClick = (sizeName) => {
    set_size(size === sizeName ? null : sizeName);
  };

  const handleColorClick = (sizeName) => {
    set_color(size === sizeName ? null : sizeName);
  };

  const decrease = () => {
    if (count > 1) {
      set_count(count - 1);
    }
  };

  const increase = () => {
    set_count(count + 1);
  };

  const addToCart = (product, count, price, color, size) => {
    if (!color) {
      alert("Please select the color");
      return; // Abort the function if color is null
    }
    if (!size) {
      alert("Please select the size");
      return; // Abort the function if color is null
    }

    const newItem = {
      product,
      quantity: count,
      price,
      color,
      size,
    };

    const updatedCart = [...cartItems, newItem];
    setCartItems(updatedCart);
    // Update localStorage with the new cart items
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    alert("This product has been added to cart.");
    set_color(null);
    set_size(null);
    set_count(1);
  };

  // Function to load cart items from LocalStorage
  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems"));
    if (storedCartItems) {
      setCartItems(storedCartItems);
      console.log("My cart: ", cartItems);
    }
  }, []);

  const handleRatingChange = (value) => {
    setRating(value);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmitReview = (event) => {
    event.preventDefault();
    let data = JSON.stringify({
      product: product_id,
      user: user_id,
      rating: rating,
      comment: comment,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + "/store/review/create",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        window.location.reload(false);
      })
      .catch((error) => {
        console.log(error);
      });

    setRating(0);
    setComment("");
  };
  

  useEffect(() => {
    let data = "";

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + `/store/product/${product_id}/review`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        // console.log(JSON.stringify(response.data));
        const sortedReviews = response.data.sort((a, b) => b.id - a.id);
        setReviews(sortedReviews);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [product_id]); // Fetch reviews when product_id changes

  // Update displayed reviews when the reviews or showAllReviews state changes
  useEffect(() => {
    if (showAllReviews) {
      setDisplayedReviews(reviews);
    } else {
      setDisplayedReviews(reviews.slice(0, 3));
    }
  }, [reviews, showAllReviews]);

  const handleToggleReviews = () => {
    setShowAllReviews(!showAllReviews);
  };

  function StarAVG(value) {
    let star_avg = (value / 5) * 100;
    if (star_avg === 0) {
      star_avg = 100;
    }
    return star_avg;
  }

  const handlePay = () => {
    if (!color) {
      alert("Please select the color");
      return; // Abort the function if color is null
    }
    if (!size) {
      alert("Please select the size");
      return; // Abort the function if color is null
    }
    setShowPayment(true);
  };

  return (
    <>
      {showPayment ? (
        // product_id, user_id, size, color,price, count
        <Payment orders={orderitems} order_from="buy_now" onPay={handlePay} />
      ) : (
        <>
          <Header />
          <div className="contentBody">
            {/* <Link to="/" className="box_container_back_icons_back">
          <IoIosArrowBack id="icons_back" />
          <p>Back</p>
        </Link> */}

            <div className="box_betavinOfob">
              {product ? (
                <div>
                  <form className="boxProduct_deteils">
                    <div className="product-page-img">
                      <img src={product.images} alt="" />
                    </div>
                    <div className="txtContentproduct">
                      <h1 className="txt_nameP">{product.name}</h1>
                      <p className="money_txt">{product.format_price} Kip</p>
                      <p className="txt_description">{product.description}</p>

                      <div className="star">
                        <div
                          className="on"
                          style={{ width: `${StarAVG(product.star_avg)}%` }}
                        ></div>
                      </div>

                      <div className="size_product">
                        <p>Color:</p>
                        {product.colors && (
                          <div className="size">
                            {product.colors.map((color, index) => (
                              <p
                                className="echSize "
                                key={index}
                                onClick={() => handleColorClick(color.name)}
                              >
                                {color.name}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="size_product">
                        <p>Size:</p>
                        {product.sizes && (
                          <div className="size">
                            {product.sizes.map((size, index) => (
                              <p
                                className="echSize"
                                key={index}
                                onClick={() => handleSizeClick(size.name)}
                              >
                                {size.name}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="container_item_icon">
                        <div
                          className="container_minus_plus"
                          onClick={decrease}
                        >
                          -
                        </div>
                        <span>{count}</span>
                        <div
                          className="container_minus_plus"
                          onClick={increase}
                        >
                          +
                        </div>
                      </div>
                      <div className="Count_product">
                        <Link className="echbtn btnBut" onClick={handlePay}>
                          {/* <Link className="echbtn btnBut" to={"/payment"}> */}
                          Buy Now
                        </Link>
                        <Link
                          className="echbtn btnAdd"
                          onClick={() =>
                            addToCart(product, count, price, color, size)
                          }
                        >
                          Add To Cart
                        </Link>
                      </div>
                    </div>
                  </form>
                </div>
              ) : (
                <p>Loading...</p>
              )}
              {/* <div
                style={{ textAlign: "center", width: "60%", margin: "0 auto" }}
              >
                <h1>Leave a Review</h1>
                <div style={{ marginBottom: "20px" }}>
                  {[...Array(5)].map((_, index) => (
                    <span
                      key={index}
                      style={{
                        fontSize: "30px",
                        cursor: "pointer",
                        color: index < rating ? "#FFD700" : "#DDDDDD",
                      }}
                      onClick={() => handleRatingChange(index + 1)}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <form
                  onSubmit={handleSubmitReview}
                  style={{ marginBottom: "20px" }}
                >
                  <textarea
                    rows="4"
                    cols="50"
                    value={comment}
                    onChange={handleCommentChange}
                    placeholder="Write your review here..."
                    style={{ fontSize: "20px" }}
                  />
                  <br />
                  <button type="submit" style={{ fontSize: "20px" }}>
                    Submit Review
                  </button>
                </form>
              </div> */}
              <div className="review-list">
                <h2 className="review-list-title">All Reviews</h2>
                {displayedReviews.length === 0 ? (
                  <p className="no-reviews-message">No reviews available</p>
                ) : (
                  <ul className="reviews">
                    {displayedReviews.map((review) => (
                      <li key={review.id} className="review-item">
                        <h3 className="rating">{review.user.nickname || "null"}:</h3>
                        <p className="comment">{review.comment || "null"}</p>
                        {/* Display other review details as needed */}
                      </li>
                    ))}
                  </ul>
                )}
                {reviews.length > 3 && (
                  <button
                    className="toggle-reviews-button"
                    onClick={handleToggleReviews}
                  >
                    {showAllReviews ? "Show Less" : "Show More"}
                  </button>
                )}
              </div>
            </div>
          </div>
          <h2 className="box_betavinOfob asd2">
            <span className="spennofStyle"> </span>
            More products
          </h2>
          <div className="product-area">
            {products_list.map(
              (i, index) =>
                i.category !== "Food" && (
                  <div className="box-product" key={index}>
                    <Link to={"/goods/" + i.id}>
                      <div className="img">
                        <img src={i.images} alt="image" />
                      </div>
                      <div className="star">
                        <div
                          className="on"
                          style={{ width: `${StarAVG(i.star_avg)}%` }}
                        ></div>
                      </div>
                      <ul className="txtOFproduct2">
                        <li className="name">{i.name}</li>
                        <li className="price">{i.format_price} Kip</li>
                        <li className="desc">{i.description}</li>
                      </ul>
                    </Link>
                  </div>
                )
            )}
          </div>
          <Menu />
        </>
      )}
    </>
  );
}

export default ProductDetails;
