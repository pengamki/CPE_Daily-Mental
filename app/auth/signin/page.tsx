'use client'

import React from 'react'
import { auth } from '../../lib/firebase'
import { signInWithPopup } from 'firebase/auth'
import { GoogleAuthProvider } from 'firebase/auth'

export default function GoogleLoginPage() {

    function handleGoogleLogin() {
        signInWithPopup(auth, new GoogleAuthProvider())
        .then(() => {
            window.location.href = "/"
        })
          .catch((error) => {
            console.log(error);
          });
    }

  return (
    <div className="flex justify-center items-center h-screen bg-pastel-cream">
      <div className="flex flex-col justify-center items-center p-4 rounded-lg">
        
        <div className="mb-6">
          <img src="/images/DailyPill.png" width={150} height={150}  alt="DailyPill" />
        </div>
        <div className="mb-4 flex justify-center items-center">
          <h1 className="text-3xl font-bold">Daily Mental Health Form</h1>
        </div>
        <div className="mb-4">
          <button
            onClick={handleGoogleLogin}
            className="text-xl px-4 py-2 rounded-full hover:bg-pastel-pink border border-black"
          >
            Take your pill
          </button>
        </div>
      </div>
    </div>
  )
}
