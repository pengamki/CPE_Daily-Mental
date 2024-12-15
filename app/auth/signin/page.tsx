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
    <div className="flex justify-center items-center h-screen bg-pastel-blue">
      <div className="flex flex-col justify-center items-center p-4 bg-white rounded-lg shadow-lg">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-pastel-pink">Daily Form</h1>
        </div>
        <div className="mb-4">
          <button
            onClick={handleGoogleLogin}
            className="text-xl bg-pastel-purple text-white px-4 py-2 rounded-full hover:bg-pastel-pink"
          >
            Log in via Google
          </button>
        </div>
      </div>
    </div>
  )
}
