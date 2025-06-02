import React from 'react';
import BackgroundLayout from './BackgroundLayout';
import BackButton from './BackButton';

const AboutUs = () => {
  return (
    <BackgroundLayout>
      <div>
        <BackButton />
        <h1>About Our Games Platform</h1>
        <p>Games are often classified by the components required to play them (e.g., miniatures, a ball, cards, a board and pieces, or a computer)</p>
        <p> In places where the use of leather is well-established, the ball has been a popular game piece throughout recorded history, resulting in a worldwide popularity of ball games such as rugby, basketball, soccer (football), cricket, tennis, and volleyball</p>
        <p>Join us and level up your gaming journey!</p>
      </div>
    </BackgroundLayout>
  );
};

export default AboutUs;
