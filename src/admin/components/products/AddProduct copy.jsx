import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Link, useNavigate, useParams } from "react-router-dom";
import AdminMenu from "../adminMenu/AdminMenu";
import axios from "axios";
import { FaAngleLeft } from "react-icons/fa";
import { CiImageOn } from "react-icons/ci";
import { IoIosClose } from "react-icons/io";

import "./addProduct.css";
const AddProduct = () => {

  const [product, setProduct] = useState({
    name: "",
    price: "",
    category: "name1",
    description: "",
    // image: [],
    // image_details: [],
    // sizes: [],
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSizeInputChange = (e) => {
    const { value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      currentsizes: value,
    }));
  };

  const addSizeInput = () => {
    if (product.currentsizes.trim() !== "") {
      setProduct((prevProduct) => ({
        ...prevProduct,
        sizes: [...prevProduct.sizes, prevProduct.currentsizes],
        currentsizes: "", // Reset the current color after adding
      }));
    }
  };

  const removeSizeInput = (index) => {
    if (product.sizes.length > 0) {
      setProduct((prevProduct) => {
        const updatedSizes = [...prevProduct.sizes];
        updatedSizes.splice(index, 1);
        return {
          ...prevProduct,
          sizes: updatedSizes,
        };
      });
    }
  };

  const Addproduct = (e) => {
    e.preventDefault()
    const data = {
      name: product.name,
      price: product.price,
      category: product.category,
      // size: product.sizes,
      desc: product.description,
      // image: product.image,
      // image_desc: product.image_details
    }

    console.log(data)
  }

  ///========================================================================

  const [store, setStore] = useState([])

  const id = 1

  useEffect(() => {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + `/store/${id}`,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    axios
      .request(config)
      .then((response) => {
        setStore(response.data);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }, []);

  ///========================================================================

  const addProduct = (e) => {
    e.preventDefault()
    const data = {
      name: product.name,
      price: product.price,
      category: product.category,
      store_id: id,
      // size: product.sizes,
      desc: product.description,
      // image: product.image,
      // image_desc: product.image_details
    }

    let config = {
      method: "post",
      maxBodyLength: Infinity,

      url: import.meta.env.VITE_API + "/store/setting",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };


    axios
      .request(config)
      // .then((res) => {
      //   navigate("/", { replace: true });
      // })
      .catch((error) => {
        console.log(error);
      });
  };




  return (
    <>
      <AdminMenu />
      <section id="post">
        <div className="goback">
          <Link to="/product-admin" className="box_guopIconbAck">
            <FaAngleLeft id="box_icon_Back" />
            <p>Back</p>
          </Link>
          <form className="box_content_productadmin" onSubmit={Addproduct}>
            <h3>Add product</h3>
            <div className='inputproduct_box'>
              <label >Name:</label>
              <input className="inputproduct" name='name' type="text" placeholder='Product name' onChange={handleInput} required />
            </div>
            <div className='inputproduct_box'>
              <label >Price:</label>
              <input className="inputproduct" name='price' type="text" placeholder='Product price' onChange={handleInput} required />
            </div>
            <div className='inputproduct_box'>
              <label>Category:</label>
              <select name="category" className="inputproduct select_box" onChange={handleInput} value={product.category} required>
                <option className='option_itemD' value="name1">Name1</option>
                <option className='option_itemD' value="name2">Name2</option>
                <option className='option_itemD' value="name3">Name3</option>
              </select>
            </div>
            <div className='inputproduct_box'>
              <label >Description:</label>
              <input className="inputproduct" name='description' type="text" placeholder='Description' onChange={handleInput} required />
            </div>

            {/* <div className="size_product_box">
              <h3>Size:</h3>
              <div className="size_product_box_container">
                <div className="box_sizeTso_add" >
                  {product.sizes.map((size, index) => (
                    <div className="box_sizeTo_add_item" key={index}>
                      <p>{size}</p>
                      <span
                        className="spanCancelBox"
                        onClick={() => removeSizeInput(index)}
                      >
                        <IoIosClose className='iconn_close_addSize' />
                      </span>
                    </div>
                  ))}
                </div>

                <div className="size_content_box">
                  <input
                    className="inputproduct"
                    type="text"
                    placeholder='Add Size...'
                    onChange={handleSizeInputChange}
                    required
                  />
                  <div className="addsize_btn" onClick={addSizeInput}>
                    Add
                  </div>
                </div>
              </div>
            </div> */}

            {/* <div className="add_img_product_box">
              <h3>Product image:</h3>
              <div className="boxicon_img_input">
                <CiImageOn className='boxicon_img_iconn' />
                <input type="file" name='image' className="input" onChange={handleInput} required />
              </div>
            </div>*/}

            <div className="add_img_product_box">
              <h3>Details image:</h3>
              <div className="boxicon_img_input">
                <CiImageOn className='boxicon_img_iconn' />
                <input type="file" name='image_details' className="input" onChange={handleInput} required />
              </div>
            </div> 

            <button type="submit" className="btn_save_productadmin">
              Add
            </button>

          </form>
        </div>
      </section>
    </>
  );
};

export default AddProduct;
