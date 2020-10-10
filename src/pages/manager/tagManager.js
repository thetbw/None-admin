import {Typography, Tag, message, Row} from 'antd';
import * as React from "react";

const {Title} = Typography;
import host from '../../host'

const axios = require('axios').default;


export default class TagManagerPanel extends React.Component {

    render() {

        return (
            <div>
                <Title level={4}>标签管理</Title>
                <TagsPanel></TagsPanel>
            </div>
        )
    }

}

class TagsPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null
        };

    }

    componentDidMount() {
        this.loadData(1)
    }

    loadData = (page) => {
        axios.get(host + '/admin/api/manager/tag/getTagList?page=' + page + '&max_page_length=' + 100)
            .then(res => {
                this.setState({
                    data: res.data
                })
            }).catch(error=>{
                message.error( error.response.data.message);
            })
    }

    handleTagDelete=(id)=>{
        let formData =new FormData();
        formData.append('tag_id',id)
        axios.post(host+'/admin/api/manager/tag/deleteTag',formData)
            .then(()=>{
                message.info('删除成功');
            })
            .catch((error)=>{
                message.error('删除失败')
                if (error.response && error.response.data) {
                    message.error(error.response.data.message);
                }
            })
    }

    render() {
        this.state.data&&console.log(this.state.data.pageItems);
        return (<div style={{marginTop: '1rem',padding:'1rem'}}>
            {this.state.data && this.state.data.itemCount > 0 ? (
                <div >
                    {this.state.data.pageItems.map((value,index)=>{
                        return (
                            <Tag key={value.tag_id} closable onClose={()=>{this.handleTagDelete(value.tag_id)}}>{value.tag_name}</Tag>)
                    })}
                </div>
            ) : (
                <div>no data</div>
            )}
        </div>)


    }

}