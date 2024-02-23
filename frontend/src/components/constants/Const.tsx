const URL = process.env.BACKEND_IP;



export const MAP_ACCESS_TOKEN = "pk.eyJ1Ijoic2F5YWsxMCIsImEiOiJjbGp2amwwZWIwMXdsM2Vsb2FvMjViYzUwIn0.OlDv7VNB3W_UlYCuh6PpQA"

//TODO:  export const MAP_ACCESS_TOKEN = process.env.MAP_ACCESS_TOKEN;

export const json_header = {
  "Content-type": "application/json",
};

//TODO:  export const backend = `${URL}:8000`;
export const backend = `http://192.168.0.108:8000`;

export const apply_donor = `${backend}/donor/apply/`;

export const verify_token = `${backend}/accounts/token/verify/`;

export const verify_otp = `${backend}/accounts/verify/`;

export const req_login = `${backend}/accounts/login/`;

export const req_signup = `${backend}/accounts/register/`;

export const nearby_donor = `${backend}/donor/nearby/`;

export const user_profile = `${backend}/accounts/profile/`;

export const get_location = `${backend}/accounts/location/`;

export const receiver_history = `${backend}/donation/receiver-history/`;

export const donor_history = `${backend}/donation/donor-history/`;

export const donation_request = `${backend}/donation/request/`;

export const fill_receiver_request = `${backend}/donation/fullfill-donation/receiver/`;

export const donor_apply = `${backend}/donor/apply/`;

export const pending_requests = `${backend}/donation/pending-request-list/`;

export const donor_data = `${backend}/donor/profile/`;

export const fill_donor_request = `${backend}/donation/fullfill-donation/donor/`;

export const update_donation = `${backend}/donation/donation-status-update/`;



// Other Constants

export const blood_groups = ["A+", "B+", "O+", "AB+", "A-", "B-", "O-", "AB-"];


// Database URL will be added later
