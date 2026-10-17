import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
  MAX_FILE_SIZE,
} from "@/constants";
import { UploadWidgetProps, UploadWidgetValue } from "@/types";
import { UploadCloud } from "lucide-react";
import React, { useRef, useState, useEffect } from "react";

const UploadWidget = ({
  value = null,
  onChange,
  disabled = false,
}: UploadWidgetProps) => {
  const widgetRef = useRef<CloudinaryWidget | null>(null);
  const onChangeRef = useRef(onChange);
  const [preview, setPreview] = useState<UploadWidgetValue | null>(value);
  const [deleteToken, setDeleteToken] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState<boolean>(false);

  useEffect(() => {
    setPreview(value);
    if (!value) setDeleteToken(null);
  }, [value]);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const initializeWidget = () => {
      if (!window.cloudinary || widgetRef.current) return false;

      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: CLOUDINARY_CLOUD_NAME,
          uploadPreset: CLOUDINARY_UPLOAD_PRESET,
          multiple: false,
          folder: "upload",
          maxFileSize: MAX_FILE_SIZE,
          clientAllowedFormats: ["png", "jpg", "jpeg", "webp"],
        },
        (error, result) => {
          if (!error && result && result.event === "success") {
            const payload: UploadWidgetValue = {
              url: result.info.secure_url,
              publicId: result.info.public_id,
            };
            setPreview(payload);
            setDeleteToken(result.info.delete_token ?? null);
            onChangeRef.current?.(payload);
          }
        },
      );

      return true;
    };
    if (initializeWidget()) return;

    const intervalId = window.setInterval(() => {
      if (initializeWidget()) {
        window.clearInterval(intervalId);
      }
    }, 500);

    return () => window.clearInterval(intervalId);
  }, []);

  const openWidget = () => {
    if (!disabled) widgetRef.current?.open();
  };

  const removeFromCloudinary = async () => {
    setPreview(null);
    setDeleteToken(null);
    onChangeRef.current?.(null);
  };

  return (
    <div className="space-y-2">
      {preview ? (
        <div className="upload-preview">
          <img src={preview.url} alt="uploaded image" />
          <div className="mt-2 flex gap-2 relative">
            <button
              type="button"
              className="rounded bg-red-500 px-2 py-1 text-sm text-white absolute top-0"
              onClick={removeFromCloudinary}
              disabled={disabled}
            >
              Remove
            </button>
            <button
              type="button"
              className="rounded border px-2 py-1 text-sm absolute top-0 right-24"
              onClick={openWidget}
              disabled={disabled}
            >
              Replace
            </button>
          </div>
        </div>
      ) : (
        <div
          className="upload-dropzone"
          role="button"
          tabIndex={0}
          onClick={openWidget}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              openWidget();
            }
          }}
        >
          <div className="upload-prompt">
            <UploadCloud className="icon" />
            <div>
              <p>Click to upload photo</p>
              <p>PNG, JPG up to 5MB</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadWidget;
