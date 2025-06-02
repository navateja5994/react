import React from 'react';
import BackgroundLayout from './BackgroundLayout';
import BackButton from './BackButton';
import Card from './Card';

const ContactUs = () => {
  return (
    <BackgroundLayout>
      <Card>
        <BackButton />
        <h1>Contact Our Games Platform Team</h1>
        <p>Have questions or feedback? We'd love to hear from you!</p>
        <p><strong>Toll Free Number:</strong> 1-800-123-4567</p>
        <form>
          <label>Name:</label><br />
          <input type="text" name="name" placeholder="Enter your name" /><br />
          <label>Email:</label><br />
          <input type="email" name="email" placeholder="Enter your email" /><br />
          <label>Message:</label><br />
          <textarea name="message" placeholder="Enter your message"></textarea><br />
          <button type="submit">Send Message</button>
        </form>
      </Card>
    </BackgroundLayout>
  );
};

export default ContactUs;
