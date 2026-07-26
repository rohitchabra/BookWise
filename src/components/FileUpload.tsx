"use client";

import { IKImage, IKUpload, ImageKitProvider } from "imagekitio-next";
import config from "@/lib/config";
import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const {
  env: {
    imagekit: { publicKey, urlEndpoint },
  },
} = config;

const authenticator = async () => {
  const response = await fetch(`${config.env.apiEndpoint}/api/auth/imagekit`);

  if (!response.ok) {
    throw new Error("Failed to authenticate with ImageKit");
  }

  const data = await response.json();
  const { signature, expire, token } = data;
  return { signature, expire, token };
};

interface FileUploadProps {
  type: "image" | "video";
  accept: string;
  placeholder: string;
  folder: string;
  variant: "dark" | "light";
  onFileChange: (filePath: string) => void;
  value?: string;
}

const FileUpload = ({
  type,
  accept,
  placeholder,
  folder,
  variant,
  onFileChange,
  value,
}: FileUploadProps) => {
  const ikUploadRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<{ filePath: string } | null>(
    value ? { filePath: value } : null,
  );
  const [progress, setProgress] = useState(0);

  const styles = {
    button:
      variant === "dark"
        ? "bg-dark-300 hover:bg-dark-400"
        : "bg-light-300 hover:bg-light-400 border border-admin-border",
    placeholder: variant === "dark" ? "text-light-100" : "text-slate-500",
    text: variant === "dark" ? "text-light-100" : "text-dark-400",
  };

  if (!publicKey || !urlEndpoint) {
    return (
      <div className="rounded-md bg-dark-300 p-4 text-sm text-light-100">
        ImageKit is not configured. Add credentials to upload files, or paste a
        URL below.
        <input
          type="url"
          placeholder="https://..."
          className="form-input mt-3"
          defaultValue={value}
          onChange={(e) => {
            onFileChange(e.target.value);
            setFile({ filePath: e.target.value });
          }}
        />
      </div>
    );
  }

  return (
    <ImageKitProvider
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
    >
      <button
        type="button"
        className={cn(
          "flex min-h-14 w-full items-center justify-center gap-2 rounded-md",
          styles.button,
        )}
        onClick={(e) => {
          e.preventDefault();
          ikUploadRef.current?.click();
        }}
      >
        <Image
          src="/icons/upload.svg"
          alt="upload"
          width={20}
          height={20}
          className="object-contain"
        />
        <p className={cn("text-base", styles.placeholder)}>{placeholder}</p>
        {file && (
          <p className={cn("mt-1 max-w-xs truncate text-xs", styles.text)}>
            {file.filePath}
          </p>
        )}
      </button>

      <IKUpload
        ref={ikUploadRef}
        onError={() => toast.error(`${type} upload failed`)}
        onSuccess={(res: { filePath: string }) => {
          setFile(res);
          onFileChange(res.filePath);
          toast.success(`${type} uploaded successfully`);
        }}
        onUploadStart={() => setProgress(0)}
        onUploadProgress={(e: ProgressEvent) => {
          const percent = Math.round((e.loaded / e.total) * 100);
          setProgress(percent);
        }}
        folder={folder}
        accept={accept}
        className="hidden"
      />

      {progress > 0 && progress < 100 && (
        <div className="w-full rounded-full bg-green-200">
          <div
            className="rounded-full bg-green-800 p-1 text-center text-xs font-bold text-white"
            style={{ width: `${progress}%` }}
          >
            {progress}%
          </div>
        </div>
      )}

      {file && type === "image" && (
        <IKImage
          alt={file.filePath}
          path={file.filePath}
          width={500}
          height={300}
          className="mt-2 max-h-48 w-full rounded-md object-contain"
        />
      )}
    </ImageKitProvider>
  );
};

export default FileUpload;
