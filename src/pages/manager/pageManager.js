import {Typography, Table, Select, Button, Divider, message} from 'antd';
import Editor from 'for-editor'
const {Option} = Select;
import * as React from "react";

import QueueAnim from 'rc-queue-anim';
const {Title} = Typography;
import {DndProvider, DragSource, DropTarget} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import {EditableLabel} from '../compents/compents1'

const axios = require('axios').default;
import host from '../../host'

export default class PageManagerPanel extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            edit:false,
            callback:null,
            value:'',
            defaultValue:''
        }
    }

    openEditPanel=(callback,defaultValue)=>{
        this.setState({
            edit:true,
            callback:callback,
            value:defaultValue,
            defaultValue:defaultValue
        })
    }



    render() {
        const edit = this.state.edit?
            (<div>
                <p>
                    <Button onClick={()=>{
                        this.state.callback(this.state.defaultValue,true);
                        this.setState({
                            edit:false,
                            callback:null,
                            value:'',
                            defaultValue:''
                        })
                    }
                    }>取消编辑</Button>&nbsp;
                    <Button type={'primary'} onClick={()=>{
                        this.state.callback(this.state.value,true);
                        this.setState({
                            edit:false,
                            callback:null,
                            value:'',
                            defaultValue:''
                        })
                    }}>完成编辑</Button>
                </p>

                <Editor value={this.state.value} onChange={(v)=>{
                    this.setState({
                        value:v
                    })
                    this.state.callback(v,false);
                }}/>
            </div>)
            :null;
        const style = this.state.edit?{display:'none'}:null;

        return (
            <div>
                <QueueAnim type={['right', 'right']}>
                    {edit}
                </QueueAnim>
                <div style={style}>
                    <Title level={4}>页面管理</Title>
                    <PageTabelPanel openEditPanel={this.openEditPanel}></PageTabelPanel>
                </div>

            </div>
        )
    }

}

class BodyRow extends React.Component {
    render() {
        const {isOver, connectDragSource, connectDropTarget, moveRow, ...restProps} = this.props;
        let style = {...restProps.style, cursor: 'move'};
        // const style = { ...restProps.style, backgroundColor: '#ff0000' };

        let {className} = restProps;
        if (isOver) {
            // if (restProps.index > dragingIndex) {
            //     // className += ' drop-over-downward';
            //
            // }
            // if (restProps.index < dragingIndex) {
            //     // className += ' drop-over-upward';
            // }
            style = {...restProps.style, cursor: 'move', backgroundColor: 'rgba(0,0,0,0.09)'};
        }
        return connectDragSource(
            connectDropTarget(<tr {...restProps} className={className} style={style}/>),
        );
    }
}

const rowSource = {
    beginDrag(props) {
        // dragingIndex = props.index;
        return {
            record: props.record,
        };
    },
};

const rowTarget = {
    drop(props, monitor) {
        const dragIndex = monitor.getItem().record.page_order;
        const hoverIndex = props.record.page_order;

        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
            return;
        }

        // Time to actually perform the action
        props.moveRow(monitor.getItem().record, hoverIndex);

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        // monitor.getItem().index = hoverIndex;
    },
};

const DragableBodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
}))(
    DragSource('row', rowSource, connect => ({
        connectDragSource: connect.dragSource(),
    }))(BodyRow),
);

class PageTabelPanel extends React.Component {

