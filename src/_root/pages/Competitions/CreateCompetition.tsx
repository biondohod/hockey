import {useForm} from "react-hook-form";
import {CreateCompetitionValidation} from "../../../lib/validation";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {useCreateCompetition} from "../../../lib/react-query/mutations";
import './CreateCompetition.scss'
import {toast} from "react-toastify";

const CreateCompetition = () => {
    const {mutateAsync, isPending} = useCreateCompetition();

    const {register, handleSubmit, formState: {errors}} = useForm<
        z.infer<typeof CreateCompetitionValidation>
    >({
        resolver: zodResolver(CreateCompetitionValidation),
        mode: "all",
        defaultValues: {
            age: 14,
            closes_at: "",
            date: "",
            end_time: "",
            start_time: "",
            description: "",
            name: "",
            size: 4,
            tours: 1,
        },
    });

    const onSubmit = (data: ICompetitionForm) => {
        const {age, description, end_time, start_time, name, size, tours, date, closes_at} = data
        const formattedData: IFormattedCompetition = {
            age,
            closes_at,
            days: [
                {
                    date,
                    end_time,
                    start_time,
                }
            ],
            description: description || "",
            name,
            size,
            tours,
        }
        toast.promise(mutateAsync(formattedData), {
            pending: "Создание турнира",
        });
    };

    return (
        <div className={"create-competition"}>
            <h1 className="create-competition__title">
                Создание турнира
            </h1>
            <form onSubmit={handleSubmit(onSubmit)} className="auth__form">
                <label htmlFor="name" className="auth__label">
                    Название
                    <input
                        type="text"
                        id="name"
                        className="auth__input"
                        {...register("name")}
                        required={true}
                        autoComplete="off"
                    />
                    {errors.name && <p style={{color: "red", fontSize: 14}}>{errors.name.message}</p>}
                </label>
                <label htmlFor="description" className="auth__label">
                    Краткое описание турнира
                    <textarea
                        id="description"
                        className="auth__input"
                        {...register("description")}
                        autoComplete="off"
                    />
                    {errors.description && <p style={{color: "red", fontSize: 14}}>{errors.description.message}</p>}
                </label>
                <label htmlFor="date" className="auth__label">
                    Дата проведения турнира
                    <input
                        type="date"
                        id="date"
                        className="auth__input"
                        {...register("date")}
                        required={true}
                        autoComplete="off"
                    />
                    {errors.date && <p style={{color: "red", fontSize: 14}}>{errors.date.message}</p>}
                </label>
                <label htmlFor="start_time" className="auth__label">
                    Время начала турнира
                    <input
                        type="time"
                        id="start_time"
                        className="auth__input"
                        {...register("start_time")}
                        required={true}
                    />
                    {errors.start_time && <p style={{color: "red", fontSize: 14}}>{errors.start_time.message}</p>}
                </label>
                <label htmlFor="end_time" className="auth__label">
                    Время окончания турнира
                    <input
                        type="time"
                        id="end_time"
                        className="auth__input"
                        {...register("end_time")}
                        required={true}
                    />
                    {errors.end_time && <p style={{color: "red", fontSize: 14}}>{errors.end_time.message}</p>}
                </label>
                <label htmlFor="age" className="auth__label">
                    Допустимый возраст игроков
                    <input
                        type="number"
                        id="age"
                        className="auth__input"
                        min={14}
                        {...register("age", {
                            setValueAs: value => parseInt(value)
                        })}
                        required={true}
                        autoComplete="off"
                    />
                    {errors.age && <p style={{color: "red", fontSize: 14}}>{errors.age.message}</p>}
                </label>
                <label htmlFor="tours" className="auth__label">
                    Количество туров
                    <input
                        type="number"
                        id="tours"
                        className="auth__input"
                        min={1}
                        {...register("tours", {
                            setValueAs: value => parseInt(value)
                        })}
                        required={true}
                        autoComplete="off"
                    />
                    {errors.tours && <p style={{color: "red", fontSize: 14}}>{errors.tours.message}</p>}
                </label>
                <div className="create-competition__checkbox">
                    <span className="auth__label">Формат</span>
                    <div className="create-competition__wrapper">
                        <input
                            type="radio"
                            id="size4x4"
                            value={4}
                            {...register("size")}
                            required={true}
                            className={"visually-hidden"}
                            checked={true}
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
                    Закрытие регистрации
                    <input
                        type="date"
                        id="closes_at"
                        className={"auth__input"}
                        {...register("closes_at")}
                        required={true}
                    />
                    {errors.closes_at && <p style={{color: "red", fontSize: 14}}>{errors.closes_at.message}</p>}
                </label>
                <button type="submit" className="auth__submit" disabled={isPending}>
                    Создать
                </button>
            </form>
        </div>

    );
};

export default CreateCompetition;
