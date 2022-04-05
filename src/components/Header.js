import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    makeStyles,
} from "@material-ui/core";
//   import { Link as RouterLink, useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const useStyles = makeStyles(() => ({
    header: {
        backgroundColor: "#DC143C",
        padding: "0 80px",
    },
    logo: {
        fontFamily: "Work Sans, sans-serif",
        fontWeight: 600,
        display: "flex",
        alignItems: "center",
    },
    menuButton: {
        fontFamily: "Open Sans, sans-serif",
        fontWeight: 700,
        size: "16px",
        marginLeft: "15px",
    },
    toolbar: {
        display: "flex",
        justifyContent: "space-between",
    },
    walletBtn: {
        padding: 0,
        border: "none",
        background: "none",
        cursor: "pointer"
    }
}));

export default function Header() {
    const { header, logo, menuButton, toolbar, walletBtn } = useStyles();
    async function getAccount() {
        if (typeof window.ethereum == 'undefined') {
            alert('MetaMask is not installed!');
            return 0;
        }
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log(accounts);
        const account = accounts[0];
        console.log(window.ethereum.selectedAddress)
        alert("Connected to the Account: "+ window.ethereum.selectedAddress)
    }

    return (
        <div className="navigation">
            <nav className="navbar navbar-expand navbar-dark bg-dark">
                <div className="container">
                    <NavLink className="navbar-brand" to="/">
                        Profile-nft
                    </NavLink>
                    <div>
                        <ul className="navbar-nav ml-auto">
                            <li className={localStorage.getItem('metaMask_token') ? "nav-item" : "d-none"}>
                                <button className={walletBtn} onClick={getAccount} title="Connect to metaMask">
                                    <FontAwesomeIcon icon="fa-solid fa-wallet" size="xl" color="#FFFFFF" />
                                </button>
                            </li>
                            <li className={localStorage.getItem('metaMask_token') ? "" : "d-none"}>
                                <NavLink className="ml-3" to="/myProfile" title="My Profile">
                                    <FontAwesomeIcon icon="fa-solid fa-user" size="xl" color="#FFFFFF" />
                                </NavLink>
                            </li>
                            <li className={!localStorage.getItem('metaMask_token') ? "" : "d-none"}>
                                <NavLink className="ml-3" to="/login" title="Login">
                                    <FontAwesomeIcon icon="fa-solid fa-right-to-bracket" size="xl" color="#FFFFFF" />
                                </NavLink>
                            </li>
                            {/* <li className="nav-item">
                                <NavLink className="nav-link" to="/about">
                                    About
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/contact">
                                    Contact
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/blog">
                                    Blog
                                </NavLink>
                            </li> */}
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
}
