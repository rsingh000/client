import Item from './components/Item';
import Orders from './components/Orders';
import { Routes, BrowserRouter as Router, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/items/:id" element={<Item/>} />
        <Route path="/" element={<Orders/>} />
      </Routes>
    </Router>
  );
}

export default App;
