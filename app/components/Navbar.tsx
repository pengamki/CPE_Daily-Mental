'use client'

import React from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../lib/firebase'
import { useRouter } from 'next/navigation'
import { User } from '../page'

interface Props {
    user: User | null
}

export default function Navbar({ user }: Props) {
    const router = useRouter()

  return (
    <div className='bg-white h-16 flex justify-evenly items-center'>
        <div className='flex items-center'>
            <div className='w-6 h-6 rounded-[50%] overflow-hidden'>
                <img className='w-full object-cover' src={user?.profile} alt={user?.name} />
            </div>
            <p className='ml-2'>{user?.email}</p>
        </div>
        {user ? (
            <button className="px-4 py-2 rounded-full hover:bg-pastel-pink border border-black" onClick={() => {
                signOut(auth)
                router.push('/auth/signin')
            }}>
                Sign out
            </button>
        ) : (
            <button className="px-4 py-2 rounded-full hover:bg-pastel-pink border border-black" onClick={() => {
                router.push('/auth/signin')
            }}>
                Sign in
            </button>
        )}
    </div>
  )
}
