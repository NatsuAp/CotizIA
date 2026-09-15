'use server'


import { createClient } from '@/lib/supabase/server'

export async function login(formData: {
    email: string
    password: string
}) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs

  const { error, data } = await supabase.auth.signInWithPassword(formData)

  if (error) {
    //redirect('/error')
      return {
          success: false,
          message: error.message,

      }
  }

  //revalidatePath('/', 'layout')
  //redirect('/account')
    return {
      success: true,
        message: 'Usuario autenticado exitosamente',
        data
    }
}

///TODO: Esta funcion la estoy creando para tenerla, pero toca revisar y cuadrar como queremos que la creacion de cuentas se lleve acabo (ADMIN?, USUARIO?)

export async function signup(formData: {
    name: string,
    email: string,
    password: string
}) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs

  const { error, data } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
          data: {
              name: formData.name
          }
      }
      }
  )

  if (error) {
    //redirect('/error')
      return {
          success: false,
          message: error.message
      }
  }
    return {
      success: true,
        message: 'Usuario registrado exitosamente',
        data
    }
  //revalidatePath('/', 'layout')
  //redirect('/account')
}