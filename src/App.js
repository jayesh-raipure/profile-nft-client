import React, { forwardRef, useEffect, useState } from "react";
import "./Font-Awesome";
// import Header from "./components/Header";
// import Login from "./components/Login";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./basic-style.css";
import axios from "axios";
import MaterialTable from "material-table";
import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import VisibilityIcon from '@material-ui/icons/Visibility';

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
  VisibilityIcon: forwardRef((props, ref) => <VisibilityIcon {...props} ref={ref} />),
};

function App() {
  const [data, setData] = useState([]);
  async function getContactDetails(rowData) {
    console.log(rowData);
    if (!window.ethereum || !window.ethereum.selectedAddress) {
      alert("Please connect to MetaMask first, click on 'Enable Ethereum' Button");
      return 0;
    }

    let result = null;
    // check if the current resume is own by the looged in user.
    if (window.ethereum.selectedAddress == rowData.metaMask_token) {
      result = await axios
        .get(`http://localhost:5000/api/getAsset/${rowData.id}`)
        .then((res) => {
          console.log(res.data);
          return res.data;
        }).catch((e) => {
          console.log(e);
        });
    } else {
      // check if user already has the access to requested resume
      result = await axios
        .get(`http://localhost:5000/api/checkAccess/${window.ethereum.selectedAddress}/${rowData.id}`)
        .then((res) => {
          console.log(res.data);
          return res.data;
        }).catch((e) => {
          console.log(e);
        });

      console.log("Result --", result);
      if (Object.keys(result).length == 0) {
        const transactionParameters = {
          nonce: '0x00', // ignored by MetaMask
          // gasPrice: '0x09184e72a000', // customizable by user during MetaMask confirmation.
          // gas: '0x00', // customizable by user during MetaMask confirmation.
          to: rowData.metaMask_token,//'0x0000000000000000000000000000000000000000', // Required except during contract publications.
          from: window.ethereum.selectedAddress, // must match user's active address.
          value: '0x00', // Only required to send ether to the recipient from the initiating external account.
          data:
            '0x7f7465737432000000000000000000000000000000000000000000000000000000600057', // Optional, but used for defining smart contract creation and interaction.
          chainId: '0x3', // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
        };

        // txHash is a hex string
        // As with any RPC call, it may throw an error
        const txHash = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [transactionParameters],
        }).catch((error) => {
          console.log(error)
          alert(error.message);
          return null;
        });

        console.log(txHash);
        if (txHash != null) {
          // after successful payment, provide the access of candidate contact details to recruiter for limited time
          result = await axios
            .post("http://localhost:5000/api/storePayment", {
              payee_id: rowData.metaMask_token, //"0x0000000000000000000000000000000000000000",
              payeer_id: window.ethereum.selectedAddress,
              amount: 0,
              resume_id: rowData.resume_id
            })
            .then((res) => {
              console.log(res);
              return res.data;
            }).catch((e) => {
              console.log(e);
            })
        }
      }
    }

    if (Object.keys(result).length != 0) {
      const index = data.findIndex((value) => value.id === result.id);

      const dummy = [...data];
      dummy[index].contact_details = (<>
        <div style={{ display: "grid" }}>
          <span>Phone: {result.phone}</span>
          <span>Email: {result.email}</span>
        </div>
      </>);
      setData([...dummy]);
    }
  }
  useEffect(() => {
    getAllAssets();
  }, []);

  const getAllAssets = () => {
    // let metaMask_id = null;

    axios
      .get("http://localhost:5000/api/getAllAsset")
      .then((res) => {
        setData(res.data);
        console.log("Success:", res.data);
      })
      .catch((error) => {
        console.error("Error:", error?.response?.data);
      });
  };
  return (
    <>
      <div style={{ margin: "90px 15px" }}>
        <MaterialTable
          title="Candidates' List" icons={tableIcons}
          columns={[
            { title: "Name", field: "candidate_name" },
            { title: "Education", field: "education" },
            { title: "Current Company", field: "current_company" },
            { title: "Current CTC", field: "current_ctc" },
            {
              title: "Technologies",
              field: "technologies",
            },
            {
              title: "Contact Details",
              field: "contact_details",
            }
          ]}
          data={data}
          actions={[
            {
              icon: tableIcons.VisibilityIcon,
              tooltip: "View Contact",
              onClick: (event, rowData) => getContactDetails(rowData),
            },
            // {
            //   icon: tableIcons.Edit,
            //   tooltip: "Edit Resume",
            //   // onClick: (event, rowData) => getContactDetails(rowData),
            // }
          ]}
          options={{
            actionsColumnIndex: -1
          }}
        />
      </div>
    </>
  );
}

export default App;