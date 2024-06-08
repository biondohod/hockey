import { useForm } from "react-hook-form";
import { CreateCompetitionValidation } from "../../../lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateCompetition } from "../../../lib/react-query/mutations";
import "./CreateCompetition.scss";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const CreateCompetition = () => {
  const [matches, setMatches] = useState<number>(1);
  const { mutateAsync, isPending } = useCreateCompetition();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof CreateCompetitionValidation>>({
    resolver: zodResolver(CreateCompetitionValidation),
    mode: "all",
    defaultValues: {
      age: 14,
      closes_at: "",
      description: "",
      name: "",
      size: 4,
      tours: 1,
      matches: 1,
      days: [{ date: "", end_time: "", start_time: "" }],
    },
  });

  const onSubmit = (data: ICompetitionForm) => {
    const { age, description, name, size, tours, closes_at, days } = data;
    const formattedData: IFormattedCompetition = {
      age,
      closes_at,
      days,
      description: description || "",
      name,
      size,
      tours,
    };
    toast.promise(mutateAsync(formattedData), {
      pending: t("competitions.createCompetition.pending"),
    });
  };

  const handleMatchesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMatches(Number(event.target.value));
  };

  return (
    <div className={"create-competition"}>
      <h1 className="create-competition__title">
        {t("competitions.createCompetition.title")}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="auth__form">
        <label htmlFor="name" className="auth__label">
          {t("competitions.createCompetition.name")}
          <input
            type="text"
            id="name"
            className="auth__input"
            {...register("name")}
            required={true}
            autoComplete="off"
          />
          {errors.name && errors.name.message && (
            <p style={{ color: "red", fontSize: 14 }}>
              {t(errors.name.message)}
            </p>
          )}
        </label>
        <label htmlFor="description" className="auth__label">
          {t("competitions.createCompetition.description")}
          <textarea
            id="description"
            className="auth__input"
            {...register("description")}
            autoComplete="off"
          />
          {errors.description && errors.description.message && (
            <p style={{ color: "red", fontSize: 14 }}>
              {t(errors.description.message)}
            </p>
          )}
        </label>
        <label htmlFor="age" className="auth__label">
          {t("competitions.createCompetition.age")}
          <input
            type="number"
            id="age"
            className="auth__input"
            min={14}
            {...register("age", {
              setValueAs: (value) => parseInt(value),
            })}
            required={true}
            autoComplete="off"
          />
          {errors.age && errors.age.message && (
            <p style={{ color: "red", fontSize: 14 }}>
              {t(errors.age.message)}
            </p>
          )}
        </label>
        <label htmlFor="tours" className="auth__label">
          {t("competitions.createCompetition.tours")}
          <input
            type="number"
            id="tours"
            className="auth__input"
            min={1}
            {...register("tours", {
              setValueAs: (value) => parseInt(value),
            })}
            required={true}
            autoComplete="off"
          />
          {errors.tours && errors.tours.message && (
            <p style={{ color: "red", fontSize: 14 }}>
              {t(errors.tours.message)}
            </p>
          )}
        </label>
        <div className="create-competition__checkbox">
          <span className="auth__label">
            {t("competitions.createCompetition.format")}
          </span>
          <div className="create-competition__wrapper">
            <input
              type="radio"
              id="size4x4"
              value={4}
              {...register("size")}
              required={true}
              className={"visually-hidden"}
            />
            <label htmlFor="size4x4">4x4</label>
            <input
              type="radio"
              id="size6x6"
              value={6}
              {...register("size")}
              required={true}
              className={"visually-hidden"}
            />
            <label htmlFor="size6x6">6x6</label>
          </div>
        </div>
        <label htmlFor={"closes_at"} className={"auth__label"}>
          {t("competitions.createCompetition.closesAt")}
          <input
            type="date"
            id="closes_at"
            className={"auth__input"}
            {...register("closes_at")}
            required={true}
          />
          {errors.closes_at && errors.closes_at.message && (
            <p style={{ color: "red", fontSize: 14 }}>
              {t(errors.closes_at.message)}
            </p>
          )}
        </label>
        <label htmlFor="matches" className="auth__label">
          {t("competitions.createCompetition.matches")}
          <input
            type="number"
            id="matches"
            {...register("matches", { setValueAs: (value) => parseInt(value) })}
            className="auth__input"
            onChange={handleMatchesChange}
            min={1}
            required={true}
            autoComplete="off"
          />
          {errors.matches && errors.matches.message && (
            <p style={{ color: "red", fontSize: 14 }}>
              {t(errors.matches.message)}
            </p>
          )}
        </label>
        {Array.from({ length: matches }, (_, i) => (
          <div key={i}>
            <label htmlFor={`match${i}date`} className="auth__label">
              {t("competitions.createCompetition.date", { number: i + 1 })}
              <input
                type="date"
                id={`match${i}date`}
                className="auth__input"
                {...register(`days.${i}.date`)}
                required={true}
                autoComplete="off"
              />
              {errors.days && (
                <p style={{ color: "red", fontSize: 14 }}>
                  {t(errors?.days[i]?.date?.message || "")}
                </p>
              )}
            </label>
            <label htmlFor={`match${i}start_time`} className="auth__label">
              {t("competitions.createCompetition.timeStart", { number: i + 1 })}
              <input
                type="time"
                id={`match${i}start_time`}
                className="auth__input"
                {...register(`days.${i}.start_time`)}
                required={true}
              />
            </label>
            <label htmlFor={`match${i}end_time`} className="auth__label">
              {t("competitions.createCompetition.timeEnd", { number: i + 1 })}
              <input
                type="time"
                id={`match${i}end_time`}
                className="auth__input"
                {...register(`days.${i}.end_time`)}
                required={true}
              />
              {errors.days && (
                <p style={{ color: "red", fontSize: 14 }}>
                  {t(errors?.days[i]?.end_time?.message || "")}
                </p>
              )}
            </label>
          </div>
        ))}
        <button type="submit" className="auth__submit" disabled={isPending}>
          {t("competitions.createCompetition.create")}
        </button>
      </form>
    </div>
  );
};

export default CreateCompetition;
