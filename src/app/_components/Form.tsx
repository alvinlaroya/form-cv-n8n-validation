"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";

import profileSchema from "../lib/validation/profileSchema";

type SchemaProps = z.infer<typeof profileSchema>;

function Form() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    reset
  } = useForm<SchemaProps>({
    resolver: zodResolver(profileSchema),
  });

  const [isValidate, setIsValidate] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [cvUrl, setCVUrl] = useState("");

  const profileMutation = api.profile.create.useMutation({
    onSuccess: async () => {
      console.log("Created Profile!");
    },
    onError: (error) => {
      console.log("Error in creating profile", error);
    },
  });

  const submitForm = (data: SchemaProps) => {
    reset();
    profileMutation.mutate({
      ...data,
      skills: data.skills.split(","),
      cv: cvUrl,
    });
    setIsValidate(false);

  };

  const validateForm = async (data: SchemaProps) => {
    setIsValidate(false);

    const formData = new FormData();
    formData.append("fullname", data.fullname);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("skills", data.skills);
    formData.append("experience", data.experience);
    formData.append("file", data.cv);

    try {
      const response = await fetch("/api/profile", {
        method: "post",
        body: formData,
      });

      const result = await response.json();

      setCVUrl(result.cvUrl);
      const validation = JSON.parse(result.validation[0].output);

      if (validation.valid) {
        setIsValid(true);
      } else {
        setIsValid(validation.valid);

        validation.invalidFields.forEach((item: { property: string; message: string }) => {
          setError(item.property, {
            type: "manual",
            message: item.message || "This field is required", // Use dynamic message
          });
        });
      }
    } catch (error) {
      alert(error);
    } finally {
      setIsValidate(true);
    }
  };

  const getInputClassName = (hasError: any) => {
    const baseClasses = "w-full rounded px-3 py-2 focus:outline-none";
    const errorClasses =
      "border border-red-500 focus:ring-2 focus:ring-red-500";
    const normalClasses =
      "border border-gray-300 focus:ring-2 focus:ring-blue-500";

    return `${baseClasses} ${hasError ? errorClasses : normalClasses}`;
  };

  return (
    <div className="mx-auto max-w-md bg-white p-6 text-black">
      {isValid && isValidate && (
        <div className="mb-4 border border-green-500 p-3 text-green-500">
          <p className="mb-2 text-lg font-bold text-green-500">
            Validation Passed!
          </p>
          <span>Please submit your profile</span>
        </div>
      )}
      <div onSubmit={handleSubmit(submitForm)} className="space-y-4">
        <div>
          <label
            htmlFor="fullname"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Full Name
          </label>
          <input
            id="fullname"
            type="text"
            {...register("fullname")}
            disabled={isSubmitting}
            className={getInputClassName(errors?.fullname)}
          />
          {errors?.fullname && (
            <span className="mt-1 block text-sm text-red-500">
              {errors.fullname.message}
            </span>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            disabled={isSubmitting}
            className={getInputClassName(errors?.email)}
          />
          {errors?.email && (
            <span className="mt-1 block text-sm text-red-500">
              {errors.email.message}
            </span>
          )}
        </div>

        <div>
          <label
            htmlFor="phone"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            {...register("phone")}
            disabled={isSubmitting}
            className={getInputClassName(errors?.phone)}
          />
          {errors?.phone && (
            <span className="mt-1 block text-sm text-red-500">
              {errors.phone.message}
            </span>
          )}
        </div>

        <div>
          <label
            htmlFor="skills"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Skills
          </label>
          <input
            id="skills"
            type="text"
            {...register("skills")}
            disabled={isSubmitting}
            placeholder="e.g. vue, react, svelte"
            className={getInputClassName(errors?.skills)}
          />
          <span className="text-xs text-gray-500">Separated by commas</span>
          {errors?.skills && (
            <span className="mt-1 block text-sm text-red-500">
              {errors.skills.message}
            </span>
          )}
        </div>

        <div>
          <label
            htmlFor="experience"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Relevant Experience
          </label>
          <textarea
            id="experience"
            {...register("experience")}
            rows={4}
            disabled={isSubmitting}
            className={getInputClassName(errors?.experience)}
          />
          {errors?.experience && (
            <span className="mt-1 block text-sm text-red-500">
              {errors.experience.message}
            </span>
          )}
        </div>

        <div>
          <label
            htmlFor="cv"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Upload your CV (PDF only)
          </label>
          <input
            id="cv"
            type="file"
            accept=".pdf"
            {...register("cv")}
            disabled={isSubmitting}
            className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          {errors?.cv && (
            <span className="mt-1 block text-sm text-red-500">
              {errors.cv.message}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleSubmit(isValidate && isValid ? submitForm : validateForm)}
          className={`w-full rounded bg-blue-600 px-4 py-3 font-medium text-white transition-colors duration-200 hover:bg-blue-700 ${isSubmitting ? "cursor-not-allowed" : "cursor-pointer"}`}
          disabled={isSubmitting}
        >
          {isValidate && isValid ? (
            <span>Submit Application</span>
          ) : (
            <span>{isSubmitting ? 'Validating...' : 'Validate Application'}</span>
          )}
        </button>
      </div>
    </div>
  );
}

export default Form;
