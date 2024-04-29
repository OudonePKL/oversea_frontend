import React, { useState, useEffect } from "react";
import "./orderBill.css";
import AdminMenu from "../adminMenu/AdminMenu";
import { useLocation } from "react-router-dom";
import { FaAngleLeft } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const OrderBill = () => {
  const token = localStorage.getItem("token");
  const order_id = useParams().bill_id;
  const [order_list, setOrderList] = useState([]);
  const [name, set_name] = useState("");
  const [email, set_email] = useState("");
  const [china_url, set_china_url] = useState("");
  const [lao_url, set_lao_url] = useState("");
  const goBack = () => {
    window.history.back();
  };

  const navigate = useNavigate();

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
      url: import.meta.env.VITE_API + `/store/order/${order_id}`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response.data);
        setOrderList(response.data);
        set_name(response.data.user.name);
        set_email(response.data.user.email);
        set_china_url(response.data.china_url);
        set_lao_url(response.data.lao_url);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, [order_id]);

  const ConfirmOrder = (e) => {
    e.preventDefault();

    let data = "";
    if (order_list.status == "Pending") {
      data = JSON.stringify({
        status: "Processing",
      });
    } else if (order_list.status == "Processing") {
      data = JSON.stringify({
        status: "Shipped",
      });
    } else if (order_list.status == "Shipped") {
      data = JSON.stringify({
        status: "Delivered",
      });
    } else if (order_list.status == "Delivered") {
      data = JSON.stringify({
        status: "Delivered",
      });
    } else {
      data = JSON.stringify({
        status: "Delivered",
      });
    }

    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + `/store/order/update/${order_id}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        // console.log(JSON.stringify(response.data));
        // alert(JSON.stringify(response.data));
        // if (response.data.message == "success") {
        //   // alert(response.data.message);

        // }
        if (order_list.status == "Pending") {
          alert("This order has been received.");
          navigate("/order/pending");
        } else if (order_list.status == "Processing") {
          alert("This order has been processed");
          navigate("/order/processing");
        } else if (order_list.status == "Shipped") {
          alert("This order has been shipped.");
          navigate("/order/shipped");
        } else if (order_list.status == "Delivered") {
          alert("This order has been delivered.");
          navigate("/order/delivered");
        } else {
          alert("This order has been delivered.");
          navigate("/order/delivered");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  console.log("china_url ", china_url);
  console.log("lao_url ", lao_url);

  const ChangeChinaURL = (e) => {
    e.preventDefault();
    let data = JSON.stringify({
      china_url: china_url,
    });

    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url:
        import.meta.env.VITE_API + `/store/order/update/china-url/${order_id}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        alert("China URL has been added.");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const ChangeLaoURL = (e) => {
    e.preventDefault();
    let data = JSON.stringify({
      lao_url: lao_url,
    });

    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + `/store/order/update/lao-url/${order_id}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        // console.log(JSON.stringify(response.data));
        alert("Lao URL has been added.");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <AdminMenu />
      <section id="abill">
        <div className="abill-detial">
          <div className="container_Order_Bill">
            <Link to={goBack} className="back_Order_Bill">
              <FaAngleLeft id="box_icon_Back" />
              <p>Back</p>
            </Link>
            <h2>Order</h2>
            <div></div>
          </div>
          <div className="aguopoidHead">
            <div className="aidf">
              <p>OrderID: {order_list.id}</p>
              <p>User: {name || email}</p>
            </div>
          </div>
          <hr />
          <div className="abillGopBox">
            <table>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Amount</th>
                  <th>Color</th>
                  <th>Size</th>
                </tr>
              </thead>
              {order_list.items &&
                order_list.items.map((item) => (
                  <tbody key={item.id}>
                    <tr>
                      <td>{item.product.name}</td>
                      <td>
                        $
                        {parseFloat(item.price).toLocaleString("en-US", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                          useGrouping: true,
                        })}
                      </td>
                      <td>{item.quantity}</td>
                      <td>{item.color}</td>
                      <td>{item.size}</td>
                    </tr>
                  </tbody>
                ))}
            </table>
          </div>
          <hr />
          <div className="atitlePrice">
            <h3>Total:</h3>
            <h3>${order_list.total_prices}</h3>
          </div>
          <div className="aplace-on">
            <p>
              Payment date: {new Date(order_list.created_at).toLocaleString()}
            </p>
            <p>Payment method: Transfer</p>
            <p>Account name: {order_list.account_name}</p>
            <p>Status: {order_list.status}</p>
            <p>
              Delivery: {order_list.shipping_company}, Province:{" "}
              {order_list.province}, Destrict: {order_list.district}, Branch:{" "}
              {order_list.branch}
            </p>
            <form>
              {order_list.status === "Processing" && (
                <div className="status">
                  <div className="url">
                    <label htmlFor="chinaToLaoURL">url China to Lao:</label>
                    <input
                      type="text"
                      id="chinaToLaoURL"
                      name="chinaToLaoURL"
                      placeholder="url delivery from china"
                      value={china_url}
                      onChange={(e) => set_china_url(e.target.value)}
                    />
                    <button onClick={ChangeChinaURL}>add</button>
                  </div>
                  {/* <div className="url">
                    <label htmlFor="branTobranURL">url Bran to Bran:</label>
                    <input
                      type="text"
                      id="branTobranURL"
                      name="branTobranURL"
                      placeholder="url delivery bran to bran"
                      value={lao_url}
                      onChange={(e) => set_lao_url(e.target.value)}
                    />
                    <button onClick={""}>add</button>
                  </div> */}
                </div>
              )}

              {order_list.status === "Shipped" && (
                <div className="status">
                  <div className="url">
                    <label htmlFor="chinaToLaoURL">url China to Lao:</label>
                    <input
                      type="text"
                      id="chinaToLaoURL"
                      name="chinaToLaoURL"
                      placeholder="url delivery from china"
                      value={china_url}
                      onChange={(e) => set_china_url(e.target.value)}
                    />
                    <button onClick={ChangeChinaURL}>add</button>
                  </div>
                  <div className="url">
                    <label htmlFor="branTobranURL">url Bran to Bran:</label>
                    <input
                      type="text"
                      id="branTobranURL"
                      name="branTobranURL"
                      placeholder="url delivery bran to bran"
                      value={lao_url}
                      onChange={(e) => set_lao_url(e.target.value)}
                    />
                    <button onClick={ChangeLaoURL}>add</button>
                  </div>
                </div>
              )}

              {order_list.status === "Delivered" && (
                <div className="status">
                  <div className="url">
                    <label htmlFor="chinaToLaoURL">url China to Lao:</label>
                    <input
                      type="text"
                      id="chinaToLaoURL"
                      name="chinaToLaoURL"
                      placeholder="url delivery from china"
                      value={china_url}
                      onChange={(e) => set_china_url(e.target.value)}
                    />
                    <button onClick={ChangeChinaURL}>add</button>
                  </div>
                  <div className="url">
                    <label htmlFor="branTobranURL">url Bran to Bran:</label>
                    <input
                      type="text"
                      id="branTobranURL"
                      name="branTobranURL"
                      placeholder="url delivery bran to bran"
                      value={lao_url}
                      onChange={(e) => set_lao_url(e.target.value)}
                    />
                    <button onClick={ChangeLaoURL}>add</button>
                  </div>
                </div>
              )}

              <div className="status btn">
                {/* <button type="submit" className="aplace_form_button ">
                  Confirm
                </button> */}

                {order_list.status !== "Delivered" && (
                  <button
                    type="submit"
                    className="aplace_form_button "
                    onClick={ConfirmOrder}
                  >
                    Confirm
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default OrderBill;
