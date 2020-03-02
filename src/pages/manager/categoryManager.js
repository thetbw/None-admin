import {Typography, Table, Button, Divider, Icon, Input, message,Tag} from 'antd';
import Axios from 'axios';
const {Title} = Typography
const axios = require('axios').default;
import host from '../../host'
import React from "react";
import {EditableLabel} from '../compents/compents1'

export default class CategoryManagerPanel extends React.Component {

    constructor(props) {
        super(props);
        this.categorys = new Array();
        this.state = {
            parent_id: 0,
            path: ''
        }
    }

    componentDidMount() {
        this.loadPath(this.state.parent_id);
    }


    loadPath = (parent_id) => {
        axios.get(host + '/admin/api/manager/category/getCategoryPath?category_id=' + parent_id).then(res => {
            this.categorys.push({id: this.state.parent_id, name: this.state.path});
            this.setState({
                path: res.data,
                parent_id: parent_id
            })
        })

    }
    handleChange = (id) => {
        if (id == this.state.parent_id) return;
        this.loadPath(id);
    }

    handleBack = () => {
        const prev = this.categorys.pop()
        this.setState({
            parent_id: prev.id,
            path: prev.name
        })
    }

    render() {

        return (
            <div>
                <Title level={4}>分类管理 <a style={{color: '#7F7E7E'}}>{this.state.path}</a></Title>
                <CategoryTablePanel
                    parent_id={this.state.parent_id}
                    parentChange={this.handleChange}
                    onBack={this.handleBack}
                />

            </div>

        )
    }

}

/**
 * 可编辑的标签
 */


class CategoryTablePanel extends React.Component {

    columns = [
        {
            title: 'ID',
            dataIndex: 'category_id',
            align:'left',
            render: text => <a>{text}</a>
        },
        {
            title: '名称',
            dataIndex: 'category_name',
            align:'left',
            render: (text, record) => {
                return (
                    <EditableLabel text={text} onInputComplete={(text)=>{
                        let formDate = new FormData()
                        formDate.append('category_id',record.category_id);
                        formDate.append('category_name',text)
                        axios.post(host+'/admin/api/manager/category/alterCategory',formDate)
                            .then(()=>{
                                message.info('修改成功');
                            })
                            .catch(error=>{
                                message.error('修改失败');
                                if (error.response && error.response.data) {
                                    message.error(error.response.data.message);
                                }
                            })
                    }}></EditableLabel>
                )
            }
        },
        {
            title: '文章数量',
            dataIndex: 'category_article_num',
            align:'left',
            render: text => <a>{text}</a>
        },
        {
            title: '操作',
            key: 'action',
            align:'center',
            render: (text, record) => {
                return (
                    <span>
                        <Button size='small' onClick={() => {
                            this.props.parentChange && this.props.parentChange(record.category_id);
                        }}>查看子分类</Button>
                        <Divider type="vertical"/>
                        <Button type='danger' size='small' onClick={() => {
                            this.deleteCategory(record.category_id)
                        }}>删除分类</Button>
                    </span>
                )
            }
        }
    ]

    constructor(props) {
        super(props);
        this.state = {
            data: null,
            loading: true,
            addCategory: false,
            newCategoryName: '',
            currentPage: 1
        }
    }

    componentDidMount() {
        this.loadDate(1, this.props.parent_id);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.loadDate(1, nextProps.parent_id);
    }


    loadDate = (p, parent_id) => {
        this.setState({
            loading: true
        })
        this.handleLoad(p, parent_id)
    }
    /**
     * 仅供loadData调用
     * @param p
     * @param parent_id
     */
    handleLoad = (p, parent_id) => {
        axios.get(host + '/admin/api/manager/category/getCategoryList?page=' + p + '&max_page_length=20&parent_id=' + parent_id)
            .then(res => {
                this.setState({
                    data: res.data,
                    currentPage: p
                })
            })
            .finally(() => {
                this.setState({
                    loading: false
                })
            });

    }

    addCategoryChange = (e) => {
        this.setState({
            newCategoryName: e.target.value
        })
    }

    addCategory = () => {
        let formData = new FormData();
        formData.append('parent_id', this.props.parent_id);
        formData.append('category_name', this.state.newCategoryName)
        axios.post(host + '/admin/api/manager/category/addCategory', formData).then(() => {
            message.info('分类添加成功');
            this.loadDate(1, this.props.parent_id);
        }).catch((error) => {
            message.error('分类添加失败');
            if (error.response && error.response.data) {
                message.error(error.response.data.message);
            }
        }).finally(() => {
            this.setState({
                addCategory: false,
                newCategoryName: ''
            })
        })
    }

    deleteCategory = (category_id) => {
        let formDate = new FormData();
        formDate.append('category_id', category_id)
        formDate.append('cascade', 1)
        axios.post(host + '/admin/api/manager/category/deleteCategory', formDate)
            .then(() => {
                message.info('删除成功');
                this.loadDate(1, this.props.parent_id);
            })
            .catch((error) => {
                message.error('删除失败');
                if (error.response && error.response.data) {
                    message.error(error.response.data.message);
                }
            })

    }

    onPageChange = (page) => {
        this.loadDate(page, this.props.parent_id);
    }

    render() {
        const backButton = this.props.parent_id ?
            (<Button size='small' style={{marginRight: '0.3rem'}} onClick={() => {
                this.props.onBack()
            }
            }><Icon type="double-left"/>返回上一级</Button>)
            : null;
        const items = this.state.data ? this.state.data.pageItems : null;
        const addButton = this.state.addCategory ?
            (<span style={{marginLeft: '0.3rem'}}>
                <Input size='small' placeholder='输入分类名' value={this.state.newCategoryName}
                       onChange={this.addCategoryChange} maxLength={32}
                       onPressEnter={this.addCategoryea}
                       style={{maxWidth: '200px', marginRight: '0.3rem'}}/>
                <Button size='small' onClick={this.addCategory}><Icon type="check"/></Button>
            </span>)
            : null;

        return (
            <div>
                <div style={{margin: '0.3rem'}}>
                    {backButton}
                    <Button size='small' onClick={() => {
                        this.setState({addCategory: true})
                    }}>新增</Button>
                    {addButton}
                </div>
                <Table
                    loading={this.state.loading}
                    columns={this.columns}
                    dataSource={items}
                    rowKey={record => record.category_id}
                    tableLayout="fixed"
                    pagination={{
                        showQuickJumper: true,
                        defaultCurrent: 1,
                        current: this.state.currentPage,
                        total: this.state.data ? this.state.data.itemCount : 0,
                        pageSize: 20,
                        onChange: this.onPageChange
                    }}
                />
            </div>
        )
    }
}