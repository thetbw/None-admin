import { Typography, Tabs, Button, Switch, Input,message } from 'antd';
import * as React from "react";
const {Title} = Typography;
const {TabPane} = Tabs
const {TextArea} = Input
import {SettingItem} from '../compents/compents1'

const axios = require('axios').default;
import host from '../../host'

export default class BasicSettingPanel extends React.Component{

    constructor(props) {
        super(props);

    }

    componentWillMount() {
        this.loadData()
    }

    loadData=()=>{
        axios.get(host+'/admin/api/setting/basic')
            .then(res=>{
                this.setState({
                    ...res.data
                })
            })
    }

    commitData=()=>{
        message.loading({ content: '正在保存', key: 'settingCommit' });
        axios.post(host+'/admin/api/setting/basic',this.state)
            .then(res=>{
                message.success({ content: '保存成功', key: 'settingCommit' });
                this.loadData();
            }).catch((error)=>{
                message.error({ content: '保存失败', key: 'settingCommit' });
            })
    }

    handleDataChange=(key, value)=>{
        let state = this.state;
        state[key] = value;
        this.setState(state);
    }

    render(){
        return(
            <div>
                <Title level={4}>基本设置</Title>
                <Tabs defaultActiveKey='1' size='large' tabBarExtraContent={<Button type="primary" onClick={this.commitData}>保存</Button>}>
                    <TabPane tab='基本设置' key='1'>
                        <DefaultSettingPanel
                            data={this.state}
                            onDataChange={this.handleDataChange}/>
                    </TabPane>
                    <TabPane tab='评论设置' key='2'>
                        <CommentSettingPanel
                            data={this.state}
                            onDataChange={this.handleDataChange}/>
                    </TabPane>
                    <TabPane tab='邮件设置' key='3'>
                        <EmailSettingPanel
                            data={this.state}
                            onDataChange={this.handleDataChange}/>
                    </TabPane>

                </Tabs>


            </div>
        )
    }

}

class DefaultSettingPanel extends React.Component{
    
    render() {
        const {siteTitle,siteDescription,siteKeywords,indexPageName,indexPagingSize,siteFavicon,siteNotice,siteHeader,siteFooter,isCanRegister}
                = this.props.data?this.props.data:new Object();
        return(
            <div style={{padding:'0.5rem '}}>

                <SettingItem label='网站标题'>
                    <Input
                        value={siteTitle}
                        onChange={(e)=>{this.props.onDataChange('siteTitle',e.target.value)}}
                    />
                </SettingItem>
                <SettingItem label='网站描述' tip='将显示在网页代码头部，不会在网页上显示'>
                    <Input
                        value={siteDescription}
                        onChange={(e)=>{this.props.onDataChange('siteDescription',e.target.value)}}
                    />
                </SettingItem>
                <SettingItem label='关键词' tip='将显示在网页代码头部，不会在网页上显示，用逗号分割'>
                    <Input
                        value={siteKeywords}
                        onChange={(e)=>{this.props.onDataChange('siteKeywords',e.target.value)}}
                    />
                </SettingItem>
                <SettingItem label='首页页面' tip='首页打开的页面，对应html文件'>
                    <Input
                        value={indexPageName}
                        onChange={(e)=>{this.props.onDataChange('indexPageName',e.target.value)}}
                    />
                </SettingItem>
                <SettingItem label='首页分页大小' tip='首页每页显示的文章数量'>
                    <Input
                        value={indexPagingSize}
                        onChange={(e)=>{this.props.onDataChange('indexPagingSize',e.target.value)}}
                    />
                </SettingItem>
                <SettingItem label='Favicon' tip='浏览器导航栏上的图标' >
                    <Input
                        value={siteFavicon}
                        onChange={(e)=>{this.props.onDataChange('siteFavicon',e.target.value)}}
                    />
                </SettingItem>
                <SettingItem label='公告'  >
                    <Input
                        value={siteNotice}
                        onChange={(e)=>{this.props.onDataChange('siteNotice',e.target.value)}}
                    />
                </SettingItem>
                <SettingItem label='自定义页头'  >
                    <TextArea
                        value={siteHeader}
                        onChange={(e)=>{this.props.onDataChange('siteHeader',e.target.value)}}
                    />
                </SettingItem>
                <SettingItem label='自定义页尾'  >
                    <TextArea
                        value={siteFooter}
                        onChange={(e)=>{this.props.onDataChange('siteFooter',e.target.value)}}
                    />
                </SettingItem>
                <table><tbody><SettingItem label='允许注册' inline={true} >
                    <Switch
                        checked={isCanRegister=='true'?true:false}
                        onChange={(checked)=>{this.props.onDataChange('isCanRegister',checked?'true':'false')}}
                    />
                </SettingItem></tbody></table>

            </div>
        )
    }
}


class CommentSettingPanel extends  React.Component{

    render() {
        const {commentOpened,commentMustLogin,commentWithChecked} = this.props.data?this.props.data:new Object();
        return(
            <div style={{padding:'0.5rem '}}>
                <table ><tbody>
                <SettingItem label='启用评论' inline={true} >
                    <Switch
                        checked={commentOpened}
                        onChange={(checked)=>{this.props.onDataChange('commentOpened',checked)}}
                    />
                </SettingItem>
                <SettingItem label='必须登陆才能评论' inline={true} >
                    <Switch
                        checked={commentMustLogin}
                        onChange={(checked)=>{this.props.onDataChange('commentMustLogin',checked)}}
                    />
                </SettingItem>
                <SettingItem label='评论审核' inline={true} >
                    <Switch
                        checked={commentWithChecked}
                        onChange={(checked)=>{this.props.onDataChange('commentWithChecked',checked)}}
                    />
                </SettingItem>
                </tbody>
                </table>
            </div>
        )
    }
}


class  EmailSettingPanel extends React.Component{

    render() {

        return(
            <div style={{padding:'0.5rem '}}>

            </div>
        )
    }
}