import {Layout,Tooltip,Avatar} from 'antd';
import * as React from "react";
import host from '../host';
import Link from 'umi/link';
const {Header} = Layout;
const axios = require('axios').default;


export default class HeaderLayout extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            user:null
        }
    }

    componentWillMount() {
        axios.get(host+"/api/blog/admin").then(res=>{
            this.setState({user:res.data})
        });

    }



    render() {
        return (
            <Header style={{background: '#fff', textAlign: 'right', paddingRight: '1rem'}}>
                <Tooltip title={this.state.user&&this.state.user.user_nickname}>
                    <Link to='/setting/user'>
                        <Avatar shape="square"  icon="user" src={this.state.user&&this.state.user.user_avatar_url} style={{marginRight: '0.5rem'}}/>
                    </Link>
                </Tooltip>
                <Tooltip title="返回主页">
                    <a href={host+"/"} target="_blank">
                        <Avatar shape="square"  icon="home"  />
                    </a>
                </Tooltip>

            </Header>
        )
    }


}
