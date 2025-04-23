import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const storeStory = async ({ name, animal, adaptation, storyData, language }) => {
  try {
    await addDoc(collection(db, 'stories'), {
      name,
      animal,
      adaptation,
      story: storyData.story,
      title: storyData.title,
      moral: storyData.moral,
      language,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error saving story:", error);
  }
};
