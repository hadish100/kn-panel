import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

const ITEM_HEIGHT = 80;
const ITEM_PADDING_TOP = 4;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

var actions_array = ["LOGIN","CREATE_USER","EDIT_USER","DELETE_USER","CREATE_PANEL","EDIT_PANEL","DELETE_PANEL","EDIT_SELF","RESET_USER","CREATE_AGENT","EDIT_AGENT","DELETE_AGENT","ENABLE_USER","ENABLE_AGENT","ENABLE_PANEL","DISABLE_USER","DISABLE_PANEL","DISABLE_AGENT"]

export default function MultipleSelectCheckmarks() {

  const [names, setNames] = React.useState(actions_array);
  const [personName, setPersonName] = React.useState([]);



  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      typeof value === 'string' ? value.split(',') : value,

    );
  };

  return (
    <div>
      <FormControl sx={{ m: 0, width:'25vw',fontSize:10 }} >
        <InputLabel id="demo-multiple-checkbox-label">ACTIONS</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={personName}
          onChange={handleChange} 
          input={<OutlinedInput label="ACTIONS"  />}
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
  );
}