import {Typography, Radio, Table, Divider, Button, Dropdown, Menu, Icon} from 'antd';
import * as React from "react";


export default class AboutPanel extends React.Component {

    render() {
        return (
            <div>
                <h2>关于</h2>
                <div style={{padding:'1rem'}}>
                    <h3><a href="https://github.com/thetbw/None" target="_blank">None</a></h3>
                    <h4>&nbsp;&nbsp;一个简单的博客</h4>
                    <p><b>当前版本: </b> 1.0</p>

                    <p><b>github: </b> <a href="https://github.com/thetbw/None"
                                          target="_blank">github.com/thetbw/None</a></p>
                    <p><b>作者：</b> <a href='https://thetbw.xyz' target="_blank"> 黑羽</a></p>
                    <p><b>邮箱：</b> <a> thetbw@outlook.com</a></p>
                </div>
            </div>
        )
    }


}