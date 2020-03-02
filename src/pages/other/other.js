import { Typography, Radio, Table, Divider, Button, Dropdown, Menu, Icon } from 'antd';
import * as React from "react";

import Style from '../../css/style.css'

export default class OtherPanel extends React.Component {

    render() {
        return(
            <div>
                <h2>其他</h2>
                <div className={Style.otherPanel} >
                    <div className={Style.otherPanel_item} style={{backgroundColor:"rgba(122,141,153,0.51)"}} onClick={()=>{
                        window.open("//github.com/thetbw/None","_blank")
                    }}>
                        检查更新
                    </div>
                    <div className={Style.otherPanel_item} style={{backgroundColor:"rgba(82,153,85,0.51)"}} onClick={()=>{
                        window.open("//github.com/thetbw/None/issues","_blank")
                    }}>
                        反馈
                    </div>
                </div>
            </div>
        )
    }


}