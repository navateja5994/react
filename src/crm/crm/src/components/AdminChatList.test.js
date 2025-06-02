import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminChatList from './AdminChatList';
import { collection, getDocs } from 'firebase/firestore';

// Mock Firestore getDocs
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
}));

describe('AdminChatList Component', () => {
  const mockOnSelectRoom = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders chat rooms', async () => {
    getDocs.mockResolvedValueOnce({
      docs: [
        { id: 'room1', data: () => ({}) },
        { id: 'room2', data: () => ({}) },
      ],
    });

    render(<AdminChatList onSelectRoom={mockOnSelectRoom} />);

    await waitFor(() => {
      expect(screen.getByText('room1')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText('room2')).toBeInTheDocument();
    });
  });

  test('handles error when fetching chat rooms', async () => {
    getDocs.mockRejectedValueOnce(new Error('Firestore error'));

    render(<AdminChatList onSelectRoom={mockOnSelectRoom} />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load chat rooms/i)).toBeInTheDocument();
    });
  });

  test('calls onSelectRoom when a room is clicked', async () => {
    getDocs.mockResolvedValueOnce({
      docs: [
        { id: 'room1', data: () => ({}) },
      ],
    });

    render(<AdminChatList onSelectRoom={mockOnSelectRoom} />);

    await waitFor(() => {
      expect(screen.getByText('room1')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('room1'));
    expect(mockOnSelectRoom).toHaveBeenCalledWith('room1');
  });
});
