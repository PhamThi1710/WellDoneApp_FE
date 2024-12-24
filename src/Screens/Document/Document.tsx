import React, { memo } from "react";
import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { GetListDocumentResponseItem } from "@/Services/document";
import ModalUpload from "@/Components/ModalUpload";
import { LoadingProcess } from "@/Components";
import { generateDate } from "@/Utils/Funtions/generate";
import { MyIcon } from "@/Components/ModalUpload";
import Avatar from "@/Components/Avatar";
import MembersModal from "@/Components/MembersModal";

interface DocumentProps {
  isDocumentloading: boolean;
  documentList: GetListDocumentResponseItem[];
  isUpload: boolean;
  setIsUpload: (value: boolean) => void;
  fileUpload: any;
  setFileUpload: (file: any) => void;
  isLoading: boolean;
  onPickDocument: () => void;
  onUploadFile: () => void;
  onGetFile: (documentID: number) => void;
  onNavigateBack: () => void;
}

const Document: React.FC<DocumentProps> = ({
  isDocumentloading,
  documentList,
  isUpload,
  setIsUpload,
  fileUpload,
  setFileUpload,
  isLoading,
  onPickDocument,
  onUploadFile,
  onGetFile,
  onNavigateBack,
}) => {
  const [openModal, setOpenModal] = React.useState(false);
  return (
    <View className="bg-[#F8FBF6] w-full h-full relative mb-32">
      <LoadingProcess isVisible={isLoading || isDocumentloading} />
      <ModalUpload
        isUpload={isUpload}
        setIsUpload={setIsUpload}
        fileUpload={fileUpload}
        setFileUpload={setFileUpload}
        onPickDocument={onPickDocument}
        onUploadFile={onUploadFile}
      />

      <View className="w-full h-24 pb-4 flex justify-end items-center">
        <Text className="text-heading4 font-bold px-10 text-center text-black">
          Danh sách tài liệu
        </Text>
      </View>

      <TouchableOpacity
        className="absolute left-5 top-10 w-12 h-12 flex justify-center items-center rounded-full border-[1px] border-neutral-400"
        onPress={onNavigateBack}
      >
        <MyIcon name="chevron-left" size={15} color="#000" />
      </TouchableOpacity>

      <TouchableOpacity
        className="z-50 absolute right-5 bottom-10 w-16 h-16 flex justify-center items-center rounded-full bg-lime-900"
        onPress={() => setIsUpload(true)}
      >
        <MyIcon name="plus" size={30} color="#fff" />
      </TouchableOpacity>

      <ScrollView className="w-full p-6">
        {documentList.map((doc) => (
          <View
            key={doc.id}
            className="rounded-2xl bg-white overflow-hidden mb-4"
          >
            <View className="bg-lime-500 flex-row py-3 px-5 justify-between items-center">
              <View className="flex-row gap-3 items-center">
                <MyIcon name="calendar" size={20} color="#fff" />
                <Text className="text-neutral-100 text-body-small-bold">
                  {generateDate(new Date().toISOString())}
                </Text>{" "}
              </View>
              <View className="flex-row gap-6 items-center">
                <MyIcon name="info-circle" size={25} color="#fff" />
                <MyIcon name="trash" size={25} color="#fff" />
              </View>
            </View>
            <View className="px-5">
              <View className="flex-row items-center border-b-[1px] border-gray-300 py-5 px-3">
                <MyIcon name="dot-circle-o" size={25} color="#24A19C" />
                <Text className="ml-5 text-body-base-bold">{doc.filename}</Text>
              </View>
              <View className="p-3 flex-row items-center justify-between">
                <View className="flex-row items-center gap-5">
                  <View className="flex-row items-center">
                    <MyIcon name="clock-o" size={20} color="#65A30D" />
                    <Text className="text-primary-900 text-body-small-regular ml-3">
                      08.30 PM
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <TouchableOpacity onPress={() => onGetFile(doc.id)}>
                      <MyIcon name="download" size={20} color="#65A30D" />
                    </TouchableOpacity>
                    {/* <Text className="text-primary-900 text-body-small-regular ml-3">
                      2
                    </Text> */}
                  </View>
                </View>
                <View>
                  <TouchableOpacity onPress={() => setOpenModal(true)}>
                    <Avatar width={30} height={30} name={doc.user.name} />
                  </TouchableOpacity>
                  {openModal && (
                    <MembersModal
                      members={doc.user}
                      closeModal={() => setOpenModal(false)}
                    />
                  )}
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default memo(Document);
