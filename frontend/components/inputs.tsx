import { ReactNode } from "react";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form/dist/types";
import { IconType } from "react-icons";

export function TextInput({
  label,
  type,
  placeholder,
  Icon,
  register,
  errorMsg = "",
}: {
  label: string;
  type?: string;
  placeholder: string;
  Icon: IconType;
  register: any;
  errorMsg?: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
}) {
  return (
    <div className="w-full max-w-xs form-control group">
      <label className="label">
        <span className="flex items-center align-bottom label-text group-focus-within:text-primary">
          <Icon className="mr-2 transition duration-500 text-base-100 group-focus-within:text-primary" />
          {label}
        </span>
      </label>
      <input
        type={type ?? "text"}
        placeholder={placeholder}
        className="w-full max-w-xs transition border-2 input group-focus-within:border-primary"
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
}: {
  label: string;
  children: ReactNode;
  Icon: IconType;
  register: any;
}) {
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
