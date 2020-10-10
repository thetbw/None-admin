import { Typography, Radio, Table, Modal, Button, Dropdown, Menu, Icon, Divider } from 'antd';
const { Title } = Typography;
const axios = require('axios').default;
import { EditPanel } from '../article/editPage'
import host from '../../host'
// import { Models } from '_rmc-calendar@1.1.4@rmc-calendar/lib/date/DataTypes';

export default class CommentManagerPanel extends React.Component {


    constructor(props) {
        super(props);
        this.filter = 1;
        this.selectedItems = new Array();
        this.state = {
            data: null,
            dataSource: null
        }
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.handleItemDelete = this.handleItemDelete.bind(this);
        this.handleItemStatusChange = this.handleItemStatusChange.bind(this);
        this.handleItemSelectChange = this.handleItemSelectChange.bind(this);

    }

    componentDidMount() {
        this.getData(1);
    }

    getData(page) {
        this.setState({
            onLoad: true
        })
        axios.get(host + '/admin/api/manager/comment/getCommentList?page=' + page +
            '&max_page_length=20&filter=' + this.filter)
            .then(res => {
                this.setState({
                    data: res.data,
                    dataSource: res.data.pageItems
                })
            }).catch(error=>{
                message.error( error.response.data.message);
            })
            .finally(() => {
                this.setState({
                    onLoad: false
                })
            })
    }

    handleFilterChange(f) {
        this.filter = f;
        this.getData(1);
    }
    handlePageChange(page) {
        this.getData(page)
    }


    deleteItem(item_id) {
        let d = this.state.data;
        let index = d.pageItems.findIndex((v) => {
            return v.comment_id == item_id;
        })
        d.pageItems.splice(index, 1);
        this.setState({
            data: d,
            dataSource: d.pageItems
        })
    }

    handleItemStatusChange(item_id) {
        let form = new FormData();
        form.append('comment_id', item_id);
        form.append('comment_status', 1)
        axios.post(host + '/admin/api/manager/comment/switchCommentStatus', form).then(res => {
            this.deleteItem(item_id)
        }).catch(error=>{
            message.error( error.response.data.message);
        })
    }

    handleItemDelete(item_id) {
        let form = new FormData();
        form.append('comment_id',item_id)
        axios.post(host + '/admin/api/manager/comment/deleteComment',form).then(res => {
            this.deleteItem(item_id);
        }).catch(error=>{
            message.error( error.response.data.message);
        })
    }
    handleItemSelectChange(value){
        this.selectedItems = value;
    }

    render() {
        let count = 0;
        if (this.state.data != null)
            count = this.state.data.itemCount
        return (
            <div>
                <Title level={4}>评论管理</Title>
                <Radio.Group defaultValue="a" buttonStyle="solid">
                    <Radio.Button value="a" onClick={() => { this.handleFilterChange(1) }}>已审核</Radio.Button>
                    <Radio.Button value="b" onClick={() => { this.handleFilterChange(0) }}><a style={{ color: 'red' }}>未审核</a></Radio.Button>
                </Radio.Group>
                <div style={{ float: 'right' }}>
                    <Dropdown overlay={<Menu >
                        <Menu.Item key="1" onClick={() => {
                            this.selectedItems.forEach((v) => {
                                this.handleItemDelete(v);
                            })
                        }}><span style={{ color: 'red' }} >删除</span></Menu.Item>
                    </Menu>}>
                        <Button >
                            选中操作 <Icon type="down" />
                        </Button>
                    </Dropdown>
                </div>
                <CommentTablePanel
                    onItemSelectChange={this.handleItemSelectChange}
                    onPageChange={this.handlePageChange}
                    dataSource={this.state.dataSource}
                    itemCount={count}
                    onItemStatusChange={this.handleItemStatusChange}
                    onItemDelete={this.handleItemDelete}
                ></CommentTablePanel>
            </div>
        )
    }

}

class CommentTablePanel extends React.Component {



    columns = [
        {
            title: '用户id',
            dataIndex: 'comment_user_id',
            render: text => <a>{text}</a>
        },
        {
            title: '昵称',
            dataIndex: 'comment_user_nickname',
            render: (text, record) => {
                return <a>{text}</a>
            }
        },
        {
            title: '内容',
            dataIndex: 'comment_body',
            render: text => {
                let zoom = null;
                if (text.length > 20) {
                    zoom = <Icon type="zoom-in" onClick={
                        () => {
                            Modal.info({
                                title: '评论内容',
                                content: text,
                                maskClosable: true
                            })
                        }
                    }></Icon>
                }
                let value = text.substr(0, 20);
                return (
                    <span >
                        <a >{value}</a>
                        {zoom}
                    </span>
                )
            }
        },
        {
            title: '操作',
            ket: 'action',
            render: (text, record) => {
                let check = null;
                if (record.comment_status == 0)
                    check = (
                        <span>
                            <Button
                                size='small'
                                type='primary'
                                onClick={() => {
                                    this.props.onItemStatusChange(record.comment_id);
                                }}
                            >通过</Button>
                            <Divider type="vertical" />
                        </span>)
                return (
                    <span>
                        {check}
                        <Button size='small' type='danger'
                            onClick={() => {
                                this.props.onItemDelete(record.comment_id);
                            }}
                        >删除</Button>
                    </span>
                )
            }
        }
    ]

    constructor(props) {
        super(props);

    }
    render() {
        return (
            <div style={{ margin: '1rem', overflow: 'auto' }}>
                <Table
                    rowSelection={{ onChange: this.props.onItemSelectChange }}
                    columns={this.columns}
                    dataSource={this.props.dataSource}
                    rowKey={record => record.comment_id}
                    pagination={{
                        showQuickJumper: true,
                        defaultCurrent: 1,
                        total: this.props.itemCount,
                        pageSize: 20,
                        onChange: this.props.onPageChange
                    }}
                ></Table>
            </div>
        )
    }
}