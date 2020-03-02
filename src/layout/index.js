import { Component } from 'react';
import { Layout, Menu, Icon } from 'antd';
const {  Sider, Content } = Layout;
import MenuPage from '../pages/menu';
import HeaderPage from '../pages/header';


import SiderStyle from '../css/style.css'
// Header, Footer, Sider, Content组件在Layout组件模块下


const SubMenu = Menu.SubMenu;


export default class BasicLayout extends Component {


    render() {
        return (
            <Layout>
                <Sider theme='dark' breakpoint='lg'
                    collapsedWidth="0" width={256} className={SiderStyle.sider}
                    collapsible
                    style={{ minHeight: '100vh'}} >
                    <div style={{ height: '32px', margin: '16px'}}><h2 style={{ color: '#fff' }}>博客后台</h2></div>
                    <MenuPage></MenuPage>
                </Sider>

                <Layout style={{ overflow: 'auto', maxHeight: '100vh', width: '100%' }}>
                    <HeaderPage></HeaderPage>
                    <Content style={{ margin: '1rem 1rem 0' }}>
                        <div style={{ padding: '1rem', background: '#fff', minHeight: 360 }}>{this.props.children}</div>
                    </Content>
                    {/* <Footer style={{textAlign: 'center'}}>Footer</Footer> */}
                </Layout>

            </Layout>
        )
    }
}