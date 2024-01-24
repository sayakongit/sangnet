const URL = process.env.BACKEND_IP;

export const MAP_ACCESS_TOKEN = "pk.eyJ1Ijoic2F5YWsxMCIsImEiOiJjbGp2amwwZWIwMXdsM2Vsb2FvMjViYzUwIn0.OlDv7VNB3W_UlYCuh6PpQA"

// export const MAP_ACCESS_TOKEN = process.env.MAP_ACCESS_TOKEN;

export const json_header = {
  "Content-type": "application/json",
};

// export const backend = `${URL}:8000`;
export const backend = `http://192.168.0.107:8000`;

export const apply_donor = `${backend}/donor/apply/`;

export const verify_token = `${backend}/accounts/token/verify/`;

export const verify_otp = `${backend}/accounts/verify/`;

export const req_login = `${backend}/accounts/login/`;

export const req_signup = `${backend}/accounts/register/`;

export const nearby_donor = `${backend}/donor/nearby/`;

export const user_profile = `${backend}/accounts/profile/`;

export const get_location = `${backend}/accounts/location/`;

export const receiver_history = `${backend}/donation/receiver-history/`;


// Database URL will be added later
