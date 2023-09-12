import * as React from 'react'
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'

export default function BasicSelect({ onChange }) {
  const [age, setAge] = React.useState('')

  const handleChange = (event) => {
    setAge(event.target.value)
    onChange(event.target.value)
  }

  const agent = JSON.parse(sessionStorage.getItem("agent"))

  return (
    <Box sx={{ width: '100%' }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label"></InputLabel>
        <Select sx={{ height: 34 }}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          label=""
          onChange={handleChange}
        >
          {agent.country.split(",").map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}

        </Select>
      </FormControl>
    </Box>
  )
}
