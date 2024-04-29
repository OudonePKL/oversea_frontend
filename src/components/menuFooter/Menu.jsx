import "./menu.css"
import { Link } from "react-router-dom";
import QrdownloadApp from '../../img/QrdownloadApp.png'
import Logo1 from '../../img/Logo1.png'
import { FaCartShopping } from "react-icons/fa6";
import { HiOutlineHome } from "react-icons/hi";
import { BsShop, BsClipboardCheck } from "react-icons/bs";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
const Menu = () => {
    return (
        <section>

            {/*Footer Menu For PC */}

            <footer className="footerBox">
                <div className="footer_Container">
                    <div className="footconentBox">
                        <h3 className="txt_footHead">About</h3>
                        <Link to="/" className="txt_pFoot"><img src={Logo1} alt="" /></Link>
                        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Optio, laudantium?</p>
                    </div>

                    <div className="footconentBox">
                        <h3 className="txt_footHead">Contact us</h3>
                        <p><Link to="/" className="txt_pFoot">Phone: 020 998878788</Link></p>
                        <p><Link to="/" className="txt_pFoot">Phone: 020 998878788</Link></p>
                        <p><Link to="/" className="txt_pFoot">Email: humascot@gmail.com</Link></p>
                        <p><Link to="/" className="txt_pFoot">Address: Asean mall</Link></p>
                    </div>
                    <div className="footconentBox3">
                        <h3 className="txt_footHead txh3">Download App</h3>
                        <div className="foot_contentItem">
                            <img src={QrdownloadApp} alt="QrdownloadApp" />
                            <div className="guop_btndownl">
                                <Link to="/" className="footLink">Play Store</Link>
                                <Link to="/" className="footLink">App Store</Link>
                            </div>
                        </div>
                    </div>
                </div>
                <hr className="hrfoo" />
                <p className="lastFooter">
                    Copyright &#169;
                    TACA 2023
                </p>
            </footer>

            {/* Footer Menu For Mobile */}

            <div className="menubar">
                <Link to="/" className="box-menu active">
                    <span className="iconMenuSpan"><HiOutlineHome /></span><span>Home</span>
                </Link>
                <Link to="/chats" className="box-menu">
                    <span className="iconMenuSpan"><IoChatbubbleEllipsesOutline />
                    </span><span>Chat</span>
                </Link>
                <Link to="/order" className="box-menu">
                    <span className="iconMenuSpan"><BsClipboardCheck /></span><span>Order</span>
                </Link>
                <Link to="/cart" className="box-menu">
                    <span className="iconMenuSpan"><FaCartShopping /></span><span>Cart</span>
                </Link>
            </div>

        </section>
    )
}

export default Menu;