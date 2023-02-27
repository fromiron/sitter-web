import { ReactNode, useEffect, useRef, useState } from "react";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form/dist/types";
import { IconType } from "react-icons";
import { AiFillLock, AiFillUnlock } from "react-icons/ai";
import { isReadable } from "stream";

interface InputBaseInterface {
  label: string;
  placeholder: string;
  Icon: IconType;
  register: any;
  colSpan?: number;
  disabled?: boolean;
  readonly?: boolean;
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
function LockIcon({ block }: { block?: boolean }) {
  if (block) {
    return <AiFillLock className={"ml-1 text-base-300"} />;
  } else {
    return <AiFillUnlock className={"ml-1"} />;
  }
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
  disabled,
  readonly,
}: TextInputInterface) {
  const [block, setBlock] = useState(readonly);

  let timeoutId: NodeJS.Timeout;

  const handleMouseDown = () => {
    if (readonly) {
      timeoutId = setTimeout(() => {
        setBlock(!block);
      }, 1000);
    }
  };
  const handleMouseUp = () => {
    if (readonly) {
      clearTimeout(timeoutId);
    }
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      className={`${isFit ? "w-fit" : "w-full"} max-w-xs form-control group  ${
        colSpan ? `col-span-${colSpan}` : ""
      }`}
    >
      <label className="label">
        <span className="flex items-center align-bottom label-text group-focus-within:text-primary">
          <Icon className="mr-2 transition duration-500 text-base-100 group-focus-within:text-primary" />
          {label}
          {readonly && <LockIcon block={block} />}
        </span>
      </label>
      <input
        readOnly={block}
        disabled={disabled}
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
  readonly,
}: TextAreaInterface) {
  const [block, setBlock] = useState(readonly);

  let timeoutId: NodeJS.Timeout;

  const handleMouseDown = () => {
    timeoutId = setTimeout(() => {
      setBlock(!block);
    }, 1000);
  };
  const handleMouseUp = () => {
    clearTimeout(timeoutId);
  };
  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      className={`w-full form-control group h-auto ${
        colSpan ? `col-span-${colSpan}` : "col-auto"
      }`}
    >
      <label className="label">
        <span className="flex items-center align-bottom label-text group-focus-within:text-primary">
          <Icon className="mr-2 transition duration-500 text-base-100 group-focus-within:text-primary" />
          {label}
          {readonly && <LockIcon block={block} />}
        </span>
      </label>
      <textarea
        readOnly={block}
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
