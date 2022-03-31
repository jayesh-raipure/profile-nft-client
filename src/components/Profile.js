import React, { useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

function Profile() {
    const [profileData, setData] = useState({});
    const creatProfile = async (e) => {
        e.preventDefault();
        let myForm = document.getElementById('myForm');
        // let formData = new FormData(myForm);
        console.log("form submit!", myForm.elements['gender'].value)
        const updatedData = {
            candidate_name: `${myForm.elements['first_name'].value} ${myForm.elements['last_name'].value}`,
            current_company: myForm.elements['current_company'].value,
            current_ctc: myForm.elements['current_ctc'].value,
            education: myForm.elements['education'].value,
            email: myForm.elements['email'].value,
            phone: myForm.elements['phone'].value,
            first_name: myForm.elements['first_name'].value,
            last_name: myForm.elements['last_name'].value,
            technologies: myForm.elements['technologies'].value,
            gender: myForm.elements['gender'].value,
            experience: myForm.elements['experience'].value
        }

        if(profileData.resume_id){
            // update the profile
            await axios
            .put(`http://localhost:5000/api/updateAsset/${profileData.resume_id}`,updatedData )
            .then((res) => {
                if (res.data) {
                    console.log("Success:", res.data);
                }
            })
            .catch((error) => {
                console.error("Error:", error?.response?.data);
            });
            alert("Profile updated successfully!");
            window.location = "/myProfile"
        } else{
            let unique_id = `${myForm.elements['first_name'].value}_${myForm.elements['last_name'].value}_${uuidv4()}`
            updatedData.id = unique_id;
            updatedData.resume_id = unique_id;
            updatedData.owner = `${myForm.elements['first_name'].value} ${myForm.elements['last_name'].value}`
            updatedData.docType = "asset"
            updatedData.metaMask_token =  window.ethereum.selectedAddress

            console.log(updatedData);

            await axios
            .post(`http://localhost:5000/api/createAsset`,updatedData )
            .then((res) => {
                if (res.data) {
                    console.log("Success:", res.data);
                }
            })
            .catch((error) => {
                console.error("Error:", error?.response?.data);
            });

            alert("Profile created successfully!")
            window.location = "/myProfile"
        }
        
    }

    useEffect(() => {
        getProfileData();
    }, {});

    const onChangeValue = (event)=> {
        console.log(event.target.value);
        profileData.gender = event.target.value;
        setData({...profileData});
    }
        

    const getProfileData = async () => {
        // get profile data by wallet id
        const walletId = localStorage.getItem("metaMask_token")
        console.log(walletId);
        await axios
            .get(`http://localhost:5000/api/getProfile/${walletId}`)
            .then((res) => {
                if (res.data) {
                    setData(res.data);
                    console.log("Success:", res.data);
                }
            })
            .catch((error) => {
                console.error("Error:", error?.response?.data);
            });
    }

    return (
        <div className="home">
            <div class="container">
                <div class="row justify-content-center my-5">
                    <form onSubmit={creatProfile} id="myForm">
                        <div class="form-group">Profile Details:</div>
                        <div class="form-group">
                            <label for="first_name">First Name:</label>
                            <input type="text" class="form-control" id="First Name" value={profileData.first_name} name="first_name" />
                        </div>
                        <div class="form-group">
                            <label for="last_name">Last Name:</label>
                            <input type="text" class="form-control" id="last name" value={profileData.last_name} name="last_name" />
                        </div>
                        <div class="form-group">
                            <label for="email">Email address:</label>
                            <input type="email" class="form-control" id="email" name="email" value={profileData.email} />
                        </div>
                        <div class="form-group">
                            <label for="phone">Phone:</label>
                            <input type="tel" class="form-control" id="phone" name="phone" value={profileData.phone} />
                        </div>
                        <div class="form-group">
                            <label for="phone">Gender:</label>
                            <div class="form-check-inline">
                                <label class="form-check-label">
                                    <input type="radio" class="form-check-input" name="gender" value="male" checked={profileData.gender === "male"} onChange={onChangeValue} />Male
                                </label>
                            </div>
                            <div class="form-check-inline">
                                <label class="form-check-label">
                                    <input type="radio" class="form-check-input" name="gender" value="female" checked={profileData.gender === "female"} onChange={onChangeValue} />Female
                                </label>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="current_company">Current Company:</label>
                            <input type="text" class="form-control" id="current_company" name="current_company" value={profileData.current_company} />
                        </div>
                        <div class="form-group">
                            <label for="current_ctc">Current CTC:</label>
                            <input type="text" class="form-control" id="current_ctc" name="current_ctc" value={profileData.current_ctc} />
                        </div>
                        <div class="form-group">
                            <label for="technologies">Technologies:</label>
                            <input type="text" class="form-control" id="technologies" name="technologies" value={profileData.technologies} />
                        </div>
                        <div class="form-group">
                            <label for="experience">Total Experience:</label>
                            <input type="text" class="form-control" id="experience" name="experience" value={profileData.experience} />
                        </div>
                        <div class="form-group">
                            <label for="education">Education:</label>
                            <input type="text" class="form-control" id="education" name="education" value={profileData.education} />
                        </div>
                        <button type="submit" class="btn btn-primary">{profileData.resume_id === undefined ? "Create Profile" : "Update Profile"}</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Profile;