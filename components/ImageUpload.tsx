"use client"
import React, { useRef, useState } from "react";
import {
  IKImage,
  IKVideo,
  ImageKitProvider,
  IKUpload,
  ImageKitContext,
} from "imagekitio-next";
import config from "@/lib/config";
import Image from "next/image";
import { FilePath } from "tailwindcss/types/config";
import { toast } from "sonner";


const {
  env: {
    imagekit: {  publicKey, urlEndpoint },
  },
} = config;


const authenticator =async()=>{
  try {
    const response =await fetch(`${config.env.apiEndpoint}/api/auth/imagekit`)

    if(!response.ok){
      const errorText = await response.text()
      throw new Error(`Request failed with status code ${response.status} and error text: ${errorText}`)
    }

    const data =await  response.json()

    const {signature , expire, token} =data;

    return {signature, expire, token}
  } catch (error:any) {
      throw new Error(`Authentication request failed :${error.message}`)
  }
}
const ImageUpload = ({onFileChange}:{onFileChange:(FilePath:string)=>void}) => {
  const ikUploadRef = useRef(null);
  const[file, setFile] = useState<{filePath:string}|null>()

  const onError =(error:any)=>{
    console.log(error)
    toast(`your iamge could not be upload ${error.message}`)

  }

  const onSuccess =(res:any)=>{
    setFile(res);
    onFileChange(res.filePath)

    toast(
      `${res.filePath} upload successfully`
    )

  }

  return <ImageKitProvider publicKey={publicKey} urlEndpoint={urlEndpoint} authenticator={authenticator}>
      <IKUpload
      className="hidden"
      ref={ikUploadRef}
      onError={onError}
      onSuccess={onSuccess}
      fileName="test-upload.png"
      />
      
      <button className="upload-btn" onClick={(e)=>{
        e.preventDefault();

        if(ikUploadRef.current){
          //@ts-ignore
          ikUploadRef.current?.click()
        }
      }}>
        <Image src={"/icons/upload.svg"} alt={"upload-icon"}
        width={20} height={20}  className="object-fit"/>
      </button>
      <p className="text-basee text-light-100"> upload   a file</p>
      {file &&(
        <IKImage
        alt={file.filePath}
        path={file.filePath}
        width={500}
        height={500}/>
      )}
  </ImageKitProvider>;
};

export default ImageUpload;
