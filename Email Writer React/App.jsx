import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios';
import { Container, TextField, Typography, Box, FormControl, InputLabel, Select, MenuItem, Button, CircularProgress } from '@mui/material'
// ...existing code...

function App() {
  const [EmailContent , setEmailContent] = useState('');
  const [tone , setTone] = useState('');
  const [generateReply , setGeneratedReply] = useState('');
  const [loading , setLoading] = useState(false);
  const [Error , setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post("http://localhost:8081/api/email/generate",
        {EmailContent,
        tone
    });
    setGeneratedReply(typeof response.data=== 'string' ? response.data : JSON.stringify(response.data) );
    }catch(Error) {
      setError('Failed to generate reply. Please try again later.');
      console.error('Error generating reply:', Error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Email Reply Generator
      </Typography> 
      <Box sx={{ mx: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={4}
          variant='outlined'
          label="Original Email Content"
          value={EmailContent || ''}
          onChange={(e) => setEmailContent(e.target.value)}
          sx={{ mb: 2 }}/>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Tone(Optional)</InputLabel>
            <Select
              value={tone || ''}
              label="Tone(Optional)"
              onChange={(e) => setTone(e.target.value)}>
                <MenuItem value = "None">None</MenuItem>
                <MenuItem value = "Professional">Professional</MenuItem>
                <MenuItem value = "Friendly">Friendly</MenuItem>
                <MenuItem value = "Casual">Casual</MenuItem>
                <MenuItem value = "Formal">Formal</MenuItem>
                <MenuItem value = "Apologetic">Apologetic</MenuItem>
                <MenuItem value = "Assertive">Assertive</MenuItem>
            </Select>
          </FormControl>
          <Button
          variant='contained'
          onClick={handleSubmit}
          disabled={!EmailContent || loading}
          fullWidth>
            {
              loading ? <CircularProgress size={24}/> : 'Generate Reply'
            }
          </Button>
        </Box>
        {Error && (<Typography color ='error' sx ={{ mb: 2 }}>
        {Error}
      </Typography> )}

      {generateReply && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Generated Reply
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant='outlined'
            value={generateReply || ''}
            InputProps={{readOnly: true}}/>
          <Button
            variant='contained'
            sx={{ mt: 2 }}
            onClick={() => navigator.clipboard.writeText(generateReply)}>
            Copy to Clipboard
          </Button>
        </Box>
      )}
      </Container>
  )
}

export default App
