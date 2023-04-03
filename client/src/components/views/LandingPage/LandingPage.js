import React, {useEffect} from 'react'
import axios from 'axios';

function LandingPage() {

  useEffect(() => {
    axios.get('/api/hello')
    // server/index.js에서 보낸걸 받는..
    .then(response => console.log(response.data))
  }, [])
  

  return (
    <div>
      LandingPage
    </div>
  )
}

export default LandingPage