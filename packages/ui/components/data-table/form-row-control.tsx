import { Check, X } from "lucide-react";
import { SidebarItemBtn } from "../sidebar-item-btn";

interface FormRowControlProps {
  formId?: string;
  formIsSubmitted?: boolean;
  setIsEditing: (value: boolean) => void;
}

export function FormRowControl({
  formId,
  formIsSubmitted,
  setIsEditing,
}: FormRowControlProps) {
  return (
    <div className="flex">
      <SidebarItemBtn
        Icon={Check}
        className="hover:text-success-base"
        form={formId}
        type="submit"
        onClick={() => {
          if (formIsSubmitted) setIsEditing(false);
        }}
      />
      <SidebarItemBtn
        Icon={X}
        onClick={(e) => {
          e.preventDefault();
          setIsEditing(false);
        }}
        className="hover:text-destructive-base"
      />
    </div>
  );
}
