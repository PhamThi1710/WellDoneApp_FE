import { RootStackParamList } from "@/Navigation";
import { RootScreens } from "@/Screens";
import {
  useResendVerifyEmailMutation,
  useVerifyEmailMutation,
} from "@/Services/users";
import { RootState } from "@/Store";
import { setUser } from "@/Store/reducers";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Verification from "./Verification";

type VerifyMailScreenNavigatorProps = NativeStackScreenProps<
  RootStackParamList,
  RootScreens.VERIFY_MAIL
>;

const VerificationContainer: React.FC<VerifyMailScreenNavigatorProps> = ({
  navigation,
}) => {
  const [code, setCode] = useState("");
  const { email } = useSelector((state: RootState) => state.user);

  const [
    verifyEmail,
    {
      isLoading: isVerifyingLoading,
      isError: isVerifyingError,
      error: verifyError,
    },
  ] = useVerifyEmailMutation();
  const [
    resendVerifyEmail,
    {
      isLoading: isResendingLoading,
      isError: isResendingError,
      error: resendError,
    },
  ] = useResendVerifyEmailMutation();
  const dispatch = useDispatch();

  const onNavigate = (screen: RootScreens) => {
    navigation.navigate(screen);
  };
  useEffect(() => {
    if (code.length === 6) {
      handleVerifyCode(); 
    }
  }, [code]); 
  const handleVerifyCode = async () => {
    try {
      if (email) {
        const response = await verifyEmail({ email, code }).unwrap();
        if (response) {
          dispatch(setUser({ email: "" }));
          onNavigate(RootScreens.LOGIN);
        }
      }
    } catch (err) {
      console.log("Error verifying email:", err);
    }
  };

  const handleResendCode = async () => {
    try {
      if (email) {
        const response = await resendVerifyEmail({
          email: email,
        }).unwrap();
        if (response) {
          console.log("Verification code resent");
        }
      }
    } catch (err) {
      console.log("Error resending verification code:", err);
    }
  };

  return (
    <Verification
      onNavigate={onNavigate}
      code={code}
      setCode={setCode}
      onSubmit={handleVerifyCode}
      isLoading={isVerifyingLoading || isResendingLoading}
      isError={isVerifyingError || isResendingError}
      error={verifyError || resendError}
      onResendCode={handleResendCode}
    />
  );
};

export default VerificationContainer;