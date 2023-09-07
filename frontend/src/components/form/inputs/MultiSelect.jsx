import * as React from 'react'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import ListItemText from '@mui/material/ListItemText'
import Select from '@mui/material/Select'
import Checkbox from '@mui/material/Checkbox'

const ITEM_HEIGHT = 50
const ITEM_PADDING_TOP = 4
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}



export default function MultipleSelectCheckmarks({ editValue, styles }) {

  const [names, setNames] = React.useState(JSON.parse(sessionStorage.getItem("country_list")))
  const [personName, setPersonName] = React.useState([])

  React.useEffect(() => {
    if (editValue) setPersonName(editValue)
  }, [editValue])

  const handleChange = (event) => {
    const {
      target: { value },
    } = event
    setPersonName(
      typeof value === 'string' ? value.split(',') : value,

    )
  }

  return (
    <div>
      <FormControl sx={{ m: 0, width: "100%" }} >
        <InputLabel id="demo-multiple-checkbox-label"></InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput label=""
            sx={{
              height: 34,
              '@media (max-width: 470px)': {
                fontSize: 10,
              },
              // border: '1px solid #e2e8f0'
            }}
          />}
          renderValue={(selected) => selected.join(',')}
          MenuProps={MenuProps}
        >
          {names.map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={personName.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  )
}