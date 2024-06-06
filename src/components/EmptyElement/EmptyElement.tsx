import { FC } from "react";
import "./EmptyElement.scss";
import { useTranslation } from "react-i18next";

export type EmptyContentProps = {
  message?: string;
  fontSize?: number;
  marginTop?: number;
};

/**
 * Renders a component with a customizable message when there's no content to display.
 *
 * @param {EmptyContentProps} props. The props for the EmptyContent component.
 * @param {string} [props.message="No content available"] - The message to display when there's no content. Default value: "No content available".
 * @param {number} [props.fontSize=24] - The font size for the message. Default value: 24.
 * @param {number} [props.marginTop=0] - The top margin for the message. Default value: 0.
 */
const EmptyContent: FC<EmptyContentProps> = ({
  message,
  fontSize = 32,
  marginTop = 0,
}: EmptyContentProps) => {
  const {t} = useTranslation();
  return (
    <div className={"empty-content"} style={{ fontSize, marginTop }}>
      {message || t("global.emptyElement")}
    </div>
  );
};

export default EmptyContent;