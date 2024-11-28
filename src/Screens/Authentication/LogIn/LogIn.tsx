import { RootScreens } from "@/Screens";
import HeaderBackground from "assets/icons/LogIn/HeaderBackground";
import LogoWellDone from "assets/icons/LogoWellDone";
import React, { FC, memo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import { LogInForm } from "./LogInContainer";
interface LogInProps {
  onNavigate: (screen: RootScreens) => void;
  onLogIn: (formData: LogInForm) => void;
}
const LogIn: FC<LogInProps> = ({ onNavigate, onLogIn }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LogInForm>();

  const onSubmit = (data: any) => {
    onLogIn(data);
  };

  return (
    <View className="flex-1 bg-white items-center px-5 pt-12">
      <HeaderBackground className="w-32 h-32 mb-8" />
      <LogoWellDone className="w-32 h-32 mb-8" />
      <Text className="text-center text-neutral-700 text-body-base-medium mb-8">
        Đăng nhập vào tài khoản WellDone của bạn
      </Text>

      <View className="w-full mb-4">
        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, value } }) => (
            <View className="flex-row items-center bg-neutral-200 rounded-lg px-4 py-3 mb-4">
              <AntDesign name="user" size={16} color="black" />
              <TextInput
                placeholder="Tên tài khoản"
                className="flex-1 text-neutral-700 text-body-base-regular"
                value={value}
                onChangeText={onChange}
              />
            </View>
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <View className="flex-row items-center bg-neutral-200 rounded-lg px-4 py-3 mb-4">
              <AntDesign name="lock" size={16} color="black" />

              <TextInput
                placeholder="Mật khẩu"
                secureTextEntry={!passwordVisible}
                className="flex-1 text-neutral-700 text-body-base-regular"
                value={value}
                onChangeText={onChange}
              />

              <TouchableOpacity
                onPress={() => setPasswordVisible(!passwordVisible)}
              >
                <Entypo
                  name={passwordVisible ? "eye" : "eye-with-line"}
                  size={16}
                  color="black"
                />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      <TouchableOpacity className="self-end mb-5">
        <Text
          className="text-body-small-bold text-neutral-700"
          onPress={() => onNavigate(RootScreens.FORGOT_PASSWORD)}
        >
          Quên mật khẩu?
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-primary-600 rounded-lg w-52 h-14 py-2 px-4 mb-5 justify-center"
        onPress={handleSubmit(onSubmit)}
      >
        <Text className="text-center text-neutral-100 font-bold text-body-base-bold">
          Đăng nhập
        </Text>
      </TouchableOpacity>

      <View className="flex-row">
        <Text className="text-neutral-700 text-body-base-medium">
          Chưa có tài khoản?{" "}
        </Text>
        <TouchableOpacity onPress={() => onNavigate(RootScreens.SIGNUP)}>
          <Text className="text-neutral-700 text-body-base-bold">
            Đăng ký ngay
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default memo(LogIn);