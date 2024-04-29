import React, { useState } from "react";
import AdminMenu from "../adminMenu/AdminMenu";
import "./addProduct.css";
import imageicon from "../../../img/imageicon.jpg";
import { AiOutlineDelete } from "react-icons/ai";
import { CiCamera } from "react-icons/ci";
import {
  HiOutlineShoppingBag as HiMiniShoppingBag,
  HiPlus,
} from "react-icons/hi";
import { MdClose } from "react-icons/md";

const AddProduct = () => {
  const [products, setProducts] = useState([
    {
      mainImage: null,
      productName: "",
      price: "",
      description: "",
      sizes: [],
      colors: [],
    },
  ]);

  const handleProductName = (e, index) => {
    const value = e.target.value;
    const updatedProducts = [...products];
    updatedProducts[index].productName = value;
    setProducts(updatedProducts);
  };

  const handleProductPrice = (e, index) => {
    const value = e.target.value;
    const updatedProducts = [...products];
    updatedProducts[index].price = value;
    setProducts(updatedProducts);
  };

  const handleProductDescription = (e, index) => {
    const value = e.target.value;
    const updatedProducts = [...products];
    updatedProducts[index].description = value;
    setProducts(updatedProducts);
  };

  const handleImage = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedProducts = [...products];
        updatedProducts[index].mainImage = reader.result;
        setProducts(updatedProducts);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = () => {
    setProducts([
      ...products,
      {
        mainImage: null,
        productName: "",
        price: "",
        description: "",
        sizes: [],
        colors: [],
      },
    ]);
  };
  ////////////////// handleDelete
  const handleDelete = (index) => {
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
  };
  /////////////// handleSubmit

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();

    products.forEach((product, index) => {
      formData.append(`name${index}`, product.productName);
      formData.append(`price${index}`, product.price);
      formData.append(`description${index}`, product.description);
      formData.append(`popular${index}`, product.popular ? "Yes" : "No");
      if (product.mainImage) {
        formData.append(`image${index}`, product.mainImage);
      }
    });
    console.log("FormData:", formData);
  };

  /////////////////////// Add Sizes
  const handleSizeInputChange = (e, index) => {
    const { value } = e.target;
    const updatedProducts = [...products];
    updatedProducts[index].currentsizes = value;
    setProducts(updatedProducts);
  };

  const addSizeInput = (index) => {
    const updatedProducts = [...products];
    if (updatedProducts[index].currentsizes.trim() !== "") {
      updatedProducts[index].sizes.push(updatedProducts[index].currentsizes);
      updatedProducts[index].currentsizes = "";
      setProducts(updatedProducts);
    }
  };

  const removeSizeInput = (productIndex, sizeIndex) => {
    const updatedProducts = [...products];
    updatedProducts[productIndex].sizes.splice(sizeIndex, 1);
    setProducts(updatedProducts);
  };

  ////////////////////// Add Colors
  const handleColorInputChange = (e, index) => {
    const { value } = e.target;
    const updatedProducts = [...products];
    updatedProducts[index].currentcolors = value;
    setProducts(updatedProducts);
  };

  const addColorInput = (index) => {
    const updatedProducts = [...products];
    if (updatedProducts[index].currentcolors.trim() !== "") {
      updatedProducts[index].colors.push(updatedProducts[index].currentcolors);
      updatedProducts[index].currentcolors = "";
      setProducts(updatedProducts);
    }
  };

  const removeColorInput = (productIndex, sizeIndex) => {
    const updatedProducts = [...products];
    updatedProducts[productIndex].colors.splice(sizeIndex, 1);
    setProducts(updatedProducts);
  };

  return (
    <>
      <AdminMenu />
      <section id="post">
        <div className="boxcontainerSpan_Box"></div>
        <div className="box_container_product">
          <div className="Box_btn_haed">
            <h3>Add Product</h3>
            <div className="btn_submit">
              <button type="submit" onClick={handleSubmit}>
                Post Product
              </button>
            </div>
          </div>

          <div className="group_container_product">
            {products.map((product, index) => (
              <div key={index}>
                <div className="addProduct_box_content_afterThat">
                  <div
                    className="deleteBox_productconotent"
                    onClick={() => handleDelete(index)}
                  >
                    <AiOutlineDelete />
                  </div>

                  <div className="box_input-img">
                    {product.mainImage ? (
                      <img src={product.mainImage} alt="product" />
                    ) : (
                      <img src={imageicon} alt="default" />
                    )}
                    <input
                      type="file"
                      id={`img-${index}`}
                      onChange={(e) => handleImage(e, index)}
                      required
                    />
                  </div>

                  <div className="edit_images">
                    <label
                      htmlFor={`img-${index}`}
                      className="trigger_popup_fricc"
                    >
                      <CiCamera id="icon_ci_camera" />
                    </label>
                  </div>
                  <div className="box_container_image">
                    <div className="input-box">
                      <div className="box">
                        <input
                          type="text"
                          placeholder="Product Name"
                          value={product.productName}
                          onChange={(e) => handleProductName(e, index)}
                          required
                        />
                      </div>
                      <div className="box">
                        <input
                          type="text"
                          placeholder="Product Price"
                          value={product.price}
                          onChange={(e) => handleProductPrice(e, index)}
                          required
                        />
                      </div>
                      <div className="box">
                        <select
                          name="category"
                          className="product_category"
                          required
                        >
                          <option value="Sneakers">Sneakers</option>
                          <option value="Women Clothes">Women Clothes</option>
                          <option value="Electronic Devices">
                            Electronic Devices
                          </option>
                          <option value="Cosmetics">Cosmetics</option>
                        </select>
                      </div>
                      <div className="box">
                        <input
                          type="text"
                          placeholder="Description"
                          value={product.description}
                          onChange={(e) => handleProductDescription(e, index)}
                          required
                        />
                      </div>

                      <div className="box_size_product_container">
                        <div className="box_size_add">
                          {product.sizes.map((size, sizeIndex) => (
                            <div key={sizeIndex} className="box_size_add_item">
                              <p>{size}</p>
                              <span
                                onClick={() =>
                                  removeSizeInput(index, sizeIndex)
                                }
                              >
                                <MdClose id="icon_MdClose" />
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="box_size_content">
                          <input
                            type="text"
                            placeholder="Add Sizes..."
                            value={product.currentsizes || ""}
                            onChange={(e) => handleSizeInputChange(e, index)}
                          />
                          <div
                            className="btn_addsize"
                            onClick={() => addSizeInput(index)}
                          >
                            Add
                          </div>
                        </div>
                      </div>

                      <div className="box_size_product_container">
                        <div className="box_size_add">
                          {product.colors.map((color, colorIndex) => (
                            <div key={colorIndex} className="box_size_add_item">
                              <p>{color}</p>
                              <span
                                onClick={() =>
                                  removeColorInput(index, colorIndex)
                                }
                              >
                                <MdClose id="icon_MdClose" />
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="box_size_content">
                          <input
                            type="text"
                            placeholder="Add Colors..."
                            value={product.currentcolors || ""}
                            onChange={(e) => handleColorInputChange(e, index)}
                          />
                          <div
                            className="btn_addsize"
                            onClick={() => addColorInput(index)}
                          >
                            Add
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div onClick={handleAdd}>
              <div className="iconimage">
                <HiMiniShoppingBag id="icon_shoppingbag" />
                <HiPlus id="icon_goplus" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AddProduct;
