"use client";

import { FunctionComponent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@ui/components/Dialog";
import { Button } from "@ui/components/Button";
import { ExternalLink } from "lucide-react";
import { HashLoader } from "react-spinners";
import { Address } from "@repo/common/src/Address";

export const PendingTransactionModal: FunctionComponent<
  Readonly<{
    isOpen: boolean;
    transactionHash?: `0x${string}`;
  }>
> = ({ isOpen, transactionHash }) => {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-[425px]" showCloseButton={false}>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <HashLoader size={22} color="white" />
            <DialogTitle>Transaction Pending</DialogTitle>
          </div>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-6 space-y-4">
          <p className="text-center text-sm text-gray-500">
            Your transaction is being processed. Please wait...
          </p>
          {transactionHash && (
            <>
              <p className="text-center text-sm text-gray-400 break-all">
                Transaction Hash: {Address.truncate(transactionHash)}
              </p>
              <a
                href={`https://amoy.polygonscan.com/${transactionHash}`}
                target="_blank"
                rel="noreferrer"
              >
                <Button className="flex items-center space-x-2">
                  <ExternalLink size={16} />
                  <span>View on Explorer</span>
                </Button>
              </a>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
