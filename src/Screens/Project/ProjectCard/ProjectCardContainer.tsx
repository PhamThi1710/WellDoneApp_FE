import { RootScreens } from "@/Screens";
import { useProjectMembers } from "@/Screens/Home";
import {
  CreateProjectResponse,
  GetMemOfProjectResponse,
  GetProjectListResponse,
  GroupCreateProject,
  useDeleteProjectMutation,
  useGetMemOfProjectMutation,
} from "@/Services/projects";
import { RootState } from "@/Store";
import { setProjectId } from "@/Store/reducers";
import React, { FC, memo, useCallback, useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Toast } from "toastify-react-native";
import ProjectCard from "./ProjectCard";

interface IProjectCardContainerProps {
  project: GetProjectListResponse;
  bgColor: string;
  onNavigate: (screen: RootScreens) => void;
}

const ProjectCardContainer: FC<IProjectCardContainerProps> = ({
  project,
  bgColor,
  onNavigate,
}) => {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.profile.token);
  const [deleteProject, { isLoading: isDeleteProjectLoading }] =
    useDeleteProjectMutation();
  const listMember = useProjectMembers(project.id, token);
  const handleDeleteProject = useCallback(
    async (projectId: number) => {
      const response = await deleteProject({ projectId, token });
      if ("data" in response && response.data === null) {
        Toast.success("Xóa dự án thành công!");
      }
    },
    [deleteProject, token]
  );

  const handleDelete = (projectId: number) => {
    Alert.alert(
      "Xóa Dự án!",
      "Bạn có chắc chắn muốn xóa dự án này?",
      [
        { text: "Hủy", style: "cancel" },
        { text: "OK", onPress: () => handleDeleteProject(projectId) },
      ],
      { cancelable: false }
    );
  };

  const handleNavigate = () => {
    dispatch(setProjectId({ id: project.id }));
    onNavigate(RootScreens.PROJECTDETAIL);
  };

  return (
    <ProjectCard
      isDeleteProjectLoading={isDeleteProjectLoading}
      listMember={listMember || []}
      project={project}
      bgColor={bgColor}
      onNavigate={handleNavigate}
      onDelete={handleDelete}
    />
  );
};

export default memo(ProjectCardContainer);
