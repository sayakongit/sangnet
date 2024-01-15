const URL = process.env.BACKEND_IP;

export const json_header = {
  "Content-type": "application/json",
};

// export const backend = `${URL}:8000`;
export const backend = `http://192.168.0.103:8000`;

export const apply_donor = `${backend}/donor/apply/`;

export const verify_token = `${backend}/accounts/token/verify/`;

export const verify_otp = `${backend}/accounts/verify/`;

export const req_login = `${backend}/accounts/login/`;

export const req_signup = `${backend}/accounts/register/`;

export const nearby_donor = `${backend}/donor/nearby/`;

export const user_profile = `${backend}/accounts/profile/`;

export const get_location = `${backend}/accounts/location/`


// Database URL will be added later
