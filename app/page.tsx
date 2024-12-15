'use client'

import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './lib/firebase';
import { useRouter } from 'next/navigation';
import { db } from './lib/firebase';
import { addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { toast } from 'react-toastify';

export interface User {
  profile: string
  name: string
  email: string
}

const Page = () => {
  const router = useRouter();
  const [question1, setQuestion1] = useState(0);
  const [question2, setQuestion2] = useState(0);
  const [question3, setQuestion3] = useState(0);
  const [question4, setQuestion4] = useState(0);
  const [question5, setQuestion5] = useState(0);
  const [question6, setQuestion6] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [formSubmittedToday, setFormSubmittedToday] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser({ profile: u.photoURL as string, name: u.displayName as string, email: u.email as string });

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const q = query(
          collection(db, 'daily'),
          where('userEmail', '==', u.email),
          where('createdAt', '==', today)
        );

        const querySnapshot = await getDocs(q);
        console.log(querySnapshot.docs)
        if (querySnapshot.docs.length > 0) {
          setFormSubmittedToday(true);
          router.push('/dailypill');
        }
      } else {
        router.push('/auth/signin');
      }
    });
  }, [router]);

  function setQuestion(question: number, questionValue: number) {
    switch (question) {
      case 1:
        setQuestion1(questionValue);
        break;
      case 2:
        setQuestion2(questionValue);
        break;
      case 3:
        setQuestion3(questionValue);
        break;
      case 4:
        setQuestion4(questionValue);
        break;
      case 5:
        setQuestion5(questionValue);
        break;
      case 6:
        setQuestion6(questionValue);
        break;
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!question1 || !question2 || !question3 || !question4 || !question5 || !question6) {
      return toast("Please answer all question!", { type: "warning" })
    }

      const date = new Date();
      date.setHours(0, 0, 0, 0);
      await addDoc(collection(db, "daily"), {
        userEmail: user?.email,
        q1: question1,
        q2: question2,
        q3: question3,
        q4: question4,
        q5: question5,
        q6: question6,
        createdAt: date
      });
      toast("Form submitted", {
        type: "success"
      })

    router.push('/dailypill');
  }

  if (formSubmittedToday) {
    return null; // Render nothing while redirecting
  }

  return (
    <div>
      <Navbar user={user} />
      <div className="flex justify-center items-center h-screen bg-pastel-cream">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-10 text-center">How are you today?</h1>

        <div key={1} className="mb-6">
          <label className="block mb-2 text-center">Mood</label>
          <div className="flex justify-between">
            {[...Array(5)].map((_, index) => (
              <label key={index} className="flex items-center">
                <input onChange={() => setQuestion(1, index + 1)} type="radio" name={`question${1}`} value={index + 1} className="mr-2" />
                <span className="text-gray-500">{index + 1}</span>
              </label>
            ))}
          </div>
        </div>

        <hr className="border-opacity-40 border-gray-400 w-96 mx-auto mt-0 mb-8" />
        
        <div key={2} className="mb-6">
          <label className="block mb-2 text-center">Stress</label>
          <div className="flex justify-between">
            {[...Array(5)].map((_, index) => (
              <label key={index} className="flex items-center">
                <input onChange={() => setQuestion(2, index + 1)} type="radio" name={`question${2}`} value={index + 1} className="mr-2" />
                <span className="text-gray-500">{index + 1}</span>
              </label>
            ))}
          </div>
        </div>

        <hr className="border-opacity-40 border-gray-400 w-96 mx-auto mt-0 mb-8" />

        <div key={3} className="mb-6">
          <label className="block mb-2 text-center">Energy</label>
          <div className="flex justify-between">
            {[...Array(5)].map((_, index) => (
              <label key={index} className="flex items-center">
                <input onChange={() => setQuestion(3, index + 1)} type="radio" name={`question${3}`} value={index + 1} className="mr-2" />
                <span className="text-gray-500">{index + 1}</span>
              </label>
            ))}
          </div>
        </div>

        <hr className="border-opacity-40 border-gray-400 w-96 mx-auto mt-0 mb-8" />

        <div key={4} className="mb-6">
          <label className="block mb-2 text-center">Focus</label>
          <div className="flex justify-between">
            {[...Array(5)].map((_, index) => (
              <label key={index} className="flex items-center">
                <input onChange={() => setQuestion(4, index + 1)} type="radio" name={`question${4}`} value={index + 1} className="mr-2" />
                <span className="text-gray-500">{index + 1}</span>
              </label>
            ))}
          </div>
        </div>

        <hr className="border-opacity-40 border-gray-400 w-96 mx-auto mt-0 mb-8" />

        <div key={5} className="mb-6">
          <label className="block mb-2 text-center">Social Interaction</label>
          <div className="flex justify-between">
            {[...Array(5)].map((_, index) => (
              <label key={index} className="flex items-center">
                <input onChange={() => setQuestion(5, index + 1)} type="radio" name={`question${5}`} value={index + 1} className="mr-2" />
                <span className="text-gray-500">{index + 1}</span>
              </label>
            ))}
          </div>
        </div>

        <hr className="border-opacity-40 border-gray-400 w-96 mx-auto mt-0 mb-8" />

        <div key={6} className="mb-6">
          <label className="block mb-2 text-center">Gratitude</label>
          <div className="flex justify-between">
            {[...Array(5)].map((_, index) => (
              <label key={index} className="flex items-center">
                <input onChange={() => setQuestion(6, index + 1)} type="radio" name={`question${6}`} value={index + 1} className="mr-2" />
                <span className="text-gray-500">{index + 1}</span>
              </label>
            ))}
          </div>
        </div>

        <hr className="border-opacity-0 border-white w-96 mx-auto mt-0 mb-8" />

        <div className="flex justify-center">
          <button type="submit" className="px-4 py-2 rounded-full hover:bg-pastel-pink border border-black">
            Submit
          </button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default Page;