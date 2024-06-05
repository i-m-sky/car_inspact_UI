import instance from "../http/axios";

class Auth {
  static verify_inpection_token(inspection_id) {
    return instance.post(`/verify/inspection`, {
      inspection_id,
    });
  }
}

export default Auth;
