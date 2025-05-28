import { useState } from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Index from './Components'


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/index' element={<Index/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
