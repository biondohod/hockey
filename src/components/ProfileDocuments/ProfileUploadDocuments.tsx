import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import ReactModal from "react-modal";
import "./ProfileUploadDocuments.scss";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ProfileDocumentsValidation } from "../../lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUploadDocument } from "../../lib/react-query/mutations";
import { toast } from "react-toastify";
import { transliterateText } from "../../lib/utils";

const ProfileUploadDocuments = () => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const { t } = useTranslation();
  const { mutateAsync, isSuccess, isPending } = useUploadDocument();

  useEffect(() => {
    ReactModal.setAppElement("#root");
  }, []);

  useEffect(() => {
    const root = document.getElementById("root");
    if (modalIsOpen && root) {
      root.style.overflow = "hidden";
    } else if (root) {
      root.style.overflow = "auto";
    }
  }, [modalIsOpen]);

  useEffect(() => {
    if (isSuccess) {
      closeModal();
      setFiles([]);
      reset();
    }
  }, [isSuccess]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<z.infer<typeof ProfileDocumentsValidation>>({
    resolver: zodResolver(ProfileDocumentsValidation),
    defaultValues: {
      name: files[0]?.name.split(".")[0],
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
      "image/gif": [".gif"],
      "application/pdf": [".pdf"],
    },
    multiple: false,
    maxSize: 10485760,
  });

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((file, i) => i !== index));
    reset();
  };

  const onSubmit = (data: { name: string }) => {
    const document: DocumentForm = {
      document: files[0],
      name: data.name,
    };
    toast.promise(mutateAsync(document), {
      pending: t("profile.documents.pending"),
    });
  };

  return (
    <div className="profile-docs">
      <button className="profile-info__edit" onClick={openModal}>
        {t("profile.uploadDocs")}
      </button>
      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Registration Applications"
        className="competition-registrations__modal"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.75)",
          },
        }}
      >
        <div className="competition-registrations__header">
          <h2 className="competition-registrations__title">
            {t("profile.documents.upload.title")}
          </h2>
          <button
            className="competition-registrations__button competition-registrations__button--close"
            onClick={closeModal}
          >
            {t("competitions.registration.close")}
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="profile-docs__form">
          {!files.length && (
            <div {...getRootProps()} className="dropzone">
              <input
                {...getInputProps()}
                name="document"
                autoComplete="false"
              />
              <p>
                {isDragActive
                  ? t("profile.documents.upload.release")
                  : t("profile.documents.upload.dragAndDrop")}
              </p>
            </div>
          )}
          <ul className="profile-docs__preview">
            {files.map((file: File, index: number) => (
              <li key={index} className="profile-docs__item">
                {file.type.includes("image") ? (
                  <>
                    <span className="profile-docs__file-name">{file.name}</span>
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="profile-docs__image"
                    />
                  </>
                ) : (
                  <p className="profile-docs__pdf">{file.name}</p>
                )}
                <label className="profile-docs__label">
                  <span className="profile-docs__label-text">
                    {t("profile.documents.upload.inputName")}
                  </span>
                  <input
                    type="text"
                    id="name"
                    {...register("name")}
                    placeholder={t("profile.documents.upload.namePlaceholder")}
                    defaultValue={file.name.split(".")[0]}
                    className="auth__input"
                    required={true}
                    {...(errors.name && {
                      style: { borderColor: "red", outline: "none" },
                    })}
                  />
                  {errors.name && errors.name.message && (
                    <span className="auth__error-msg">
                      {t(errors.name.message)}
                    </span>
                  )}
                </label>
                <div className="profile-docs__btns">
                  <button
                    className="profile-docs__btn profile-docs__btn--submit"
                    type="submit"
                    disabled={isPending}
                  >
                    {t("profile.documents.upload.uploadButton")}
                  </button>
                  <button
                    onClick={() => removeFile(index)}
                    className="profile-docs__btn profile-docs__btn--delete"
                    type="button"
                    disabled={isPending}
                  >
                    {t("profile.documents.upload.removeButton")}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </form>
      </ReactModal>
    </div>
  );
};

export default ProfileUploadDocuments;
