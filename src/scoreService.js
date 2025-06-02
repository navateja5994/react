import { ref, push } from "firebase/database";
import { database } from "./firebase";

/**
 * Save a game score to Firebase Realtime Database
 * @param {string} userId - The ID of the user
 * @param {string} gameId - The ID of the game
 * @param {number} score - The score achieved
 * @param {number} timestamp - The timestamp of the score (optional, defaults to now)
 * @returns {Promise<void>}
 */
export const saveScore = async (userId, gameId, score, timestamp = Date.now()) => {
  if (!userId) {
    throw new Error("User ID is required to save score");
  }
  const scoresRef = ref(database, `scores/${userId}`);
  await push(scoresRef, {
    gameId,
    score,
    timestamp
  });
};
