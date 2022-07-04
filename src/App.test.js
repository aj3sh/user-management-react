import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

// basic test cases for react

test("test if login page is displayed", async () => {
  render(
    <MemoryRouter initialEntries={["/login"]}>
      <App/>
    </MemoryRouter>
  );
  const loginButton = await screen.findByTestId('test_login')
  expect(loginButton).toBeInTheDocument();
});


test("test if home page is redirected to login page", async () => {
  const a = render(
    <MemoryRouter initialEntries={["/"]}>
      <App/>
    </MemoryRouter>
  );
  const loginButton = await screen.findByTestId('test_login')
  expect(loginButton).toBeInTheDocument();
});
