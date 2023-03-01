import { ReactElement } from "react";
import { IoMale, IoFemale } from "react-icons/io5";

export const SexIcon = (boolean: boolean): ReactElement =>
  !!boolean ? (
    <IoMale className="text-info" />
  ) : (
    <IoFemale className="text-error" />
  );
