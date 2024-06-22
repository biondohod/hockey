import { useParams } from "react-router-dom";
import { useGetCompetition } from "../../../lib/react-query/queries";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../../../components/Loader/Loader";
import { useUpdateCompetition } from "../../../lib/react-query/mutations";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { EditCompetitionValidation } from "../../../lib/validation";
import DeleteProfileOrCompetition from "../../../components/DeleteProfileOrCompetition/DeleteProfileOrCompetition";

const EditCompetition = () => {
  const { id } = useParams<{ id: string }>();
  const competitionId = id ? parseInt(id) : undefined;
  const { data, isLoading } = useGetCompetition(competitionId);
  const { mutateAsync, isPending } = useUpdateCompetition();
  const { t } = useTranslation();
  const [defaultValues, setDefaultValues] = useState<
    IEditCompetition | undefined
  >();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof EditCompetitionValidation>>({
    resolver: zodResolver(EditCompetitionValidation),
    defaultValues,
  });

  useEffect(() => {
    if (!isLoading && data) {
      const { closes_at, description, name } = data;
      setDefaultValues({closes_at, description, name});
      reset({ closes_at, description, name });
    }
    if (!isLoading && !data) {
      setDefaultValues({
        closes_at: "",
        description: "",
        name: "",
      });
    }
  }, [isLoading]);
  

  const onSubmit = (data: IEditCompetition) => {
    const { description, name, closes_at } = data;
    const formattedData: IEditCompetition = {
      closes_at,
      description: description || "",
      name,
    };
    if (competitionId) {
      toast.promise(
        mutateAsync({ id: competitionId, competition: formattedData }),
        {
          pending: t("competitions.createCompetition.pending"),
        }
      );
    }
  };

  return (
    <>
      {isLoading || !defaultValues ? (
        <Loader marginTop={32}/>
      ) : (
        <div className={"create-competition"}>
          <h1 className="create-competition__title">
            {t("competitions.editCompetition.title")}
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
            <button type="submit" className="auth__submit" disabled={isPending}>
              {t(`competitions.createCompetition.edit`)}
            </button>
          </form>
          <DeleteProfileOrCompetition type="competition" competitionId={competitionId}/>
        </div>
      )}
    </>
  );
};

export default EditCompetition;
