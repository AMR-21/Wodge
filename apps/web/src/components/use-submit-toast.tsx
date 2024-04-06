import { Button } from "@repo/ui/components/ui/button";
import { toast } from "@repo/ui/components/ui/toast";
import { Info } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";

export function useSubmitToast<T extends FieldValues>(
  form: UseFormReturn<T>,
  formRef: React.RefObject<HTMLFormElement> | null,
  customDirty = false,
) {
  const [toastId, setToastId] = useState<string | number>("");

  useEffect(() => {
    if (toastId) {
      toast.dismiss(toastId);
      setToastId("");
    }
    if (form.formState.isDirty || customDirty) {
      const toastId = toast(
        <div className="flex w-full items-center">
          <Info className="mr-2 h-5 w-5" />
          <p className="text-base">Unsaved changes</p>
          <div className="ml-auto flex items-center gap-1">
            <Button
              size="fit"
              variant="secondary"
              className="px-2.5"
              onClick={() => {
                form.reset();
              }}
            >
              Reset
            </Button>
            <Button
              size="fit"
              className="px-2.5"
              onClick={() => {
                formRef?.current?.requestSubmit();
              }}
            >
              Save
            </Button>
          </div>
        </div>,
        {
          duration: Infinity,
        },
      );
      setToastId(toastId);
    }
  }, [form.formState.isDirty, customDirty]);

  return { toastId };
}
