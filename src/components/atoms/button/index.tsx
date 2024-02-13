import { Text, TouchableOpacity } from 'react-native'

export default function AppButton() {
  return (
    <TouchableOpacity
      style={{padding: 8, backgroundColor: 'black', borderRadius: 8}}>
      <Text style={{color: 'white'}}>Press</Text>
    </TouchableOpacity>
  )
}
