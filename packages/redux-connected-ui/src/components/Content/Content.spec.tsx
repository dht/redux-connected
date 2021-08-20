import React from 'react';
import { Content } from './Content';
import { render, fireEvent } from '@testing-library/react';

describe('Content component', () => {
  it('Should render correctly', () => {
    const spy = jest.fn();

    const { getByPlaceholderText, getByText } = render(<Content />);

    const input = getByPlaceholderText('Player 1 Name');
    const button = getByText(/start game/i);
  });
});
