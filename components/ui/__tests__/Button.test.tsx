import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Button } from '../button';

describe('Button', () => {
    it('renders correctly with title', () => {
        const { getByText } = render(<Button title="Click Me" onPress={() => { }} />);
        expect(getByText('Click Me')).toBeTruthy();
    });

    it('calls onPress when pressed', () => {
        const onPressMock = jest.fn();
        const { getByText } = render(<Button title="Press Me" onPress={onPressMock} />);

        fireEvent.press(getByText('Press Me'));
        expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('shows loading indicator when loading prop is true', () => {
        const { getByTestId } = render(<Button title="Loading" loading onPress={() => { }} />);
        expect(getByTestId('activity-indicator')).toBeTruthy();
    });
});
