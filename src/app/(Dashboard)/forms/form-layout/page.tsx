import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import type { Metadata } from "next";
import { ContactForm } from "@/components/Forms/contact-form";
import { SignInForm } from "@/components/Forms/sign-in-form";
import { SignUpForm } from "@/components/Forms/sign-up-form";

export const metadata: Metadata = {
  title: "Form Layout",
};

export default function Page() {
  return (
    <>
      <Breadcrumb pageName="Form Layout" />

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <div className="flex flex-col gap-9">
          <ContactForm />
        </div>

        <div className="flex flex-col gap-9">
          <SignInForm />

          <SignUpForm />
        </div>
      </div>
    </>
  );
}
