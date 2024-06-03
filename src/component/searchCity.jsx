import React, { useState} from 'react';
import SearchIcon from '@mui/icons-material/Search';
import {grey} from '@mui/material/colors';

const SearchCity = ({ onSearch }) => {
  const [location, setLocation] = useState('');

  const handleChange = (event) => {
    setLocation(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(location);
    setLocation('');
  };

  return (
    <form className='searchInput' onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter location"
        value={location}
        onChange={handleChange}
        className="inputField"
      />
      <button type="submit" className="inputSubmit"><SearchIcon color="primary"  sx={{color:grey[50], fontSize:"2rem"}}/></button>
    </form>
  );
};

export default SearchCity;
