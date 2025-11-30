// src/components/header/SearchButton.tsx
import React from 'react';
import { HoverIconButton } from './styled';
import { FiSearch as SearchIcon } from 'react-icons/fi';

export const SearchButton: React.FC = () => (
  <HoverIconButton color="default" aria-label="Search">
    <SearchIcon />
  </HoverIconButton>
);