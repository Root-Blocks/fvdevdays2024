"use client";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import { networks } from "rootnameservice";
import { useAuth } from "@futureverse/auth-react";
import Link from "next/link";

export default function Navbar() {
  const { userSession, signOut } = useAuth();
  const [rns, setRNS] = useState<string | null>(null);

  const provider = useMemo(
    () =>
      new ethers.providers.JsonRpcProvider(
        "https://root.rootnet.live/archive",
        networks.root
      ),
    []
  );

  const username = useMemo(() => {
    return (
      rns ||
      userSession?.futurepass.slice(0, 7) +
        "..." +
        userSession?.futurepass.slice(userSession.futurepass.length - 4)
    );
  }, [userSession, rns]);

  /**
   * Get the RNS name for the user's futurepass
   */
  useEffect(() => {
    const getRNS = async () => {
      if (userSession) {
        try {
          const rns = await provider.lookupAddress(
            userSession.futurepass.toLocaleLowerCase()
          );
          setRNS(rns);
        } catch (error) {
          console.error("Error getting RNS name: ", error);
          setRNS(null);
        }
      }
    };
    getRNS();
  }, [userSession]);

  return (
    <Disclosure as="nav" className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/">
                <img
                  alt="Rootblocks Logo"
                  src="/images/logo_transparent.png"
                  className="h-8 w-auto"
                />
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:block">
            <div className="flex items-center">
              {userSession && (
                <Menu as="div" className="relative ml-3">
                  <div>
                    <MenuButton className="relative flex rounded-full bg-rb-black text-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-rb-black focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      <p className="px-4 py-2 font-light">{username}</p>
                    </MenuButton>
                  </div>

                  <MenuItems
                    transition
                    className="absolute right-0 z-40 mt-2 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                  >
                    <MenuItem>
                      <a
                        onClick={() => {
                          signOut();
                        }}
                        className="block px-4 py-2 text-sm text-right text-gray-700 data-[focus]:bg-gray-100 cursor-pointer"
                      >
                        Sign out
                      </a>
                    </MenuItem>
                  </MenuItems>
                </Menu>
              )}
            </div>
          </div>
          <div className="-mr-2 flex sm:hidden">
            {/* Mobile menu button */}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-neutral-500 hover:bg-rb-black/25 hover:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-neutral-200">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon
                aria-hidden="true"
                className="block h-6 w-6 group-data-[open]:hidden"
              />
              <XMarkIcon
                aria-hidden="true"
                className="hidden h-6 w-6 group-data-[open]:block"
              />
            </DisclosureButton>
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        {userSession && (
          <div className="border-t border-gray-700 pb-3 pt-4">
            <div className="flex items-center px-5">
              <div className="ml-3">
                <div className="text-base font-medium text-white">
                  {username}
                </div>
              </div>
            </div>
            <div className="mt-3 space-y-1 px-2">
              <DisclosureButton
                as="a"
                onClick={() => {
                  signOut();
                }}
                className="block text-right rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
              >
                Sign out
              </DisclosureButton>
            </div>
          </div>
        )}
      </DisclosurePanel>
    </Disclosure>
  );
}
