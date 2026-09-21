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
import {enviarCorreoRecuperacion} from "@/actions/auth/auth";

const formSchema = z.object({
    email: z
        .email("Por favor ingresa un correo válido. Ejemplo: user@mail.com"),
})

type FormValues = z.infer<typeof formSchema>

const RecoverPasswordForm = ({ setTypeSelected }: AuthFormProps) => {
    const [isLoading, setIsLoading] = useState(false)

    // ============ Form ============
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    })

    // ============ Password Recovery ============
    const onSubmit = async (user: FormValues) => {
        setIsLoading(true)

        try {
            const res = await enviarCorreoRecuperacion(user);

            if(res.success){
                toast.success(res.message);
                setTypeSelected('sign-in');
            }
        } catch (error: unknown) {
    const message =
        error instanceof Error
            ? error.message
            : "Ha ocurrido un error inesperado"

    toast.error(message, { duration: 2500 })
}finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
            <div className="w-full backdrop-blur-xl py-6 rounded-4xl">
                <div className="rounded-xl px-6">
                    <div className="text-center">
                        <h1 className="lg:text-5xl md:text-4xl text-3xl font-semibold text-center my-4">
                            Recuperar Contraseña
                        </h1>

                        <p className="text-sm text-muted-foreground mb-8">
                            Te enviaremos un correo para recuperar tu contraseña
                        </p>
                    </div>

                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup className="gap-2">
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
                                className="my-6"
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading && (
                                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                )}

                                Recuperar
                            </Button>
                        </FieldGroup>
                    </form>

                    {/* ========== Volver ========== */}
                    <p className="text-center text-sm text-white mt-3">
                        <span
                            onClick={() => setTypeSelected("sign-in")}
                            className="underline underline-offset-4 hover:text-primary cursor-pointer"
                        >
                            Volver
                        </span>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default RecoverPasswordForm