    columns = [
        {
            title: '排序',
            dataIndex: 'page_order',
            align:'left',
        },
        {
            title: '名称',
            dataIndex: 'page_name',
            align:'left',
            render: (text, record) => {
                return (
                    <EditableLabel text={text} onInputComplete={(t) => {
                        record.page_name = t
                        this.updatePage(record);
                    }}/>
                )
            }
        },
        {
            title: '类型',
            dataIndex: 'page_type',
            align:'left',
            render: (text, record) => {
                return (
                    <Select defaultValue={text} style={{width: 80}} onChange={(value) => {
                        record.page_type = value;
                        this.updatePage(record);
                    }}>
                        <Option value={0}>页面</Option>
                        <Option value={1}>链接</Option>
                    </Select>
                )
            }
        },
        {
            title: '链接',
            key: 'link',
            align:'left',
            render: (record) => {
                let text = record.page_url;
                return (
                    <EditableLabel text={text} onInputComplete={(t) => {
                        record.page_url = t;
                        this.updatePage(record);
                    }}/>
                )
            }
        },
        {
            title: '操作',
            key: 'action',
            align:'center',
            render: (record) => {
                let contentButton = !record.page_type ? (<span><Button size='small' onClick={() => {
                    if (!record.page_content){
                        record.page_content=new Object();
                        record.page_content.content_body="";
                    }
                    this.props.openEditPanel((v,f)=>{
                        record.page_content.content_body=v;
                        console.log(record.page_content.content_body)
                        if (f)  this.updatePage(record);
                    },record.page_content.content_body);
                }}>页面内容编辑</Button><Divider type='vertical'/></span>) : null;
                let finshAdd = record.isNew ? (<span><Button size='small' type='primary' onClick={() => {
                     axios.post(host+'/admin/api/manager/page/addPage',record)
                         .then(()=>{
                             message.info('添加成功');
                             this.loadData();
                         })
                         .catch((error)=>{
                             message.error('添加失败');
                         })
                }}>完成添加</Button><Divider type='vertical'/></span>) : null
                return (<span>
                     {contentButton}{finshAdd}<Button size='small' type='danger' onClick={() => {
                    if (record.isNew) {
                        this.setState({
                            data: this.state.data ? this.state.data.filter((p) => {
                                return p.page_id != record.page_id && !p.isNew
                            }) : this.state.data
                        })
                    } else {
                        let form = new FormData();
                        form.append('page_id', record.page_id)
                        axios.post(host + '/admin/api/manager/page/deletePage', form)
                            .then(() => {
                                message.info('删除成功');
                                this.loadData();
                            }).catch(() => {
                            message.error('未知错误');
                        })
                    }
                }}>删除分类</Button>
                 </span>)
            }
        }
    ]

    components = {
        body: {
            row: DragableBodyRow,
        },
    };

    updatePage = (page) => {
        if (page.isNew) return;
        axios.post(host + '/admin/api/manager/page/updatePage', page)
            .then(() => {
                message.info('修改成功');
                this.loadData();
            }).catch(() => {
            message.error('未知错误');
            this.loadData();
        })
    }

    constructor(props) {
        super(props);
        this.state = {
            data: null,
            loading: true
        }
    }

    moveRow = (record, hoverIndex) => {
        this.setState({
            loading: true
        })
        const data = new Object();
        data.page_id = record.page_id;
        data.page_index = hoverIndex - 1;
        axios.post(host + '/admin/api/manager/page/sortPage', data)
            .then(res => {
                message.info('修改成功');
                this.loadData()
            })
            .catch(() => {
                message.error('修改失败');
            })
            .finally(() => {
                this.setState({
                    loading: false
                })
            })
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        axios.get(host + '/admin/api/manager/page/getPageList')
            .then(res => {
                this.setState({
                    data: res.data.pageItems
                })
            }).finally(() => {
            this.setState({
                loading: false
            })
        })
    }

    addPage = () => {
        let page = new Object();
        page.page_id = 0;
        page.page_name = '新增页面';
        page.page_content_id = 0;
        page.page_order = this.state.data ? this.state.data.length+1 : 1;
        page.page_type = 1;
        page.page_url = '/404';
        page.page_content = null;
        page.isNew = true
        this.setState({
            data: [...this.state.data, page]
        })
    }


    render() {

        return (
            <div>
                <Button size={"small"} onClick={this.addPage}>新增</Button>
                <DndProvider backend={HTML5Backend}>
                    <Table
                        columns={this.columns}
                        dataSource={this.state.data}
                        components={this.components}
                        rowKey={record => record.page_id}
                        pagination={false}
                        tableLayout="fixed"
                        loading={this.state.loading}
                        onRow={(record) => ({
                            record: record,
                            moveRow: this.moveRow,
                        })}
                    />
                </DndProvider>
            </div>
        )

    }

}

