import { useState } from "react";
import SendOtp from "../components/user/sendOtp";
import VerifyOTP from "../components/user/verifyOtp";
import ChangePassword from "../components/user/changePassword";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sendOtpState, setSendOtpState] = useState(true);
  const [verifyOtpState, setVerifyOtpState] = useState(false);
  const [changePasswordState, setChangePasswordState] = useState(false);

  return (
    <>
      {sendOtpState && (
        <SendOtp
          email={email}
          setEmail={setEmail}
          setSendOtpState={setSendOtpState}
          setVerifyOtpState={setVerifyOtpState}
        />
      )}

      {verifyOtpState && (
        <VerifyOTP
          email={email}
          setVerifyOtpState={setVerifyOtpState}
          setChangePasswordState={setChangePasswordState}

        />
      )}
      {changePasswordState && (
        <ChangePassword
          email={email}
          setChangePasswordState={setChangePasswordState}
        />
      )}
    </>
  );
}
