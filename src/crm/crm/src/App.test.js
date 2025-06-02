import { render, screen } from '@testing-library/react';
import App from './App';

test('renders login form', () => {
  render(<App />);
  const loginElements = screen.getAllByText(/login/i);
  expect(loginElements.length).toBeGreaterThan(0);
});
