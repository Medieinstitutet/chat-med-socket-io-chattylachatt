import React, { useState } from 'react';
import avatar1 from '../assets/avatar1.jpg';
import avatar2 from '../assets/avatar2.jpg';
import avatar3 from '../assets/avatar3.webp';
import avatar4 from '../assets/avatar4.png';
import avatar5 from '../assets/avatar5.webp';
import '../sass/_AvatarPicker.scss';

interface AvatarPickerProps {
  onSelect: (avatar: string) => void;
}

const AvatarPicker: React.FC<AvatarPickerProps> = ({ onSelect }) => {
  const avatars: string[] = [avatar1, avatar2, avatar3, avatar4, avatar5,]; 
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

  const handleAvatarSelect = (avatar: string) => {
    setSelectedAvatar(avatar);
    onSelect(avatar); 
  };

  return (
    <div className='avatar-picker-container'>
      <h3>Välj en avatar:</h3>
      <div className='avatar-list'>
        {avatars.map((avatar) => (
          <img
            key={avatar}
            src={avatar}
            alt={`Avatar ${avatar}`}
            onClick={() => handleAvatarSelect(avatar)}
            className={selectedAvatar === avatar ? 'selected' : ''}
          />
        ))}
      </div>
    </div>
  );
};

export default AvatarPicker;
