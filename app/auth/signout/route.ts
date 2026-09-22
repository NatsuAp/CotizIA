import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()


    const{ error } = await supabase.auth.signOut()


  if (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    )
  }

  revalidatePath('/', 'layout')
  //return NextResponse.redirect(new URL('/', req.url), {status: 302,})

  const response = NextResponse.json ({
    success:true,
  })
  response.cookies.delete("password-recovery")
  return response;
}