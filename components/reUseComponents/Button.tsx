import React from 'react';
import { Button } from '@ant-design/react-native';

interface LmsButtonProps {
    buttonText: string;
    handleClick: () => void;
}

const LmsButton: React.FC<LmsButtonProps> = ({ buttonText, handleClick }) => {
    return (
        <Button onPress={handleClick}>
            {buttonText}
        </Button>
    );
};

export default LmsButton;
