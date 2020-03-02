import { Menu, Icon } from 'antd';
import Link from 'umi/link';
const SubMenu = Menu.SubMenu;




export default () => {
    return <div style={{overflow:'auto'}}>
            <Menu theme='dark'  mode='inline' defaultOpenKeys={['overview']} >
                <Menu.Item key='overview' >
                    <Link to='/'>
                        <Icon type='pie-chart'></Icon>
                        <span>总览</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key='wirte-acticle' >
                    <Link to='/article'>
                        <Icon type='edit'></Icon>
                        <span>发布文章</span>
                    </Link>
                </Menu.Item>
        
                <SubMenu key='acticle' 
                    title={<span><Icon type="appstore" /><span>管理</span></span>}>
                    <Menu.Item key='acticle_manager' >
                        <Link to='/manager/article'>文章管理</Link>
                        </Menu.Item>
                    <Menu.Item key='comment_manager' >
                        <Link to='/manager/comment'>评论管理</Link>
                    
                        </Menu.Item>
                    <Menu.Item key='category_manager'>
                        <Link to='/manager/category'>分类管理</Link>
                        </Menu.Item>
                    <Menu.Item key='tag_manager'>
                        <Link to='/manager/tag'>标签管理</Link>
                        </Menu.Item>
                    <Menu.Item key='page_manager'>
                        <Link to='/manager/page'>页面管理</Link>
                        </Menu.Item>
                </SubMenu>
                <SubMenu key='setting' 
                    title={<span><Icon type="setting" /><span>设置</span></span>}>
                    <Menu.Item key='basic_setting' >
                        <Link to='/setting/basic'>基本设置</Link>
                        </Menu.Item>
                    <Menu.Item key='theme_setting' >
                        <Link to='/setting/theme'>主题设置</Link>
                        </Menu.Item>
                    <Menu.Item key='user_setting' >
                        <Link to='/setting/user'>个人设置</Link>
                        </Menu.Item>
                    
                </SubMenu>
                <Menu.Item key='other'>
                    <Link to='/other'>
                        <Icon type='info-circle'></Icon>
                        <span>其他</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key='about'>
                    <Link to='/about'>
                        <Icon type='bulb'></Icon>
                        <span>关于</span>
                    </Link>
                </Menu.Item>
            </Menu>

        </div>;
}