import React, { useEffect, useState } from "react";
import "./header.css";
import { HiOutlineBuildingStorefront } from "react-icons/hi2";
import { FaMagnifyingGlass, FaCartShopping, FaRegUser } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import Logo1 from "../../img/Logo1.png";
import axios from "axios";

const Header = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const [logo, set_logo] = useState(null);
  const storage = JSON.parse(window.localStorage.getItem("user"));
  const navigate = useNavigate();
  const [search, set_search] = useState("");
  var store_id = false;
  if (localStorage.getItem("user")) {
    store_id = JSON.parse(window.localStorage.getItem("user")).store_id;
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
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/");
          return;
        }
      })
      .catch((error) => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        console.log(error);
      });
  }, [token]);

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + "/store/web-info",
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        set_logo(response.data[0].logo);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [logo]);


  function OnSearch(e) {
    e.preventDefault();
    let data = JSON.stringify({
      search: search,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + "/api/search",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <>
      <section id="header">
        <div className="navbar">
          <div className="headWithBox">
            <div className="headMenu">
              <div className="logo1">
                <Link to="/">
                  <img src={logo} alt="Logo" />
                </Link>
              </div>
              <div className="boxLiMenu">
                <div className="linkLi">
                  <Link to="/" className="link active">
                    Home
                  </Link>
                  <Link to="#" className="link ">
                    Chat
                  </Link>
                  <Link to="/order" className="link ">
                    Orders
                  </Link>
                </div>
              </div>
            </div>

            <div className="ulHead_box">
              <form className="search_wrap search_wrap_2" onSubmit={OnSearch}>
                <div className="search_box">
                  <div className="btn_common">
                    <FaMagnifyingGlass className="iconSearch" />
                  </div>
                  <input
                    id="search"
                    type="text"
                    value={search}
                    className="input_search_heaederr"
                    placeholder="search..."
                    onChange={(e) => {
                      set_search(e.target.value);
                    }}
                  ></input>
                </div>
              </form>

              {user && (
                <div className="right_ofHeadBox">
                  <div className="boxsearchContainer">
                    <Link to="/cart">
                      <FaCartShopping className="head_colorr" />
                    </Link>
                  </div>
                  <div className="userAndstore">
                    <Link to="/more">
                      <FaRegUser className="head_colorr" />
                    </Link>
                  </div>
                  {storage.store_id !== false && (
                    <div className="userAndstore">
                      <Link to={`/dashboard`}>
                        <HiOutlineBuildingStorefront className="head_colorr" />
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {!user && (
                <div className="right_ofHeadBox">
                  <div className="boxsearchContainer">
                    <Link to="/cart">
                      <FaCartShopping className="head_colorr" />
                    </Link>
                  </div>
                  <div className="userAndstore">
                    <Link to="/loginuser">Login</Link>
                  </div>
                </div>
              )}

              {/* {user ? (
                <div className="right_ofHeadBox">
                  <div className="boxsearchContainer">
                    <Link to="/cart">
                      <FaCartShopping className="head_colorr" />
                    </Link>
                  </div>

                  <div className="userAndstore">
                    <Link to={`/stores`}>
                      <HiOutlineBuildingStorefront className="head_colorr" />
                    </Link>
                  </div>

                  <div className="userAndstore">
                    <Link to="/more">
                      <FaRegUser className="head_colorr" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="right_ofHeadBox">
                  <div className="boxsearchContainer">
                    <Link to="/cart">
                      <FaCartShopping className="head_colorr" />
                    </Link>
                  </div>
                  <div className="userAndstore">
                    <Link to="/loginuser">Login</Link>
                  </div>
                </div>
              )} */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Header;
