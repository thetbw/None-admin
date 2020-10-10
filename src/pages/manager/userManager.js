import * as React from "react";
import { Typography, Input, Table, Divider, Button, Form, Tag, Modal, Select, Drawer, Tree, message } from 'antd';
const { Title } = Typography;
const { Option } = Select
const axios = require('axios').default;
import host from '../../host'
import Axios from "axios";


/**
 * 用户管理组件
 */
export default class UserManagerPanel extends React.Component {
    columns = [
        {
            title: '用户id',
            dataIndex: 'user_id',
            key: 'user_id',
        },
        {
            title: '用户昵称',
            dataIndex: 'user_nickname',
            key: 'user_nickname'
        },
        {
            title: '用户名',
            dataIndex: 'user_name',
            key: 'user_name',
        },
        {
            title: '用户角色',
            dataIndex: 'user_role',
            render: (role) => {
                let com = null;
                if (role == -1) {
                    com = (<Tag color="purple">超级管理员</Tag>)
                } else if (role == 0) {
                    com = (<Tag color="magenta">管理员</Tag>)
                } else if (role == 1) {
                    com = (<Tag color="blue">注册用户</Tag>)
                } else if (role == 2) {
                    com = (<Tag color="lime">游客</Tag>)
                } else {
                    com = (<Tag color="gray">未知</Tag>)
                }
                return com;
            }
        },
        {
            title: '用户邮箱',
            dataIndex: 'user_email',
            key: 'user_email'
        },
        {
            title: '操作',
            width: 150,
            render: (row) => {
                return (
                    <span>
                        <Button size="small" onClick={() => this.handleUserUpdate(row)}>编辑</Button>
                        <Divider type="vertical" />
                        <Button size="small" onClick={() => this.handelUserDelete(row)}>删除</Button>

                    </span>
                )
            }
        }
    ]


    constructor(props) {
        super(props);
        this.state = {
            queryParams: { //请求的参数
                page: 1,
                lenght: 20,
                user_role: null
            },
            modalTitle: '',
            modalOpen: false,
            drawerOpen: false,
            user: {},
            dataList: [],
            powerList: [],//权限列表
            selectedPower: [],//已经选择的权限列表
        };
    }

    componentDidMount() {
        this.loadData();
        this.loadPowerList();
    }

    /**
     * 加载列表数据
     */
    loadData = () => {
        Axios({
            url: host + '/admin/api/user/list',
            method: 'get',
            params: this.state.queryParams
        }).then(res => {
            let data = res.data;
            this.setState({
                dataList: data.pageItems
            })
        })
    }


    /**
     * 格式化父树形选择器的数据
     */
    formatTreeData = () => {
        let list = this.state.powerList
        let result = [];
        for (let i in list) {
            result.push(this.convert(list[i]));
        }
        // console.log("----树形数据转换---")
        // console.log(result);
        return result;
    }

    convert(power) {
        let obj = {
            key: power.power_id,
            title: power.power_name,
            value: power.power_id,
            children: power.children ? power.children.map((p) => { return this.convert(p) }) : null
        };
        return obj;
    }

    //加载权限列表
    loadPowerList = () => {
        Axios({
            url: host + '/admin/api/power/list'
        }).then(res => {
            this.setState({
                powerList: res.data
            })

        }).catch(res => {

        })
    }

    //添加用户
    addUser = (user) => {
        Axios({
            url: host + '/admin/api/user/add',
            method: 'put',
            data: user
        }).then(res => {
            this.setState({
                modalOpen: false
            })
            this.loadData();

        }).catch(error => {
            message.error("错误：" + error.response.data.message);
        })
    }
    //删除用户
    deleteUser = (user_id) => {
        Axios({
            url: host + '/admin/api/user/' + user_id,
            method: 'DELETE',
        }).then(() => {
            this.loadData();
        }).catch(error => {
            message.error("错误：" + error.response.data.message);
        })
    }

    updateUser = (user) => {
        Axios({
            url: host + '/admin/api/user/update',
            method: 'post',
            data: user
        }).then(() => {
            this.setState({
                modalOpen: false
            })
            this.loadData();
        }).catch(error => {
            message.error("错误：" + error.response.data.message);
        })
    }

    handleUserAdd() {
        this.setState({
            modalOpen: true,
            modalTitle: '创建用户',
            user: {
                user_role: 1,
            },
            selectedPower: []
        })
    }
    handleUserUpdate = (user) => {
        this.setState({
            modalOpen: true,
            modalTitle: '更新用户',
            user: user,
            selectedPower: this.coventSelectedPowers(user)
        })
    }

