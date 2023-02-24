import { ReactNode } from "react";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form/dist/types";
import { IconType } from "react-icons";

interface InputBaseInterface {
  label: string;
  placeholder: string;
  Icon: IconType;
  register: any;
  colSpan?: number;
  errorMsg?: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
}

interface TextInputInterface extends InputBaseInterface {
  type?: string;
  isFit?: boolean;
  minLength?: number;
  maxLength?: number;
}

interface TextAreaInterface extends InputBaseInterface {
  rows: number;
}

interface SelectInputInterface {
  label: string;
  children: ReactNode;
  Icon: IconType;
  register: any;
}

export function TextInput({
  label,
  type,
  placeholder,
  Icon,
  register,
  errorMsg = "",
  isFit,
  minLength,
  maxLength,
  colSpan,
}: TextInputInterface) {
  return (
    <div
      className={`${isFit ? "w-fit" : "w-full"} max-w-xs form-control group ${
        colSpan ? `col-span-${colSpan}` : ""
      }`}
    >
      <label className="label">
        <span className="flex items-center align-bottom label-text group-focus-within:text-primary">
          <Icon className="mr-2 transition duration-500 text-base-100 group-focus-within:text-primary" />
          {label}
        </span>
      </label>
      <input
        type={type ?? "text"}
        placeholder={placeholder}
        className="transition border-2 input group-focus-within:border-primary"
        {...register}
        minLength={minLength}
        maxLength={maxLength}
      />
      {errorMsg ? (
        <div className="ml-2 text-sm text-error">{errorMsg.toString()}</div>
      ) : (
        ""
      )}
    </div>
  );
}

export function TextAreaInput({
  label,
  placeholder,
  Icon,
  register,
  errorMsg,
  rows,
  colSpan,
}: TextAreaInterface) {
  return (
    <div
      className={`w-full form-control group h-auto ${
        colSpan ? `col-span-${colSpan}` : "col-auto"
      }`}
    >
      <label className="label">
        <span className="flex items-center align-bottom label-text group-focus-within:text-primary">
          <Icon className="mr-2 transition duration-500 text-base-100 group-focus-within:text-primary" />
          {label}
        </span>
      </label>
      <textarea
        placeholder={placeholder}
        rows={rows}
        className="w-full h-auto py-2 transition border-2 resize-none input group-focus-within:border-primary"
        {...register}
      />
      {errorMsg ? (
        <div className="ml-2 text-sm text-error">{errorMsg.toString()}</div>
      ) : (
        ""
      )}
    </div>
  );
}

export function SelectInput({
  label,
  children,
  Icon,
  register,
}: SelectInputInterface) {
  return (
    <div className="w-full max-w-xs form-control group">
      <label className="label">
        <span className="flex items-center align-bottom label-text group-focus-within:text-primary">
          <Icon className="mr-2 transition duration-500 text-base-100 group-focus-within:text-primary" />
          {label}
        </span>
      </label>
      <select
        className="w-full max-w-xs transition border-2 input group-focus-within:border-primary"
        {...register}
      >
        {children}
      </select>
    </div>
  );
}
