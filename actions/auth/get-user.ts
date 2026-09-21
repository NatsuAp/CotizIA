import { createClient } from '@/lib/supabase/server'
import {error} from "next/dist/build/output/log";

export const getUser = async () => {
    try{
        const supabase = await createClient()
    const {data: {user: session}} = await supabase.auth .getUser()

     if(!session){
         return null
     }
    const userId = session.id;

     const { data: userData, error: userError} = await supabase
         .from("profiles")
         .select("*")
         .eq('id', userId)
         .single();

     if(userError){
         throw new Error(userError.message)
     }
     return userData;
    }catch (e) {
        console.error('Error fetching user:', e);
        return null
    }


}