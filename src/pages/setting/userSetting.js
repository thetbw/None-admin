import {Typography, Tabs, Button, Switch, Input, message, Divider} from 'antd';
import * as React from "react";

const {Title, Text} = Typography;
const {TabPane} = Tabs
const {TextArea} = Input
import {SettingItem} from '../compents/compents1'
import QueueAnim from 'rc-queue-anim';

const axios = require('axios').default;
import host from '../../host'

export default class UserSettingPanel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userInfo: new Object(),
            userPass: new Object()
        }

    }

    componentWillMount() {
        this.loadData();
    }

    loadData = () => {
        axios.get(host + '/admin/api/setting/user')
            .then(res => {
                this.setState({
                    userInfo: res.data
                })
            }).catch(error => {
            message.error('数据获取失败');
        })
    }

    commitUserInfo = () => {
        axios.post(host + '/admin/api/setting/user', this.state.userInfo)
            .then(res => {
                message.info('保存成功');
            }).catch(errpr => {
            message.error('保存失败');
        })
    }

    commitUserPass = () => {
        if (this.state.userPass.new_password != this.state.userPass.new_password_2) {
            message.error('两次密码不一致');
            return;
        }
        if (this.state.userPass.old_password == '' || this.state.userPass.new_password == '' || this.state.userPass.old_password == undefined
            || this.state.userPass.new_password == undefined) {
            message.error('值不能为空')
            return;
        }
        let form = new FormData();
        form.append('old_password',this.state.userPass.old_password);
        form.append('new_password',this.state.userPass.new_password)
        axios.post(host+'/admin/api/setting/user/password',form)
            .then(res=>{
                message.info('更改成功');
                this.setState({
                    userPass:new Object()
                })
            })
            .catch(error=>{
                message.error('更改失败');
                if (error.response && error.response.data) {
                    message.error(error.response.data.message);
                }
            })

    }

    render() {

        return (
            <div>
                <Title level={4}>个人设置</Title>
                <div style={{padding: '0.5rem'}}>
                    <Divider orientation='left'>基本信息</Divider>
                    <SettingItem label='昵称'>
                        <Input value={this.state.userInfo.user_nickname}
                               onChange={e => {
                                   this.state.userInfo.user_nickname = e.target.value;
                                   this.setState({
                                       userInfo: this.state.userInfo
                                   })
                               }}/>
                    </SettingItem>
                    <SettingItem label='邮箱'>
                        <Input value={this.state.userInfo.user_email}
                               onChange={e => {
                                   this.state.userInfo.user_email = e.target.value;
                                   this.setState({
                                       userInfo: this.state.userInfo
                                   })
                               }}/>
                    </SettingItem>
                    <SettingItem label='头像'>
                        <Input value={this.state.userInfo.user_avatar_url}
                               onChange={e => {
                                   this.state.userInfo.user_avatar_url = e.target.value;
                                   this.setState({
                                       userInfo: this.state.userInfo
                                   })
                               }}/>
                    </SettingItem>
                    <SettingItem label='收到评论邮件通知'>
                        <Switch checked={this.state.userInfo.commentWithEmail == 'false' ? false : true}
                                onChange={checked => {
                                    if (checked) {
                                        this.state.userInfo.commentWithEmail = 'true'
                                    } else {
                                        this.state.userInfo.commentWithEmail = 'false'
                                    }
                                    this.setState({
                                        userInfo: this.state.userInfo
                                    })
                                }}></Switch>
                    </SettingItem>
                    <Button type='primary' onClick={this.commitUserInfo}>保存设置</Button>
                    <Divider orientation='left'>密码设置</Divider>
                    <SettingItem label='原密码'>
                        <Input value={this.state.userPass.old_password} type='password'
                               onChange={e => {
                                   this.state.userPass.old_password = e.target.value;
                                   this.setState({
                                       userPass: this.state.userPass
                                   })
                               }}/>
                    </SettingItem>
                    <SettingItem label='新密码'>
                        <Input value={this.state.userPass.new_password} type='password' onChange={e => {
                            this.state.userPass.new_password = e.target.value;
                            this.setState({
                                userPass: this.state.userPass
                            })
                        }}/>
                    </SettingItem>
                    <SettingItem label='确认新密码'>
                        <Input value={this.state.userPass.new_password_2} type='password'
                               onChange={e => {
                                   this.state.userPass.new_password_2 = e.target.value;
                                   this.setState({
                                       userPass: this.state.userPass
                                   })
                               }}/>
                    </SettingItem>
                    <Button type='primary' onClick={this.commitUserPass}>确认更改</Button>
                </div>
            </div>
        )
    }

}