import { Typography, Radio, Table, Divider, Button, Dropdown, Menu, Icon ,message} from 'antd';
const { Title } = Typography;
const axios = require('axios').default;
import { EditPanel } from '../article/editPage'
import host from '../../host'

export default class ArticleManagerPanel extends React.Component {


    constructor(props) {
        super(props);
        this.filter = -1;
        this.selectedItems = new Array();
        this.articelModel = null;
        this.state = {
            editMode: false,
            data: null,
            dataSource: null,
            onLoad: true

        }
        this.handleItemDelete = this.handleItemDelete.bind(this);
        this.handleItemSelectChange = this.handleItemSelectChange.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.loadArticle = this.loadArticle.bind(this);
        this.switchMode = this.switchMode.bind(this);
    }

    componentDidMount() {
        this.getData(1);
    }

    getData(page) {
        this.setState({
            onLoad: true
        })
        axios.get(host + '/admin/api/manager/article/getArticleList?page=' + page +
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

    handleItemSelectChange(selectedRowKeys, selectedRows) {
        this.selectedItems = selectedRowKeys;
    }

    handleItemDelete(article_id) {
        let form = new FormData();
        form.append('article_id', article_id)
        axios.post(host + '/admin/api/manager/article/deleteArticle', form).then(res => {
            let d = this.state.data;
            let index = d.pageItems.findIndex((v) => {
                return v.article_id == article_id;
            })
            d.pageItems.splice(index, 1);
            this.setState({
                data: d,
                dataSource: d.pageItems
            })

        }).catch(error=>{
            message.error( error.response.data.message);
        })
    }

    handlePageChange(page) {
        this.getData(page);
    }

    handleFilterChange(value) {
        this.filter = value;
        this.getData(1);
    }

    switchMode(mode, article_id) {
        if (mode)
            this.loadArticle(article_id);
        else {
            this.getData(1);
            this.setState({
                editMode: false,
            })
        }
    }

    loadArticle(article_id) {
        axios.get(host + '/admin/api/article/getArticle?article_id=' + article_id).then((res) => {
            this.articelModel = res.data;
            this.setState({
                editMode: true
            })
        }).catch(error=>{
            message.error( error.response.data.message);
        })
    }


    render() {

        if (this.state.editMode) {
            return <EditPanel changeMode={this.switchMode} model={this.articelModel}></EditPanel>
        }


        let count = 0;
        if (this.state.data != null)
            count = this.state.data.itemCount
        return (
            <div>
                <Title level={4}>文章管理</Title>
                <Radio.Group defaultValue="a" buttonStyle="solid">
                    <Radio.Button value="a" onClick={() => { this.handleFilterChange(-1) }}>全部</Radio.Button>
                    <Radio.Button value="b" onClick={() => { this.handleFilterChange(1) }}>已发布</Radio.Button>
                    <Radio.Button value="c" onClick={() => { this.handleFilterChange(0) }}>草稿</Radio.Button>
                </Radio.Group>
                <div style={{ float: 'right' }}>
                    <Dropdown overlay={<Menu >
                        <Menu.Item key="1" onClick={() => {
                            this.selectedItems.forEach((v) => {
                                this.handleItemDelete(v);
                            })
                        }}><span style={{ color: 'red' }}>删除</span></Menu.Item>
                    </Menu>}>
                        <Button >
                            选中操作 <Icon type="down" />
                        </Button>
                    </Dropdown>
                </div>
                <ArtcileTablePanel
                    dataSource={this.state.dataSource}
                    onItemSelectChange={this.handleItemSelectChange}
                    onArticleDelete={this.handleItemDelete}
                    itemCount={count}
                    onPageChange={this.handlePageChange}
                    onLoad={this.state.onLoad}
                    changeMode={this.switchMode}
                >
                </ArtcileTablePanel>
            </div>
        )
    }

}

class ArtcileTablePanel extends React.Component {

    columns = [
        {
            title: '标题',
            dataIndex: 'article_title',
            render: text => <a>{text}</a>
        },
        {
            title: '状态',
            dataIndex: 'article_status',
            render: text => {
                if(text)
                    return <a>文章</a>
                else
                    return <a style={{color:'red'}}>草稿</a>
                
            }
        },
        {
            title: '分类',
            dataIndex: 'article_category_name',
            render: text => {
                if (text == null)
                    text = '无分类'
                return (<a>{text}</a>)
            },
        },
        {
            title: '创建日期',
            dataIndex: 'article_create_time',
            render: text => {
                let d = new Date(text);
                d.setTime(text);
                let value = d.toLocaleDateString();
                return (<a>{value}</a>)
            },
        },
        {
            title: '浏览量',
            dataIndex: 'article_browsed_count',
            render: text => <a>{text}</a>,
        },
        {
            title: '评论数',
            dataIndex: 'article_comment_count',
            render: text => <a>{text}</a>,
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <span>
                    <Button size='small' onClick={() => {
                        this.props.changeMode(true, record.article_id);
                    }}>编辑</Button>
                    <Divider type="vertical" />
                    <Button size='small' onClick={()=>{
                        window.open(host+"/article/"+record.article_id,"_blank");
                    }}>浏览</Button>
                    <Divider type="vertical" />
                    <Dropdown overlay={<Menu >
                        <Menu.Item key="1" onClick={(e) => {
                            this.props.onArticleDelete(record.article_id);
                        }}><span style={{ color: 'red' }}>删除</span></Menu.Item>
                    </Menu>}>
                        <Button size='small'>
                            操作 <Icon type="down" />
                        </Button>
                    </Dropdown>
                </span>
            ),
        }
    ]
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={{ margin: '1rem', overflow: 'auto' }}>
                <Table columns={this.columns}
                    rowSelection={{ onChange: this.props.onItemSelectChange }}
                    dataSource={this.props.dataSource}
                    rowKey={record => record.article_id}
                    loading={this.props.onLoad}
                    pagination={{
                        showQuickJumper: true,
                        defaultCurrent: 1,
                        total: this.props.itemCount,
                        pageSize: 20,
                        onChange: this.props.onPageChange
                    }}
                >

                </Table>
            </div>
        );
    }
}