import ModalContainer from "@components/layout/ModalContainer";
import {useForm} from "react-hook-form";
import {IoMdAdd} from "react-icons/io";
import {FaUser} from 'react-icons/fa'
import {TextAreaInput, TextInput} from "@components/inputs";
import {ChangeEvent, Dispatch, SetStateAction} from "react";
import {UseMutationResult} from "react-query";
import {AxiosError} from "axios";
import {CustomerBaseInterface} from "@interfaces/cmsInterfaces";
import {ZIP_CODE_PATTERN} from "@constants/regex";
import {numberNormalize} from "@helpers/number-normalize";
import insertString from "@helpers/insert-string";

export function CustomerAddModal({isModalOpen, setIsModalOpen, mutation}: {
    isModalOpen: boolean;
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
    mutation: {
        addCustomer: UseMutationResult<
            null,
            AxiosError<unknown, any>,
            { name: string; },
            unknown
        >;
        deleteCustomer: UseMutationResult<
            null,
            AxiosError<unknown, any>,
            {
                id: number;
            },
            unknown
        >;
    };
}) {
    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
        setValue
    } = useForm<CustomerBaseInterface>();

    const onSubmit = () => {
        console.log('submit')
    };

    const handleZipcode = (event: ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value
        if (value.length >= 4) {
            value = value.replace('ー', '-')
            if (!value.includes('-')) {
                value = insertString({original: value, position: 3, insert: '-'})
            }
        }
        setValue('zipcode', numberNormalize(value))
    }
    return (
        <ModalContainer
            title="顧客情報登録"
            isOpen={isModalOpen}
            setIsOpen={setIsModalOpen}
            Icon={FaUser}
        >
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex items-center flex-col w-full my-4"
            >
                <div className={'w-full max-w-xs'}>
                    <TextInput
                        errorMsg={errors.name?.message}
                        label={"名前"}
                        placeholder={"空野うさぎ"}
                        Icon={IoMdAdd}
                        register={register("name", {
                            required: "漢字名を入力してください。",
                        })}
                    />
                    <TextInput
                        errorMsg={errors.name_kana?.message}
                        label={"かな名 (optional)"}
                        placeholder={"そらのうさぎ"}
                        Icon={IoMdAdd}
                        register={register("name_kana")}
                    />
                    <TextInput
                        errorMsg={errors.zipcode?.message}
                        label={"郵便番号 (optional)"}
                        placeholder={"064-○○○〇"}
                        Icon={IoMdAdd}
                        isFit={true}
                        type={'tel'}
                        maxLength={8}
                        minLength={7}
                        register={register("zipcode", {
                            pattern: {
                                value: ZIP_CODE_PATTERN,
                                message: "012-3456のように入力してください"
                            },
                            onChange: (e) => handleZipcode(e)
                        })}
                    />
                    <TextAreaInput
                        errorMsg={errors.address?.message}
                        label={"住所"}
                        placeholder={"札幌市○○区"}
                        Icon={IoMdAdd}
                        rows={2}
                        register={register("address", {
                            required: "住所を入力してください。",
                        })}
                    />

                    <TextInput
                        errorMsg={errors.tel?.message}
                        label={"連絡先"}
                        placeholder={"うさぎ、いぬ、ねこ…"}
                        Icon={IoMdAdd}
                        register={register("tel", {
                            required: "ペットの種類を入力してください",
                        })}
                    />
                    <TextInput
                        errorMsg={errors.tel2?.message}
                        label={"緊急連絡先 (optional)"}
                        placeholder={"うさぎ、いぬ、ねこ…"}
                        Icon={IoMdAdd}
                        register={register("tel2", {
                            required: "ペットの種類を入力してください",
                        })}
                    />
                </div>
                <button type={'submit'}>submit</button>
            </form>
        </ModalContainer>
    );
}
