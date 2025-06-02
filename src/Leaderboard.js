import React, { useState, useEffect } from 'react';
import BackgroundLayout from './BackgroundLayout';
import BackButton from './BackButton';
import Card from './Card';
import { database } from './firebase';
import { ref, onValue } from 'firebase/database';

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    const scoresRef = ref(database, 'scores');
    const unsubscribe = onValue(scoresRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setLeaderboardData([]);
        return;
      }
      // Aggregate scores by user
      const userScores = {};
      for (const userId in data) {
        const userScoresData = data[userId];
        let totalScore = 0;
        for (const key in userScoresData) {
          totalScore += userScoresData[key].score || 0;
        }
        userScores[userId] = totalScore;
      }
      // Convert to array and sort descending
      const sortedScores = Object.entries(userScores)
        .map(([userId, score]) => ({ userId, score }))
        .sort((a, b) => b.score - a.score);

      // Assign ranks
      const rankedScores = sortedScores.map((item, index) => ({
        rank: index + 1,
        userId: item.userId,
        score: item.score,
      }));

      setLeaderboardData(rankedScores);
    });

    return () => unsubscribe();
  }, []);

  return (
    <BackgroundLayout>
      <Card>
        <BackButton />
        <h1>Leaderboard</h1>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>User ID</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map(player => (
              <tr key={player.userId}>
                <td>{player.rank}</td>
                <td>{player.userId}</td>
                <td>{player.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </BackgroundLayout>
  );
};

export default Leaderboard;
