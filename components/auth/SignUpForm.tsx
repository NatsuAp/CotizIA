"use client"

import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { LoaderCircle } from "lucide-react"
import toast from "react-hot-toast"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"

import { AuthFormProps } from "./AuthForm"
import {signup} from "@/actions/auth/auth";

const formSchema = z.object({
    name: z
        .string()
        .min(4, "El nombre debe tener al menos 4 caracteres")
        .max(20, "El nombre no puede tener más de 20 caracteres")
        .regex(
            /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
            "El nombre solo puede contener letras"
        ),

    email: z.email(
        "Por favor ingresa un correo válido. Ejemplo: user@mail.com"
    ),

    password: z.string().min(6, {
        message: "La contraseña debe tener al menos 6 caracteres",
    }),
})

type FormValues = z.infer<typeof formSchema>

const SignUpForm = ({ setTypeSelected }: AuthFormProps) => {
    const [isLoading, setIsLoading] = useState(false)

    // ============ Form ============
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    })

    // ============ Sign Up ============
    const onSubmit = async (user: FormValues) => {
        setIsLoading(true)

        try {
            //console.log(user)
            const res = await signup(user)
            if (res.success){
                //TODO: Esto es simplemente por si acaso, toca validar como se realizara validacion y creacion de cuenta
                toast.success(`Hola, ${user.name}. Se te envio un correo para validar tu cuenta`,{
                    duration: 4000,
                    icon: '😀'
                }),
                    setTypeSelected('sign-in');
                form.reset();
                }else{
                toast.error(res.message)
            }

        } catch (error) {
    const message =
        error instanceof Error
            ? error.message
            : "Error al registrar el usuario"

    if (message.includes("User already registered")) {
        toast.error(
            "Este correo electrónico ya está registrado",
            { duration: 4000 }
        )
    } else if (
        message.includes(
            "Password should be at least 6 characters"
        )
    ) {
        toast.error(
            "La contraseña debe tener al menos 6 caracteres",
            { duration: 4000 }
        )
    } else if (message.includes("Invalid email")) {
        toast.error(
            "Por favor ingresa un correo electrónico válido",
            { duration: 4000 }
        )
    } else {
        toast.error(message, { duration: 4000 })
    }
}
        finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
            <div className="w-full backdrop-blur-xl rounded-4xl pb-4">
                <div className="text-center">
                    <h1 className="lg:text-5xl md:text-4xl text-3xl font-semibold text-center my-4">
                        Crear Cuenta
                    </h1>

                    <p className="text-sm text-muted-foreground mb-8">
                        Crea una cuenta para acceder a todo el contenido
                    </p>
                </div>

                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="mx-4"
                >
                    <FieldGroup className="gap-2">
                        {/* ========== Name ========== */}
                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field
                                    className="mb-3"
                                    data-invalid={fieldState.invalid}
                                >
                                    <FieldLabel htmlFor={field.name}>
                                        Nombre
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        id={field.name}
                                        placeholder="John"
                                        type="text"
                                        autoComplete="name"
                                        maxLength={20}
                                        disabled={isLoading}
                                        aria-invalid={fieldState.invalid}
                                    />

                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />

                        {/* ========== Email ========== */}
                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field
                                    className="mb-3"
                                    data-invalid={fieldState.invalid}
                                >
                                    <FieldLabel htmlFor={field.name}>
                                        Correo
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        id={field.name}
                                        placeholder="name@example.com"
                                        type="email"
                                        autoComplete="email"
                                        maxLength={50}
                                        disabled={isLoading}
                                        aria-invalid={fieldState.invalid}
                                    />

                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />

                        {/* ========== Password ========== */}
                        <Controller
                            name="password"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field
                                    className="mb-3"
                                    data-invalid={fieldState.invalid}
                                >
                                    <FieldLabel htmlFor={field.name}>
                                        Contraseña
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        id={field.name}
                                        placeholder="*****"
                                        type="password"
                                        autoComplete="new-password"
                                        maxLength={50}
                                        disabled={isLoading}
                                        aria-invalid={fieldState.invalid}
                                    />

                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />

                        {/* ========== Submit ========== */}
                        <Button
                            className="mt-6"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading && (
                                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                            )}

                            Crear cuenta
                        </Button>
                    </FieldGroup>
                </form>

                {/* ========== Sign In ========== */}
                <p className="text-center text-sm mt-6 text-white">
                    ¿Ya tienes una cuenta?{" "}

                    <span
                        onClick={() =>
                            !isLoading &&
                            setTypeSelected("sign-in")
                        }
                        className="underline underline-offset-4 hover:text-primary cursor-pointer"
                    >
                        Inicia Sesión
                    </span>
                </p>
            </div>
        </div>
    )
}

export default SignUpForm