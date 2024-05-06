import React from "react";
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Inicial from './Screens/Inicial/Inicial'
import Answers from './Screens/Answers/Answers'

const AppRoutes = () => {

    return(
        <>
            <Router>
                    <Routes>
                        <Route path='/' element = {<Inicial />}/>
                        <Route path='/Inicial' element = {<Inicial />}/>
                        <Route path='/Answers' element = {<Answers />}/>
                    </Routes>
            </Router>
        </>
    )
}

export default AppRoutes;