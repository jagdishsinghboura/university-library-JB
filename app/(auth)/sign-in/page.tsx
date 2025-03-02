"use client"
import AuthForm from '@/components/AuthForm'
import { signInWithCredentials } from '@/lib/actions/auth'
import ratelimit from '@/lib/ratelimit'
import { signInSchema } from '@/lib/Validation'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import React from 'react'

const page = () => {
  
  
    
  return <AuthForm
  type="SIGN_IN"
  schema={signInSchema}
  defaultValues={{
    email:"",
    password:"",

  }}
  onSubmit= {signInWithCredentials}
  />
}

export default page