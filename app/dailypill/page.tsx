'use client'

import React, { useEffect, useState } from 'react'
import { collection, query, where, getDocs, DocumentData } from "firebase/firestore";
import { db } from '../lib/firebase';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Dailypill.css'; // Import the custom CSS file
import Navbar from '../components/Navbar';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../lib/firebase';
import { groq } from '../lib/groq';
import Typewriter from 'typewriter-effect';

export interface User {
    profile: string
    name: string
    email: string
}


export default function Dailypill() {
    const router = useRouter();
    const [data, setData] = useState<DocumentData[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [aiResults, setAiResults] = useState<string>('');

    useEffect(() => {
        async function generateAIChat() {
            if (data.length === 0) {
                setAiResults("No data available to generate insights.");
                return;
            }
        
            // Sort the data by createdAt (latest first)
            const sortedData = data
                .filter(entry => entry.createdAt) // Ensure createdAt exists
                .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds); // Descending order
        
            // Take only the last 7 days or less if there's not enough data
            const last7DaysData = sortedData.slice(0, Math.min(7, sortedData.length)).reverse(); // Reverse for chronological order
        
            // Prepare mental health attributes for the AI prompt
            const mentalAttributes = last7DaysData.map((entry, index) => ({
                day: index + 1, // 1 = oldest day, 7 = most recent
                mood: entry.q1,
                stress: entry.q2,
                energy: entry.q3,
                focus: entry.q4,
                socialInteraction: entry.q5,
                gratitude: entry.q6
            }));
        
            const prompt = `
        ${user?.name} has logged mental health attributes over the past ${last7DaysData.length} days:
        ${mentalAttributes
            .map(attr => `Day ${attr.day}: Mood=${attr.mood}, Stress=${attr.stress}, Energy=${attr.energy}, Focus=${attr.focus}, Social Interaction=${attr.socialInteraction}, Gratitude=${attr.gratitude}`)
            .join("\n")}
        
        Please analyze these trends and provide personalized mental health advice tailored to ${user?.name}.
        Using emojis, and a friendly tone is encouraged but decorate text is not allowed.
        `;
        
            const completion = await groq.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                model: "llama3-8b-8192"
            });

            console.log("Fetched data:", data);
            console.log("Generated prompt:", prompt);
            console.log("AI Response:", completion);
        
            setAiResults(completion.choices[0].message.content as string);
        }
        
        
        generateAIChat();
    }, [data])

    useEffect(() => {
        if (!user) return;
        
        const fetchData = async () => {
            const q = query(
                collection(db, "daily"),
                where("userEmail", "==", user?.email)
            );
            const querySnapshot = await getDocs(q);
            const _data: DocumentData[] = querySnapshot.docs.map(doc => doc.data());
            setData(_data);
        };
        fetchData();
    }, [user]);

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
            if (querySnapshot.docs.length == 0) {
                router.push('/');
            }

        } else {
            router.push('/auth/signin');
        }
    });
}, []);

const getTileContent = ({ date, view }: { date: Date, view: string }) => {
    if (view === 'month') {
      const dayData = data.filter(d => new Date(d.createdAt.seconds * 1000).toDateString() === date.toDateString());
        if (dayData.length > 0) {
            const avgScore = dayData.reduce((acc, curr) => acc + (curr.q1 + curr.q2 + curr.q3 + curr.q4 + curr.q5 + curr.q6) / 6, 0) / dayData.length;
            const color = avgScore >= 4 ? '#A8E6CF' : avgScore >= 3 ? '#FFD3B6' : '#FF8B94';
            return <div className="tile-content" style={{ backgroundColor: color }}></div>;
        }
    }
    return null;
};

return (
    <div>
        <Navbar user={user} />
        <div className="dailypill-container bg-pastel-cream flexitems-center">
            <div className="my-10">
                <h1 className="title">Mental Health Calendar</h1>
                <Calendar tileContent={getTileContent} />
            </div>
            <hr className="border-black my-8" />
            <div className="text-center">    
                <h1 className="title">Take your daily Mental pill</h1>
                <div className="ai-results mt-4 p-4 bg-white rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-4 text-center">AI Insights</h2>
                    <div className='w-96'>
                        <Typewriter options={{ strings: [aiResults], autoStart: true, delay: 20, deleteSpeed: Infinity }} />
                    </div>
                </div>
            </div>
        </div>
    </div>
);
}