"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast";

const SignOutButton = () => {
  const router = useRouter()

  const handleSignOut = async () => {
    await fetch("auth/signout", {
      method: "POST",
    })
    router.replace("/")
    router.refresh()
    toast.success("Sesion cerrada exitosamente")

  }

  return (
    <Button onClick={handleSignOut}>
      Cerrar sesión
    </Button>
  )
}

export default SignOutButton