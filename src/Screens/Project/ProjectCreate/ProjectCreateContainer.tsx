import { RootStackParamList } from "@/Navigation";
import { RootScreens } from "@/Screens";
import { ErrorHandle } from "@/Services";
import { useCreateProjectMutation } from "@/Services/projects";
import { RootState } from "@/Store";
import { setProjectId } from "@/Store/reducers";
import { renderErrorMessageResponse } from "@/Utils/Funtions/render";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { FC, memo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toast } from "toastify-react-native";
import { ProjectEditForm } from "../ProjectEdit/ProjectEditContainer";
import ProjectCreate from "./ProjectCreate";
export interface ProjectCreateForm extends ProjectEditForm {}

type ProjectCreateScreenNavigatorProps = NativeStackScreenProps<
  RootStackParamList,
  RootScreens.PROJECTCREATE
>;

const ProjectCreateContainer: FC<ProjectCreateScreenNavigatorProps> = ({
  navigation,
}) => {
  const onNavigate = (screen: RootScreens) => {
    navigation.navigate(screen);
  };
  const [createProject] = useCreateProjectMutation();
  const token = useSelector((state: RootState) => state.profile.token);
  const dispatch = useDispatch();
  const handleCreateProject = useCallback(
    async (formData: ProjectCreateForm) => {
      const convertGroupMemberFromStringToNumber = formData.project_group_member.map(
        (group) => parseInt(group.toString())
      );
      try {
        const response = await createProject({
          token: token,
          data: {
            name: formData.project_name,
            description: formData.project_description,
            startDate: formData.project_start_date,
            endDate: formData.project_end_date,
            status: formData.project_status,
            groupIds: convertGroupMemberFromStringToNumber,
          },
        }).unwrap();
        if (response && "id" in response) {
          dispatch(setProjectId({ id: response.id }));
          onNavigate(RootScreens.PROJECTDETAIL);
        }
      } catch (err) {
        if (err && typeof err === "object" && "data" in err) {
          const errorData = err as ErrorHandle;
          Toast.error(
            renderErrorMessageResponse(String(errorData.data.message)),
            "top"
          );
        }
      }
    },
    [createProject]
  );
  return (
    <ProjectCreate
      onNavigate={onNavigate}
      onCreateProject={handleCreateProject}
    />
  );
};
export default memo(ProjectCreateContainer);
