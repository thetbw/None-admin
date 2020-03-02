import { Button } from 'antd';
import { publicDecrypt } from 'crypto';
// import React from 'react';
const axios = require('axios').default;

class FinishPanel extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
        <div>
            <p style={{textAlign:'center',fontSize:'3rem'}}><b>完成</b></p>
            <div style={{textAlign:"center"}}>
                <Button  onClick={this.props.switch2edit}>返回</Button>
            </div>
        </div>
        )
    }
}



export {FinishPanel};