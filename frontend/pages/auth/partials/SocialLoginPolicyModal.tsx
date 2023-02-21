import ModalContainer from "@components/layout/ModalContainer";
import {FaUser} from 'react-icons/fa'
import {Dispatch, SetStateAction} from "react";

export function SocialLoginPolicyModal({isModalOpen, setIsModalOpen}: {
    isModalOpen: boolean;
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}) {

    return (
        <ModalContainer
            title="ソシアルアカウントログインポリシー"
            isOpen={isModalOpen}
            setIsOpen={setIsModalOpen}
            Icon={FaUser}
        >
            <div className="flex flex-col w-full text-sm">
                <div>
                    本管理サイトはLineまたはGoogleのSNS(Social Network Service)かカウントにてご利用いただけます。
                </div>
                <div className="divider"/>
                <div className="">
                    本管理サイトでは、SNSアカウントログイン時の認証を頂く場合、各SNSに登録されたメールアドレスと取得します。
                    取得したメールアドレスは、第3者への情報共有または下記以外の理由で使用されることはございません。
                </div>
                <div className="divider"/>
                <div>
                    <ul>
                        <li>
                            1．ユーザーアカウントとしての管理
                        </li>
                        <li>
                            2． パスワード再発行
                        </li>
                        <li>
                            3． 本人確認
                        </li>
                    </ul>
                </div>
            </div>

        </ModalContainer>
    );
}
