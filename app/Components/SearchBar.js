import { useState } from 'react';
import TextField from '@mui/material/TextField';

const SearchBar = ({ onSearch }) => { 
    const [searchQuery, setSearchQuery] = useState('');

    const handleChange = (event) => { 
        setSearchQuery(event.target.value); 
        onSearch(event.target.value);  // Call the onSearch prop with the current query
    };

    return (
        <TextField 
            label="Search Inventory" 
            variant="outlined" 
            value={searchQuery} 
            onChange={handleChange} 
            aria-label="Search Input"
        />
    );
};

export default SearchBar;
