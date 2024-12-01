import { RootStackParamList } from "@/Navigation";
import { useForgotPasswordMutation } from "@/Services/users";
import { setUser } from "@/Store/reducers";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { memo, useCallback } from "react";
import { useDispatch } from "react-redux";
import { RootScreens } from "../..";
import ForgotPassword from "./ForgotPassword";
export interface ForgotPasswordForm {
  email: string;
}

type ForgotPasswordScreenNavigatorProps = NativeStackScreenProps<
  RootStackParamList,
  RootScreens.FORGOT_PASSWORD
>;

const ForgotPasswordContainer = ({
  navigation,
}: ForgotPasswordScreenNavigatorProps) => {
  const dispatch = useDispatch();
  const [forgotPassword, { isLoading, isError, error }] =
    useForgotPasswordMutation();
  const onNavigate = (screen: RootScreens) => {
    navigation.navigate(screen);
  };
  const handleForgotPassword = useCallback(
    async (formData: ForgotPasswordForm) => {
      try {
        const response = await forgotPassword({
          email: formData.email,
        }).unwrap();
        if (response) {
          dispatch(setUser({ email: formData.email }));
          onNavigate(RootScreens.RESET_PASSWORD);
        }
      } catch (err) {
        console.log("An error occurred:", error);
      }
    },
    [forgotPassword, navigation]
  );

  return (
    <ForgotPassword
      onNavigate={onNavigate}
      onForgotPassword={handleForgotPassword}
      isLoading={isLoading}
      isError={isError}
      error={error}
    />
  );
};

export default memo(ForgotPasswordContainer);
