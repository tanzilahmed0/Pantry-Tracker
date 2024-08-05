'use client';
import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { Box, Typography, Modal, Stack, Button, TextField } from '@mui/material';
import { collection, deleteDoc, doc, getDocs, query, setDoc, getDoc } from "firebase/firestore";
import SearchBar from './Components/SearchBar';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot); 
    const inventoryList = []; 
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id, 
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
    console.log(inventoryList);
  };

  const searchItem = (query) => { 
    setSearchQuery(query);
  };

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const removeItem = async (item) => { 
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  };

  const addItem = async (item) => { 
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return ( 
    <Box 
      width="100vw" 
      height="100vh" 
      display="flex" 
      justifyContent="center"
      flexDirection="column" 
      alignItems="center" 
      gap={2}
    > 
      <Modal open={open} onClose={handleClose}> 
        <Box
          position="absolute" 
          top="50%" 
          left="50%"
          width={400} 
          bgcolor="white" 
          border="2px solid #000" 
          boxShadow={24} 
          p={4} 
          display="flex" 
          flexDirection="column" 
          gap={3}
          sx={{ transform:'translate(-50%,-50%)' }}
        > 
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => { 
                setItemName(e.target.value);
              }}
            />
            <Button 
              variant="outlined" 
              onClick={() => {
                addItem(itemName); 
                setItemName('');
                handleClose();
              }}
            > 
              Add
            </Button>     
          </Stack> 
        </Box> 
      </Modal>

      <Box border='1px solid #333' width="800px">
        <Box 
          height="100px" 
          display="flex"
          bgcolor="#66bb6a" 
          alignItems="center" 
          justifyContent="center"
          sx={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }} // Add shadow here
        >
          <Typography variant='h2' color='#333 '>
            Inventory Items
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2, width: '100%' }}>
          <Box sx={{ flex: 4, marginRight: 2 }}>
            <SearchBar onSearch={searchItem} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Button
              variant="contained"
              onClick={() => handleOpen()}
              sx={{ width: '100%' }}
            >
              Add New Item
            </Button>
          </Box>
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow="auto">
          {filteredInventory.map(({ name, quantity }) => (
            <Box 
              key={name} 
              width="100%" 
              minHeight="150px" 
              display="flex" 
              alignItems="center"
              justifyContent="space-between" 
              bgcolor="#f0f0f0" 
              padding={5}
            >
              <Typography 
                variant="h3" 
                color="#333" 
                textAlign="center"
              >
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography 
                variant="h3" 
                color="#333" 
                textAlign="center"
              >
                {quantity}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button 
                  variant="contained" 
                  onClick={() => addItem(name)}
                >
                  Add
                </Button>
                <Button 
                  variant="contained" 
                  onClick={() => removeItem(name)}
                >
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
