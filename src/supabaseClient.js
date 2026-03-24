import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://rllzxsuzaojqnconqwdd.supabase.co";
const supabaseAnonKey = "sb_publishable_Ti0ZPv-gtutIhzeE_7B8wA_HdeK5WFW";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

//https://rllzxsuzaojqnconqwdd.supabase.co/auth/v1/callback