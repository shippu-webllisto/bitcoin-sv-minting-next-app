import Link from 'next/link';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { endpoints } from '@/routes/endpoints.js';
import { checkEmptyValue } from '@/utils/checkEmptyValue.js';
import { useUpdateBalance } from '@/containers/hooks';

const Navbar = () => {
  const { CurrenWalletUpdate } = useUpdateBalance();
  const { auth } = useSelector((state) => state.authentication);
  const { walletAddress, network, mnemonic } = useSelector((state) => state.walletConnect);

  const refreshHandler = (e) => {
    e.stopPropagation();
    CurrenWalletUpdate(network, mnemonic);
  };

  return (
    <>
      <header aria-label="Site Header" className=" bg-[#527195] text-gray-100 overflow-hidden sticky top-0 z-30">
        <div className="mx-auto flex items-center gap-8 px-4 h-16 xl:px-32  sm:px-6 lg:px-8 my-2">
          <div className="block text-teal-600 hover:text-orange-400 w-1/10 ">
            <Image
              src="/bitcoin-sv-bsv-logo.svg"
              alt="logo"
              width={35}
              height={35}
              priority
              className="inline-block align-middle"
            />
            {auth && !checkEmptyValue(network) && (
              <span className="font-mono font-bold text-center bg-red-700 text-white rounded-md inline-block align-middle w-4/10 ml-2 border-lg px-2 py-1 text-xs">
                {network}
              </span>
            )}
          </div>

          <div className="flex flex-1 items-center justify-end md:justify-between">
            <nav aria-label="Site Nav" className="hidden md:block">
              <ul className="flex items-center gap-6 text-sm"></ul>
            </nav>

            <div className="flex items-center gap-4">
              {auth && !checkEmptyValue(walletAddress) && (
                <div>
                  <button onClick={(e) => refreshHandler(e)} title="Refresh Balance">
                    <Image
                      className="cursor-pointer"
                      src="/assets/svgs/refresh-svgrepo-com.svg"
                      alt="setting-logo"
                      width={20}
                      height={20}
                    />
                  </button>
                </div>
              )}

              <div className="sm:flex sm:gap-4">
                {auth && !checkEmptyValue(walletAddress) && (
                  <Link href={endpoints.setting}>
                    <Image
                      className="cursor-pointer"
                      src="/assets/svgs/settings-gear-svgrepo-com.svg"
                      alt="setting-logo"
                      width={40}
                      height={40}
                    />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
