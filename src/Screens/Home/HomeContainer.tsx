import { RootStackParamList } from "@/Navigation";
import {
  CreateProjectResponse,
  GetMemOfProjectResponse,
  useGetMemOfProjectMutation,
  useGetProjectListMutation,
} from "@/Services/projects";
import { RootState } from "@/Store";
import { setProjectId } from "@/Store/reducers";
import { renderErrorMessageResponse } from "@/Utils/Funtions/render";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useDispatch, useSelector } from "react-redux";
import { Toast } from "toastify-react-native";
import { RootScreens } from "..";
import { Home } from "./Home";

type HomeScreenNavigatorProps = NativeStackScreenProps<RootStackParamList>;

const useRecentProject = (token: string) => {
  const [data, setData] = useState<CreateProjectResponse | undefined>(
    undefined
  );
  const [getProjectList, { isLoading }] = useGetProjectListMutation();
  const dispatch = useDispatch();

  const fetchRecentProject = useCallback(async () => {
    try {
      const response = await getProjectList({ token });
      if ("data" in response && Array.isArray(response.data)) {
        const project = response.data[0];
        setData(project);
        if (project?.id) {
          dispatch(setProjectId({ id: project.id }));
        }
      } else {
        Toast.error("Unexpected response format");
      }
    } catch (error) {
      Toast.error(renderErrorMessageResponse(String(error)));
      console.error(error);
    }
  }, [getProjectList, token, dispatch]);

  useEffect(() => {
    fetchRecentProject();
  }, [fetchRecentProject]);

  return { data, isLoading };
};

export const useProjectMembers = (projectID: number | null, token: string) => {
  const [listMember, setListMember] = useState<GetMemOfProjectResponse | null>(
    null
  );
  const [getMemOfProject] = useGetMemOfProjectMutation();

  useEffect(() => {
    const fetchMemOfProject = async () => {
      if (projectID === null) return;

      try {
        const response = await getMemOfProject({ projectId: projectID, token });

        if ("data" in response && Array.isArray(response.data)) {
          setListMember(response.data);
        }
      } catch (error) {
        Toast.error(renderErrorMessageResponse(String(error)));
        console.error(error);
      }
    };

    fetchMemOfProject();
  }, [getMemOfProject, projectID, token]);

  return listMember;
};

export const HomeContainer = ({ navigation }: HomeScreenNavigatorProps) => {
  const token = useSelector((state: RootState) => state.profile.token);
  const { data, isLoading } = useRecentProject(token);
  const [projectID, setProjectID] = useState<number | null>(null);
  const listMember = useProjectMembers(projectID, token);

  const onNavigate = (screen: RootScreens) => {
    navigation.navigate(screen);
  };

  useEffect(() => {
    if (data) {
      setProjectID(data.id);
    }
  }, [data]);

  if (isLoading) {
    return (
      <View className="flex justify-center items-center h-full">
        <Text>Loading...</Text>
      </View>
    );
  } else if (!data) {
    return (
      <View className="flex justify-center items-center h-full text-center">
        <Text className="p-16 ">
          Hiện tại bạn không có dự án nào. Tạo dự án ngay~!🔥🌸👇👇
        </Text>
        <TouchableOpacity
          className=" w-16 h-16 bg-primary-600 rounded-lg p-2 flex justify-center items-center"
          onPress={() => onNavigate(RootScreens.PROJECTCREATE)}
        >
          <AntDesign name="plus" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Home
      onNavigate={onNavigate}
      listMember={listMember}
      data={data}
      isLoading={isLoading}
    />
  );
};