    //删除用户
    handelUserDelete = (user) => {
        this.deleteUser(user.user_id);
    }
    coventSelectedPowers(user) {
        let arr = [];
        if (user && user.powers) {
            for (let i in user.powers) {
                arr.push(user.powers[i].power_id)
            }
        }
        return arr;
    }

    handleModalClosed = () => {
        this.handleDrawerClose();
        this.setState({
            modalOpen: false
        })
    }
    handleModalOk = () => {
        let user = this.state.user;
        let powers = [];
        let selectPower = this.state.selectedPower;
        for (let i in selectPower) {
            powers.push({
                power_id: selectPower[i]
            })
        }
        user.powers = powers;
        if (user.user_id) {
            this.updateUser(user)
        } else {
            this.addUser(user);
        }

    }
    handleDrawerOpen = () => {
        this.setState({
            drawerOpen: true
        })
    }
    handleDrawerClose = () => {
        this.setState({
            drawerOpen: false
        })
    }
    setUserValue = (key, value) => {
        let user = this.state.user;
        user[key] = value;
        this.setState({
            user: user
        })
    }

    setParams = (key, value) => {
        let param = this.state.queryParams;
        param[key] = value;
        this.setState({
            queryParams: param
        })
        this.loadData();
    }



    render() {
        return (
            <div>
                <Title level={4}>用户管理</Title>
                <div style={{ margin: '10px 10px' }}>
                    <Select value={this.state.queryParams.user_role}
                        size="small"
                        placeholder="身份筛选"
                        style={{ width: '120px' }}
                        onChange={(v) => this.setParams("user_role", v)} allowClear={true}>
                        <Option value={-1} >超级管理员</Option>
                        <Option value={0} >管理员</Option>
                        <Option value={1} >登录用户</Option>
                        <Option value={2} >游客</Option>
                    </Select>
                    <Divider type="vertical" />
                    <Button type="primary" size="small" onClick={() => this.handleUserAdd()}>添加用户</Button>
                </div>
                <Table columns={this.columns} bordered dataSource={this.state.dataList} rowKey="user_id">
                </Table>
                <Modal
                    title={this.state.modalTitle}
                    visible={this.state.modalOpen}
                    onCancel={this.handleModalClosed}
                    onOk={this.handleModalOk}
                    maskClosable={false}
                >
                    <Form labelCol={{ span: 5 }} wrapperCol={{ span: 10 }}>
                        <Form.Item label="用户名(登录名)" required={true}>
                            <Input placeholder="输入用户名" value={this.state.user.user_name}
                                onChange={(e) => this.setUserValue("user_name", e.target.value)}
                            />
                        </Form.Item>
                        <Form.Item label="用户昵称" required={true}>
                            <Input placeholder="输入用户昵称"
                                value={this.state.user.user_nickname}
                                onChange={(e) => this.setUserValue("user_nickname", e.target.value)}
                            />
                        </Form.Item>
                        <Form.Item label="用户密码" required={true}>
                            <Input placeholder="输入用户密码"
                                value={this.state.user.user_pass_string}
                                onChange={(e) => this.setUserValue("user_pass_string", e.target.value)}
                            />
                        </Form.Item>
                        <Form.Item label="用户邮箱">
                            <Input placeholder="用户邮箱"
                                value={this.state.user.user_email}
                                onChange={(e) => this.setUserValue("user_email", e.target.value)}
                            />
                        </Form.Item>
                        <Form.Item label="用户角色">
                            <Select value={this.state.user.user_role} onChange={v => this.setUserValue("user_role", v)}>
                                <Option value={-1} disabled>超级管理员</Option>
                                <Option value={0} >管理员</Option>
                                <Option value={1} >登录用户</Option>
                                <Option value={2} disabled>游客</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="用户权限">
                            <Button onClick={this.handleDrawerOpen}>点击选择权限</Button><i>仅限管理员</i>
                        </Form.Item>
                    </Form>

                </Modal>
                <Drawer visible={this.state.drawerOpen} width={500} maskClosable={true} onClose={this.handleDrawerClose}>
                    <Title level={4}>选择权限</Title>
                    <Tree
                        treeData={this.formatTreeData()}
                        checkable
                        selectable={false}
                        checkedKeys={this.state.selectedPower}
                        onCheck={(v) => this.setState({ selectedPower: v })}


                    />


                </Drawer>

            </div>
        )
    }
}