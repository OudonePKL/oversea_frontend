import React, { useState, useEffect } from "react";
import "./order.css";
import Header from "../header/Header";
import Menu from "../menuFooter/Menu";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import axios from "axios";

const Order = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  // const user_id = JSON.parse(window.localStorage.getItem("user")).user_id;
  const navigate = useNavigate();

  const [order_list, set_order_list] = useState([]);
  const [display_order, set_display_order] = useState([]);
  const [show_all_order, set_show_all_order] = useState(false);

  var user_id = "";
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
    let data = JSON.stringify({
      user: 1,
      items: [],
    });

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + `/store/user/${user_id}/order`,
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
        set_order_list(sortedReviews);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [user_id]);

  // Update displayed orders when the orders or show_all_order state changes
  useEffect(() => {
    if (show_all_order) {
      set_display_order(order_list);
    } else {
      set_display_order(order_list.slice(0, 3));
    }
  }, [order_list, show_all_order]);

  const handleToggleOrders = () => {
    set_show_all_order(!show_all_order);
  };

  return (
    <>
      <Header />
      <section id="container_order_item">
        <div className="container_order_all">
          <Link to="/" className="box_management_iconnback">
            <IoIosArrowBack id="icons_back" />
            <p>Back</p>
          </Link>
          <h2>Order</h2>

          {display_order.length === 0 ? (
            <p className="no-reviews-message">No Order</p>
          ) : (
            display_order.map((item) => (
              <Link
                to={`/bill/${item.id}`}
                key={item.id}
                className="box_item_order"
              >
                <div className="box_item_order_text">
                  <p>ID: {item.id}</p>
                  <p>Status: {item.status}</p>
                </div>
                <div className="txtheadeproductorder">
                  <p>Date Time: {new Date(item.created_at).toLocaleString()}</p>
                </div>
              </Link>
            ))
          )}

          {/* <Link to="/bill" className="box_item_order">
              <div>
                <p className="txtheadeproductorder">No!</p>
              </div>
            </Link> */}
        </div>

        {order_list.length > 3 && (
          <div className="btn_show_more">
            <button
              className="toggle-reviews-button"
              onClick={handleToggleOrders}
            >
              {show_all_order ? "Show Less" : "Show More"}
            </button>
          </div>
        )}
      </section>
      <Menu />
    </>
  );
};

export default Order;
