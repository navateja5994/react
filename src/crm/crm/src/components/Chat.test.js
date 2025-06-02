import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Chat from './Chat';

// Mock Firestore functions
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  addDoc: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  onSnapshot: jest.fn((query, callback) => {
    // Simulate snapshot with empty messages
    callback({
      forEach: (fn) => {
        // No messages
      },
    });
    return jest.fn(); // unsubscribe function
  }),
}));

describe('Chat Component', () => {
  test('renders chat component', () => {
    render(<Chat user={{ uid: 'user1' }} role="client" roomId="room1" />);
    expect(screen.getByText(/send/i)).toBeInTheDocument();
  });

  test('allows sending a message', async () => {
    render(<Chat user={{ uid: 'user1' }} role="client" roomId="room1" />);
    const input = screen.getByPlaceholderText(/type your message/i);
    fireEvent.change(input, { target: { value: 'Hello' } });
    expect(input.value).toBe('Hello');
    // Simulate send button click
    fireEvent.click(screen.getByText(/send/i, { selector: 'button' }));
    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });

  // Additional tests for message receiving, UI updates can be added here
});
