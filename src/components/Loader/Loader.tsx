import { FC } from "react";
import Loader2 from './Loader.svg';
import "./Loader.scss";

export type LoaderProps = {
  message?: string;
  loaderWidth?: number;
  loaderHeight?: number;
  fontSize?: number;
  fontSizeMobile?: number;
  marginTop?: number;
};
/**
 * Renders a loader component with customizable message, font size, height, and width.
 *
 * @param {LoaderProps} props. The props for the Loader component.
 * @param {string} [props.message="Loading... Please wait"] - The message to display while loading. Default value: "Loading... Please wait"
 * @param {number} [props.loaderHeight=80] - The height of the loader spinner in pixels. Default value: 80.
 * @param {number} [props.loaderWidth=80] - The width of the loader spinner in pixels. Default value: 80.
 * @param {number} [props.fontSize] - Tailwind css class for font-size. Default value: "text-5xl".
 */
const Loader: FC<LoaderProps> = ({
  message = "Загрузка... пожалуйста подождите",
  loaderHeight = 80,
  loaderWidth = 80,
  fontSize = 24,
  marginTop = 0,

}: LoaderProps) => {
  return (
    <div className={"loader"} style={{ fontSize, marginTop }}>
      <img
        src={Loader2}
        className="loader__spinner"
        style={{ height: loaderHeight, width: loaderWidth }}
      />
      {message}
    </div>
  );
};

export default Loader;
