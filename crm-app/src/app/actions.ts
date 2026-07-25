'use server'

import { neon } from '@neondatabase/serverless';
import { revalidatePath } from 'next/cache';

export async function updateLeadStatus(email: string, newStatus: string) {
  const sql = neon(process.env.DATABASE_URL!);
  await sql`UPDATE prospects SET last_status = ${newStatus} WHERE email = ${email}`;
  revalidatePath('/');
  revalidatePath('/database');
}

export async function updateLeadNotes(email: string, notes: string) {
  const sql = neon(process.env.DATABASE_URL!);
  await sql`UPDATE prospects SET notes = ${notes} WHERE email = ${email}`;
  revalidatePath('/');
  revalidatePath('/database');
}

export async function updateClientStatus(email: string, isClient: string) {
  const sql = neon(process.env.DATABASE_URL!);
  await sql`UPDATE prospects SET client = ${isClient} WHERE email = ${email}`;
  revalidatePath('/');
  revalidatePath('/database');
}
