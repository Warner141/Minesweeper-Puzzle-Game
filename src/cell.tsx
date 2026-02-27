import "./cell.css";
//import Button from 'react'; 
import Button from 'react-native';

function cellComponent(hiddenValue: number, edgeLength: string) {
  document.documentElement.style.setProperty('--edgeLength', edgeLength);
  return (
  <div id="cellBody">
    <Button id="text">{hiddenValue}</Button>
  </div>);
}

export default cellComponent;