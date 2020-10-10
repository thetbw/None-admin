import * as React from "react";
import { Typography, Input, Table, Form, Divider, Button, TreeSelect, Radio, message, Modal } from 'antd';
import Axios from "axios";
const { Title } = Typography;
import host from '../../host'


export default class PowerManagerPanel extends React.Component {
    columns = [
        {
            title: '权限名',
            dataIndex: 'power_name',
            key: 'power_name',
        },
        {
            title: '权限标识',
            dataIndex: 'power_ident',
            key: 'power_ident'
        },
        {
            title: '权限类别',
            dataIndex: 'power_type',
            render: (type) => {
                return type == 1 ? (<span>菜单</span>) : (<span>操作</span>)
            }
        },
        {
            title: '操作',
            width: 200,
            render: (row) => {
                return (
                    <span>
                        <Button size="small" type="primary" onClick={()=>this.handlePowerUpdate(row)}>修改</Button>
                        <Divider type="vertical" />
                        <Button size="small" type="danger" onClick={()=>this.handlePowerDelete(row)}>删除</Button>
                    </span>
                )
            }
        }
    ]
    constructor(props) {
        super(props);
        this.state = {
            title: '添加权限',//打开对话框的title
            is_open: false,//对话框打开状态
            power: {
                power_type: 1
            },
            dataList: [],
        };
    }
    componentDidMount() {
        this.loadData();
    }
    //加载表格数据
    loadData = () => {
        Axios({
            url: host + '/admin/api/power/list'
        }).then(res => {
            this.setState({
                dataList: res.data
            })

        }).catch(res => {

        })
    }
    //添加权限
    addPower = (p) => {
        Axios({
            url: host + '/admin/api/power/add',
            method: 'post',
            data: p
        }).then(res => {

            this.setState({
                title: '',
                is_open: false,
                power: { power_type: 1 }
            })
            this.loadData();
        }).catch((error) => {
            // console.log("233333333333333")
            // console.log()
            message.error("错误：" + error.response.data.message);
        })
    }
    //更新权限
    updatePower = (p) => {
        Axios({
            url: host + '/admin/api/power/update',
            method: 'post',
            data: p
        }).then(res => {
            this.setState({
                title: '',
                is_open: false,
                power: { power_type: 1 }
            })
            this.loadData();

        }).catch(error => {

            message.error("错误：" + error.response.data.message);
        })
    }

    //删除权限
    deletePower=(power_id)=>{
        Axios({
            url:host + '/admin/api/power/delete',
            method:"get",
            params:{
                id:power_id
            }
        }).then(res=>{
            this.loadData();
        }).catch(error=>{
            message.error("错误：" + error.response.data.message);
        })
    }

    //添加权限
    handlePowerAdd = () => {
        this.setState({
            title: '添加权限',
            is_open: true,
        })
    }
    //修改按钮事件
    handlePowerUpdate=(power)=>{
        if(power.power_parent_id==0){
            power.power_parent_id=null;
        }
        this.setState({
            title: '修改',
            is_open: true,
            power:power
        })
    }

    //删除按钮事件
    handlePowerDelete=(power)=>{
        this.deletePower(power.power_id);
    }

    //对话框关闭事件
    handleModalClosed = () => {
        this.setState({
            title: '',
            is_open: false,
            power: {}
        })
    }

    //对话框确定事件
    handleModalOk = () => {
        let power = this.state.power;
        console.log(power)
        if (power.power_id) {
            this.updatePower(power);
        } else {
            this.addPower(power);
        }
    }

    /**
     * 格式化父树形选择器的数据
     */
    formatTreeData = () => {
        let list = this.state.dataList
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


    setPowerValue = (key, value) => {
        let power = this.state.power;
        power[key] = value;
        this.setState({
            power: power
        })
    }

    render() {
        return (
            <div>
                <Title level={4}>权限管理</Title>
                <div className="filter" style={{ margin: '10px 10px' }}>
                    <Button type="primary" size="small" onClick={this.handlePowerAdd}>新增</Button>
                </div>
                <div>
                    <Table
                        columns={this.columns}
                        dataSource={this.state.dataList}
                        rowKey="power_id"
                        bordered />
                </div>
                <Modal
                    title={this.state.title}
                    visible={this.state.is_open}
                    onCancel={this.handleModalClosed}
                    onOk={this.handleModalOk}
                    maskClosable={false}>
                    <Form labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} >
                        <Form.Item label="父权限">
                            <TreeSelect
                                treeData={this.formatTreeData()} allowClear
                                value={this.state.power.power_parent_id}
                                onChange={(v) => { this.setPowerValue('power_parent_id', v) }}

                            />


                        </Form.Item>
                        <Form.Item label="权限名">
                            <Input placeholder="请输入权限名" value={this.state.power.power_name}
                                onChange={(e) => { this.setPowerValue('power_name', e.target.value) }} />
                        </Form.Item>
                        <Form.Item label="权限标识">
                            <Input placeholder="请输入权限标识" value={this.state.power.power_ident}
                                onChange={(e) => { this.setPowerValue('power_ident', e.target.value) }} />
                        </Form.Item>
                        <Form.Item label="权限类别">
                            <Radio.Group
                                value={this.state.power.power_type}
                                onChange={(e) => { this.setPowerValue('power_type', e.target.value) }}>
                                <Radio value={1}>菜单</Radio>
                                <Radio value={2}>操作</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}