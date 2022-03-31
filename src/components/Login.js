import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function Login() {
    useEffect(() => {
        checkLogin();
    }, {});

    const checkLogin = () => {
        if(localStorage.getItem('metaMask_token')){
            window.location = "/"
        }
    }
    const login = async (e) => {
        e.preventDefault();
        console.log("form submit!")

        if (typeof window.ethereum == 'undefined') {
            alert('MetaMask is not installed!');
            return 0;
        }

        if (!window.ethereum || !window.ethereum.selectedAddress) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                console.log(accounts);
                const account = accounts[0];
                console.log(window.ethereum.selectedAddress)
                if(window.ethereum.selectedAddress){
                    localStorage.setItem('metaMask_token', window.ethereum.selectedAddress);
                    window.location = "/"
                }
            } catch (e) {
                console.log(e.message);
                alert(e.message);
            }
        } else if(window.ethereum.selectedAddress) {
            localStorage.setItem('metaMask_token', window.ethereum.selectedAddress);
            window.location = "/"
        }
    }
    return (
        <div className="home">
            <div class="container">
                <div class="row justify-content-center my-5">
                    <form>
                        <button type="button" onClick={login} class="btn btn-primary"><FontAwesomeIcon icon="fa-solid fa-wallet" size="lg" color="#FFFFFF" />Login</button>
                        <span>Login with MataMask Wallet</span>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;