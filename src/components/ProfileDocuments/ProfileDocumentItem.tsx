import { FC, useEffect } from "react";
import { useGetDocumetUrl } from "../../lib/react-query/queries";
import Loader from "../Loader/Loader";
import axios from "axios";
import { saveAs } from "file-saver";
import { useTranslation } from "react-i18next";
import ProfileDeleteDocumentItem from "./ProfileDeleteDocumentItem";
import { formatDateAndTime, transliterateText } from "../../lib/utils";

type ProfileDocumentItemProps = {
  document: IDocument;
};

const ProfileDocumentItem: FC<ProfileDocumentItemProps> = ({ document }) => {
  const { data, isLoading } = useGetDocumetUrl(document.id);
  const { t } = useTranslation();

  useEffect(() => {
    // console.log(data);
  }, [data]);

  // const openDocument = (url: string) => {
  //   window.open(url, "_blank");
  // };

  const createdAt = formatDateAndTime(document.created_at, false);
  const expiresAt = formatDateAndTime(document.expires_at, false);

  const downloadDocument = (url: string, filename: string) => {
    axios
      .get(url, {
        responseType: "blob",
      })
      .then((response) => {
        const contentType = response.headers["content-type"];
        let extension = "";

        switch (contentType) {
          case "image/jpeg":
            extension = ".jpeg";
            break;
          case "image/png":
            extension = ".png";
            break;
          case "application/pdf":
            extension = ".pdf";
            break;
          case "image/webp":
            extension = ".webp";
            break;
          case "image/gif":
            extension = ".gif";
            break;
          // Add more cases as needed...
        }

        saveAs(new Blob([response.data]), `${filename}${extension}`);
      });
  };

  if (isLoading)
    return (
      <li className="profile-docs__item">
        <div className="profile-docs__wrapper">
          <span className="profile-docs__file-name">
            {transliterateText(document.name)}{" "}
          </span>
          <Loader
            fontSize={20}
            loaderHeight={20}
            loaderWidth={20}
            message={t("profile.documents.download.loading")}
          />
        </div>
        <div className="profile-docs__dates">
          <span className="profile-docs__date">
            {t("profile.documents.uploaded")}: {createdAt.date} {createdAt.time}
          </span>
          <span className="profile-docs__date">
            {t("profile.documents.expires")}: {expiresAt.date} {expiresAt.time}
          </span>
        </div>
      </li>
    );
  // return <Loader fontSize={24} loaderHeight={24} loaderWidth={24} />;

  // if (!data || true)
  //   return (
  //     <li className="profile-docs__item">
  //       <span className="profile-docs__file-name">{document.name} (download link is not available)</span>
  //       <div className="profile-docs__dates">
  //         <span className="profile-docs__date">{document.created_at}</span>
  //         <span className="profile-docs__date">{document.expires_at}</span>
  //       </div>
  //     </li>
  //   );

  return (
    <li className="profile-docs__item">
      {data ? (
        <>
          <span
            className="profile-docs__file-name profile-docs__file-name--active"
            // onClick={() => downloadDocument(data.url, document.name)}
          >
            {transliterateText(document.name)}
          </span>
          <button
            className="competition-registrations__button competition-registrations__button--close"
            onClick={() => downloadDocument(data.url, document.name)}
          >
            {t("profile.documents.download.click")}
          </button>
        </>
      ) : (
        <span className="profile-docs__file-name">
          {transliterateText(document.name)} (
          {t("profile.documents.download.notAvailable")})
        </span>
      )}
      <div className="profile-docs__dates">
        <span className="profile-docs__date">
          {t("profile.documents.uploaded")}: {createdAt.date} {createdAt.time}
        </span>
        <span className="profile-docs__date">
          {t("profile.documents.expires")}: {expiresAt.date} {expiresAt.time}
        </span>
      </div>
      <ProfileDeleteDocumentItem id={document.id} />

      {/* {file.type.includes("image") ? (
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
      )} */}
    </li>
  );
};

export default ProfileDocumentItem;
