"use client"

import { useState } from "react"
import Link from "next/link"
import * as z from "zod"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import {actualizarContrasena} from "@/actions/auth/auth";
import {useRouter} from "next/navigation";

const formSchema = z
  .object({
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

type UpdatePasswordFormValues = z.infer<typeof formSchema>

const UpdatePasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const form = useForm<UpdatePasswordFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (data: UpdatePasswordFormValues) => {
    setIsLoading(true)

    try {
      //console.log(data)
      const res = await actualizarContrasena(data)

        if(res.success){
            try {
               const response = await fetch("/auth/signout", {
                    method: "POST",
                })
                if (!response.ok){
                    throw new Error ("No se pudo cerrar sesion")
                }
                 toast.success(res.message);
                router.replace("/")
                router.refresh()
            }catch (error){
                toast.error("Error al cerrar sesion, probablemente no estaba iniciada")
                return
            }

            }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Ocurrió un error inesperado"

      toast.error(message, { duration: 2500 })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md backdrop-blur-xl bg-background py-6 rounded-4xl lg:border lg:border-white/50">
      <div className="rounded-xl px-6">
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-center my-4">
            Nueva Contraseña
          </h1>

          <p className="text-sm text-muted-foreground mb-8">
            Ingresa tu nueva contraseña
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Nueva Contraseña
                  </FieldLabel>

                  <Input
                    {...field}
                    id={field.name}
                    type="password"
                    autoComplete="new-password"
                    disabled={isLoading}
                    aria-invalid={fieldState.invalid}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Confirmar Contraseña
                  </FieldLabel>

                  <Input
                    {...field}
                    id={field.name}
                    type="password"
                    autoComplete="new-password"
                    disabled={isLoading}
                    aria-invalid={fieldState.invalid}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Button className="mt-6" type="submit" disabled={isLoading}>
              {isLoading && (
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              )}
              Actualizar Contraseña
            </Button>

            <Link
              href="/"
              className="text-center text-sm text-white mt-3 underline underline-offset-4 hover:text-primary cursor-pointer"
            >
              Volver
            </Link>
          </FieldGroup>
        </form>
      </div>
    </div>
  )
}

export default UpdatePasswordForm