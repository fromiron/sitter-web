import { Dialog, Transition } from "@headlessui/react";
import { Dispatch, Fragment, ReactNode, SetStateAction, useRef } from "react";
import { IoClose } from "react-icons/io5";

export default function ModalContainer({
  show,
  setShow,
  children,
  Icon,
  title,
}: {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  children?: ReactNode;
  Icon?: any;
  title: string;
}) {
  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        initialFocus={cancelButtonRef}
        onClose={setShow}
      >
        <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
          </Transition.Child>

          {/* centering trick start */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          />
          {/* centering trick end */}

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block overflow-hidden text-left align-bottom transition-all transform rounded-md shadow-xl bg-neutral-content sm:my-8 sm:align-middle">
              <div className="flex items-center justify-between px-6 py-2 bg-gradient-to-r from-primary to-primary-focus text-primary-content">
                <div className="flex items-center">
                  <Icon className="mr-2" />
                  <div>{title}</div>
                </div>
                <div className="flex px-1 py-1" onClick={() => setShow(false)}>
                  <IoClose className="cursor-pointer" />
                </div>
              </div>
              <div className="px-4 pt-5 pb-4 overflow-hidden w-fit sm:p-6 sm:pb-4 bg-neutral-content">
                {children}
              </div>
              <div className="flex justify-end px-4 py-3 bg-base-100" />
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
