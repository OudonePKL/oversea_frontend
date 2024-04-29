import { FiPlus } from "react-icons/fi";
import "./payment.css";
import qrcode from "../../img/QRCODE.png";
import wechat from "../../img/WeChat.png";
import Menu from "../menuFooter/Menu";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../header/Header";
import { IoIosArrowBack } from "react-icons/io";
import { FiCopy } from "react-icons/fi";
import { FaAngleLeft } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa";
import { MdArrowBack } from "react-icons/md";
import axios from "axios";

const Payment = ({ product_id, user_id, size, color, price, count, onPay }) => {
  const [tel, set_tel] = useState("");
  const [statement_image, set_statement_image] = useState(null);
  const [province, set_province] = useState("");
  const [district, set_district] = useState("");
  const [shipping_company, set_shipping_company] = useState("");
  const [branch, set_branch] = useState("");

  const handleTel = (e) => {
    const value = e.target.value;
    set_tel(value);
  };
  const handleImage = (e) => {
    set_statement_image(e.target.files[0]);
  };
  const handleProvince = (e) => {
    const value = e.target.value;
    set_province(value);
  };
  const handleDistrict = (e) => {
    const value = e.target.value;
    set_district(value);
  };
  const handleShippingCompany = (e) => {
    const value = e.target.value;
    set_shipping_company(value);
  };
  const handleBranch = (e) => {
    const value = e.target.value;
    set_branch(value);
  };

  // console.log("################################");
  // console.log("product id:", product_id);
  // console.log("user id:", user_id);
  // console.log("size:", size);
  // console.log("color:", color);
  // console.log("price:", price);
  // console.log("quantity:", count);
  // console.log("tel:", tel);
  // console.log("province:", province);
  // console.log("district:", district);
  // console.log("shipping_company:", shipping_company);
  // console.log("branch:", branch);
  // console.log("statement_image:", statement_image);

  const handlePay = () => {
    let data = JSON.stringify({
      user: user_id,
      tel: tel,
      status: "Pending",
      total_prices: price * count,
      province: province,
      district: district,
      shipping_company: shipping_company,
      branch: branch,
      // statement_image: statement_image,
      items: [
        {
          product: product_id,
          quantity: count,
          price: price,
          color: color,
          size: size,
        },
      ],
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + "/api/order/create",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    console.log(JSON.stringify(data));

    axios
      .request(config)
      .then((response) => {
        if (response.data.message === "success") {
          console.log(JSON.stringify(response.data));
          alert("The order has been complated.");
          window.location.reload(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Header />
      <div className="guopBoxPayment_container">
        <h2 className="h2_boxPayment">Payment</h2>
        <div className="adress_payment_content">
          <h3>Details:</h3>
          <div className="details_ProductInPayMentBox">
            <ul>
              <li className="detailsProduct_li">
                <p>Product Name: {product_id}</p>
                <p>Size: {size}</p>
                <p>Color: {color}</p>
                <p>
                  Price: {price} x Quantity: {count}
                </p>
                <p>Amount: {price * count}</p>
              </li>
            </ul>
          </div>
          <h3>Address:</h3>
          <div className="box_address">
            <form className="box_address_input">
              <div className="box">
                <label htmlFor="prov">Contact number:</label>
                <input type="text" id="prov" value={tel} onChange={handleTel} />
              </div>
              <div className="box">
                <label htmlFor="prov">Province:</label>
                <input
                  type="text"
                  id="prov"
                  value={province}
                  onChange={handleProvince}
                />
              </div>
              <div className="box">
                <label htmlFor="city">District:</label>
                <input
                  type="text"
                  id="city"
                  value={district}
                  onChange={handleDistrict}
                />
              </div>
              <div className="box">
                <label htmlFor="companny">Shipping Companny name:</label>
                <input
                  type="text"
                  id="companny"
                  value={shipping_company}
                  onChange={handleShippingCompany}
                />
              </div>
              <div className="box">
                <label htmlFor="branch">Branch:</label>
                <input
                  type="text"
                  id="branch"
                  value={branch}
                  onChange={handleBranch}
                />
              </div>

              {/* <Link to="/payment" className="submit">
                <div className="save">Confirm</div>
              </Link> */}
            </form>
          </div>
          <div className="box_transfer">
            <p className="box_transfer_p_line">
              Please transfer money to this account
            </p>
            <div className="boxaccount_number">
              <div className="boxaccount_number_p">
                <p>Account number</p>
                <p>123435346578589</p>
              </div>
              <FiCopy className="iconnn_copy_account" />
            </div>
          </div>
          <h3>Confirm transfer</h3>
          <div className="box_description">
            <p>Please attach proof of money transfer!</p>
            <div className="image_confirm_transfer">
              <p>Choose image</p>
              <input
                type="file"
                id="img"
                // name="statement_image"
                onChange={handleImage}
              />
            </div>
          </div>
          <Link onClick={handlePay} className="save">
            Confirm
          </Link>
        </div>
      </div>
      <Menu />
    </>
  );
};

export default Payment;
