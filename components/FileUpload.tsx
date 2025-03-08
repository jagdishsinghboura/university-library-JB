"use client";
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
import { cn } from "@/lib/utils";

const {
  env: {
    imagekit: { publicKey, urlEndpoint },
  },
} = config;

const authenticator = async () => {
  try {
    const response = await fetch(`${config.env.apiEndpoint}/api/auth/imagekit`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status code ${response.status} and error text: ${errorText}`
      );
    }

    const data = await response.json();

    const { signature, expire, token } = data;

    return { signature, expire, token };
  } catch (error: any) {
    throw new Error(`Authentication request failed :${error.message}`);
  }
};

interface Props {
  type: "image" | "video";
  accept: string;
  placeholder: string;
  folder: string;
  variant: "dark" | "light";
  onFileChange: (FilePath: string) => void;
  value?:string
}
const FileUpload = ({
  type,
  accept,
  placeholder,
  folder,
  variant,
  onFileChange,
  value
}: Props) => {
  const ikUploadRef = useRef(null);
  const [file, setFile] = useState< {filePath: string | null}>({filePath:value??null});
  const [progress, setProgress] = useState(0);

  const styles={
    button:variant==="dark"?"bg-dark-300":"bg-light-600 border-grey-100 border",
    placeholder:variant=="dark"?"text-light-100":"text-slate-500",
    text:variant==='dark'?"text-light-100":'text-dark-400',
  }

  const onError = (error: any) => {
    console.log(error);
    toast(`${type} Upload failed`);
  };

  const onSuccess = (res: any) => {
    setFile(res);
    onFileChange(res.filePath);
    toast(`${type} upload successful`);

    toast(`${res.filePath} upload successfully`);
  };

  const onValidate =(file:File)=>{
    if(type==="image"){
      if(file.size>20*1024*1024){
        toast(`file size too large file should be less than 20 mb `);
        return false;
      }
    }else if(type=='video'){
      if(file.size>50*1024*1024){
        toast(`file size too large file should be less than 50 mb `);
        return false;
      }
    }

    return true;
  }

  return (
    <ImageKitProvider
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
    >
      <IKUpload
        ref={ikUploadRef}
        onError={onError}
        onSuccess={onSuccess}
        useUniqueFileName={true}
        validateFile={onValidate}
        onUploadStart={()=>setProgress(0)}
        onUploadProgress={({loaded, total})=>{
          const progress = Math.round(((loaded/total) * 100) );
          setProgress(progress);
        }}
        folder={folder}
        accept={accept}
        className="hidden"
      />

      <button
        className={cn('upload-btn', styles.button)}
        onClick={(e) => {
          e.preventDefault();

          if (ikUploadRef.current) {
            //@ts-ignore
            ikUploadRef.current?.click();
          }
        }}
      >
        <Image
          src={"/icons/upload.svg"}
          alt={"upload-icon"}
          width={20}
          height={20}
          className="object-fit"
        />
      </button>
      {progress> 0 && progress !==100 && (
        <div className="w-full rounded-full bg-green-200">
          <div className="progress" style={{width:`${progress}%`}}> 
            {progress}%
          </div>
        </div>
      )}
      <p className={cn('text-base ',styles.placeholder)}> {placeholder}</p>
      {file && <p className={cn('text-base ',styles.text)}>{file.filePath.slice(1, 10)}</p>}

      {file && (
        (type==="image" ?(
          <IKImage
            alt={file?.filePath}
            path={file?.filePath}
            width={500}
            height={500}
          />
        ):(
          <IKVideo 
          path={file.filePath}
          controls={true}
          className="h-96 w-full rounded-xl"/>
        ))
      )}
    </ImageKitProvider>
  );
};

export default FileUpload;
