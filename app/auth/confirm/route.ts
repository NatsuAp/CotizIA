import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {error} from "next/dist/build/output/log";

// Creating a handler to a GET request to route /auth/confirm
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = '/account'

  // Create redirect link without the secret token
  const redirectTo = request.nextUrl.clone()
  redirectTo.pathname = next
  redirectTo.searchParams.delete('token_hash')
  redirectTo.searchParams.delete('type')

  if (token_hash && type) {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    let password_cookies = false;
    if (!error) {
      redirectTo.searchParams.delete('next')
      //console.log(type)
      switch(type){
        case 'email':
          redirectTo.pathname = '/dashboard'
          break;
        case 'recovery':
          password_cookies = true
          redirectTo.pathname = '/recuperar-contrasena'
          break;
      }
      const response = NextResponse.redirect(new URL (redirectTo.pathname, request.url))
      if (password_cookies) {
         response.cookies.set("password-recovery", "true", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 10,
    path: "/",
  })
      }
      return NextResponse.redirect(redirectTo)
    }else{
      console.error("Error verificando OTP:")
  console.error(error)
  console.error("message:", error.message)
  console.error("status:", error.status)
  console.error("code:", error.code)

    }
  }

  // return the user to an error page with some instructions
  redirectTo.pathname = '/error'
  console.error()

  return NextResponse.redirect(redirectTo)
}