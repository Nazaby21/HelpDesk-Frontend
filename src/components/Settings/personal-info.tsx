"use client";

import { UserIcon } from "@/assets/icons";
import InputGroup from "@/components/FormElements/InputGroup";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/feature/auth/authSlice";

export function PersonalInfoForm() {
  const currentUser = useAppSelector(selectCurrentUser);

  const firstName = currentUser?.firstName || "";
  const lastName = currentUser?.lastName || "";
  const email = currentUser?.email || "";

  return (
    <ShowcaseSection title="Personal Information" className="!p-7">
      <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
        <InputGroup
          className="w-full sm:w-1/2"
          type="text"
          name="firstName"
          label="First Name"
          placeholder="First Name"
          defaultValue={firstName}
          icon={<UserIcon />}
          iconPosition="left"
          height="sm"
          disabled
        />

        <InputGroup
          className="w-full sm:w-1/2"
          type="text"
          name="lastName"
          label="Last Name"
          placeholder="Last Name"
          defaultValue={lastName}
          icon={<UserIcon />}
          iconPosition="left"
          height="sm"
          disabled
        />
      </div>

      <InputGroup
        className="mb-5.5"
        type="email"
        name="email"
        label="Email Address"
        placeholder="Email"
        defaultValue={email}
        disabled
        height="sm"
      />
    </ShowcaseSection>
  );
}
