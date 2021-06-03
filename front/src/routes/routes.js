import React from 'react'
import {HashRouter, Switch, Route} from 'react-router-dom'

import Home from '../pages/Home'
import Painel from '../pages/Painel'

export default function Routes(){
    return(
        <HashRouter>
            <Switch>
                <Route exact path='/' component={Home} />
                <Route exact path='/painel' component={Painel} />
            </Switch>
        </HashRouter>
    )
}