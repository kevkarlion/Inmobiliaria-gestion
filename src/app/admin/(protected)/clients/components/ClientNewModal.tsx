"use client";

import { ClientForm } from "@/components/shared/ClientForm/ClientForm";
import { ClientResponse } from "@/dtos/client/client-response.dto";

type Props = {
  onClose: () => void;
  onCreate: (client: ClientResponse) => void;
};

export default function ClientNewModal({ onClose, onCreate }: Props) {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-[2.5rem] shadow-2xl">
        <ClientForm
          onClose={onClose}
          onCreate={onCreate}
        />
      </div>
    </div>
  );
}
