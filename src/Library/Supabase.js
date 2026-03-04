import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://jjcgzsppwipbsqslansa.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqY2d6c3Bwd2lwYnNxc2xhbnNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2MDM5NzAsImV4cCI6MjA4ODE3OTk3MH0.8aCU7t5MnIpdSYbmlkSPS-vgEdErx2cqN65gROt3QtE";

export const supabase = createClient(supabaseUrl, supabaseKey);