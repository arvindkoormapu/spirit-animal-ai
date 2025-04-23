import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export default function AnalyticsDashboard() {
  const [stories, setStories] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const q = query(collection(db, 'stories'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const storyList = snapshot.docs.map(doc => doc.data());
        setStories(storyList);

        const uniqueNames = new Set(storyList.map(s => s.name));
        setTotalUsers(uniqueNames.size);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stories:', error);
      }
    };

    fetchStories();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading analytics...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-primary">Usage Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <p className="text-xl text-secondary font-bold">Total Users</p>
          <p className="text-4xl text-primary mt-2">{totalUsers}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow text-center">
          <p className="text-xl text-secondary font-bold">Total Stories</p>
          <p className="text-4xl text-primary mt-2">{stories.length}</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-secondary mb-4">Recent Stories</h2>
      <div className="bg-white p-4 rounded-xl shadow overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-primary text-white">
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Animal</th>
              <th className="px-4 py-2 text-left">Adaptation</th>
              <th className="px-4 py-2 text-left">Language</th>
              <th className="px-4 py-2 text-left">Title</th>
            </tr>
          </thead>
          <tbody>
            {stories.slice(0, 5).map((s, index) => (
              <tr key={index} className="border-t cursor-pointer hover:bg-gray-100" onClick={() => setSelectedStory(s)}>
                <td className="px-4 py-2">{s.name}</td>
                <td className="px-4 py-2">{s.animal}</td>
                <td className="px-4 py-2">{s.adaptation}</td>
                <td className="px-4 py-2">{s.language}</td>
                <td className="px-4 py-2 text-primary underline">{s.title}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedStory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-2xl relative">
            <button className="absolute top-2 right-4 text-xl" onClick={() => setSelectedStory(null)}>×</button>
            <h2 className="text-2xl font-bold text-primary mb-4">{selectedStory.title}</h2>
            <p><strong>Name:</strong> {selectedStory.name}</p>
            <p><strong>Animal:</strong> {selectedStory.animal}</p>
            <p><strong>Adaptation:</strong> {selectedStory.adaptation}</p>
            <p><strong>Language:</strong> {selectedStory.language}</p>
            <p className="mt-4 whitespace-pre-line"><strong>Story:</strong><br />{selectedStory.story}</p>
            <p className="mt-4 italic text-primary"><strong>Moral:</strong> {selectedStory.moral}</p>
          </div>
        </div>
      )}
    </div>
  );
}