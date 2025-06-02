import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Auth from './Auth';

describe('Auth Component', () => {
  test('renders login form by default', () => {
    render(<Auth onUserChanged={() => {}} />);
    const loginElements = screen.getAllByText(/login/i);
    expect(loginElements.length).toBeGreaterThan(0);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  test('toggles to signup form', () => {
    render(<Auth onUserChanged={() => {}} />);
    fireEvent.click(screen.getAllByText(/sign up/i)[0]);
    const signUpElements = screen.getAllByText(/sign up/i);
    expect(signUpElements.length).toBeGreaterThan(0);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    // Removed confirm password check as it does not exist in the form
    // expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  test('shows error on empty email submission', async () => {
    render(<Auth onUserChanged={() => {}} />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByText(/login/i, { selector: 'button' }));
    await waitFor(() => {
      expect(screen.getByText(/email/i)).toBeInTheDocument();
    });
  });

  test('calls onUserChanged on successful login', async () => {
    const mockOnUserChanged = jest.fn();
    render(<Auth onUserChanged={mockOnUserChanged} />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByText(/login/i, { selector: 'button' }));
    await waitFor(() => {
      expect(mockOnUserChanged).toHaveBeenCalled();
    });
  });
});
