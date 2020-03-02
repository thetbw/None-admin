import { message, Button, Checkbox, Row, Col, Input, Cascader, Select } from 'antd';
import 'easymde/dist/easymde.min.css';
import host from '../../host'

import Editor from 'for-editor'

import ArticleStyle from '../../css/style.css'

const axios = require('axios').default;

class EditPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content_id: 0,
            article_id: 0,
            content_body: '', //文章主体
            article_category_id: 0, //文章目录
            article_custom_url: null, //文章自定义链接
            article_status: 1, //文章状态
            article_cover: '', //文章封面
            article_is_top: 0, //文章是否置顶
            article_access_pass: "",
            article_title: '',//文章标题
            default_category:0,
            Tags: [

            ], //文章标签
        }
        this.updateMode = false;

        this.handleContentChange = this.handleContentChange.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.handleAcessPassChange = this.handleAcessPassChange.bind(this);
        this.handleTagsChange = this.handleTagsChange.bind(this);
        this.handleCoverChange = this.handleCoverChange.bind(this);
        this.handleTopChange = this.handleTopChange.bind(this);
        this.pulishArticle = this.pulishArticle.bind(this);
    }
    componentDidMount() {
        if (this.props.model != null) {
            this.updateMode = true
            this.initStateFromModel(this.props.model);
        }
    }

    /**
     * 设置文章标签
     * @param {Array} tags 
     */
    handleTagsChange(tags) {
        this.setState({
            Tags: tags
        })
    }


    /**
     * 文章处理
     * @param {String} value 
     */
    handleContentChange(value) {
        this.setState({
            content_body: value
        })
    }

    handleCategoryChange(value) {

        this.setState({
            article_category_id: value[value.length-1],
            default_category:value
        })
    }
    /**
     * 标题问题
     * @param {Event} e 
     */
    handleTitleChange(e) {
        this.setState({
            article_title: e.target.value
        })
    }

    handleAcessPassChange(value) {
        this.setState({
            article_access_pass: value
        });
    }

    handleCoverChange(value) {
        this.setState({
            article_cover: value
        })
    }

    handleTopChange(value) {
        this.setState({
            article_is_top: value
        })

    }

    /**
     * 
     * @param {int} status 文章状态 1 发布文章 0存为草稿
     */
    pulishArticle(status) {
        let url = '/admin/api/article/publishArticle';
        if (this.updateMode)
            url = '/admin/api/article/updateArticle';

        this.setState({
            article_status: status
        })
        if (this.state.article_title.length == 0) {
            message.warning("文章标题不能为空")
            return;
        }
        let model = this.getModel(this.state, status);
        const key = 'pulish';

        message.loading({ content: '正在发布', key: key });
        axios.post(host + url, model).then(res => {
            message.success({ content: '发布完成', key: key })
            if (this.props.switch2finsh != null)
                this.props.switch2finsh();
        }).catch((error) => {
            message.error({ content: '失败', key: key });
            alert(error)
            
        })

    }

    getModel(value, status) {
        let model = new Object();
        let article = new Object();

        article.article_id = value.article_id;
        article.article_title = value.article_title;
        article.article_access_pass = value.article_access_pass;
        article.article_is_top = value.article_is_top;
        article.article_cover = value.article_cover;
        article.article_status = status;
        article.article_custom_url = value.article_custom_url;
        article.article_category_id = value.article_category_id;
        article.article_content = new Object();
        article.article_content.content_body = value.content_body;
        article.article_content.content_id = value.content_id
        model.Article = article;
        model.Tags = value.Tags;
        return model;
    }

    initStateFromModel(model) {
        if (model.article_content == null)
            model.article_content = new Object();

        let tags = new Array();
        model.article_tags.forEach((v) => {
            tags.push(v.tag_name);
        });
        this.setState({
            content_id: model.article_content_id,
            article_id: model.article_id,
            content_body: model.article_content.content_body,
            article_category_id: model.article_category_id,
            article_custom_url: model.article_custom_url, //文章自定义链接
            article_status: model.article_status, //文章状态
            article_cover: model.article_cover, //文章封面
            article_is_top: model.article_is_top, //文章是否置顶
            article_access_pass: model.article_access_pass,
            article_title: model.article_title,//文章标题
            Tags: tags
        })
        this.getCategoryPath(model.article_category_id);
    }

    getCategoryPath=(id)=>{
        axios.get(host+'/admin/api/manager/category/getCategoryPath?category_id='+id+'&showArray=1')
            .then(res=>{
                this.setState({
                    default_category:res.data
                })
            })
    }


    render() {
        return (
            <div>
                <Row>
                    <Col md={18}>
                        <div className={ArticleStyle.editPanel}>
                            <Input
                                value={this.state.article_title}
                                size="large" placeholder="文章标题"
                                style={{ marginBottom: '1rem' }}
                                onChange={this.handleTitleChange}
                            />
                            <Editor
                                // getMdeInstance={this.getInsance} // <-- set callback prop
                                value={this.state.content_body}
                                onChange={this.handleContentChange}
                                // onSave={()=>{this.pulishArticle(0)}}
                            >
                            </Editor>
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className={ArticleStyle.infoPanel}>
                            <ArticleInfoSettingPanel
                                passValue={this.state.article_access_pass}
                                tagsValue={this.state.Tags}
                                coverValue={this.state.article_cover}
                                topValue={this.state.article_is_top}
                                categoryValue = {this.state.default_category}
                                handleCoverChange={this.handleCoverChange}
                                handleCategoryChange={this.handleCategoryChange}
                                handleAcessPassChange={this.handleAcessPassChange}
                                handleTagsChange={this.handleTagsChange}
                                handleTopChange={this.handleTopChange}
                                pulishArticle={this.pulishArticle}
                                updateMode={this.updateMode}
                                changeMode={this.props.changeMode}
                            ></ArticleInfoSettingPanel>
                        </div>
                    </Col>

                </Row>

            </div>
        )
    }
}



class ArticleInfoSettingPanel extends React.Component {

    constructor(props) {
        super(props)
        this.onCategoryChange = this.onCategoryChange.bind(this);
        this.onAcessPassChange = this.onAcessPassChange.bind(this);
        this.onTagChange = this.onTagChange.bind(this);
        this.onCoverChange = this.onCoverChange.bind(this);
        this.onIsTopChange = this.onIsTopChange.bind(this);
        this.pulishArticle = this.pulishArticle.bind(this);
        this.saveAticle = this.saveAticle.bind(this);
    }

    onCategoryChange(value) {
        if (value == undefined)
            value = 0;
        this.props.handleCategoryChange(value);
    }

    onAcessPassChange(value) {
        this.props.handleAcessPassChange(value);
    }

    onTagChange(value) {
        this.props.handleTagsChange(value)
    }

    onCoverChange(e) {
        this.props.handleCoverChange(e.target.value)
    }

    onIsTopChange(e) {
        let value;
        value = e.target.checked ? 1 : 0;
        this.props.handleTopChange(value);
    }

    pulishArticle() {
        this.props.pulishArticle(1)
    }

    saveAticle() {
        this.props.pulishArticle(0)
    }

    render() {
        let s1 = '发布'
        let exitButton = '';
        if (this.props.updateMode) {
            s1 = '更新文章';
            exitButton = <Button style={{ margin: '0.2rem' }} type="danger" onClick={() => {
                this.props.changeMode(false);
            }}>退出编辑</Button>
        }
        return (
            <div className={ArticleStyle.articleInfoSettingPanel}>
                <CategoryChosePanel
                    categoryValue={this.props.categoryValue}
                    onCategoryChange={this.onCategoryChange} />
                <AcessPassPanel
                    passValue={this.props.passValue}
                    onAcessPassChange={this.onAcessPassChange}
                />
                <TagsSettingPanel
                    onTagChange={this.onTagChange}
                    tagsValue={this.props.tagsValue}
                />
                <div className={ArticleStyle.articleInfoPanelItem}>
                    <p><b>文章封面</b></p>
                    <Input value={this.props.coverValue} placeholder='封面地址' onChange={this.onCoverChange}></Input>
                </div>
                <div className={ArticleStyle.articleInfoPanelItem}>
                    <Checkbox checked={this.props.topValue} onChange={this.onIsTopChange}>文章置顶</Checkbox>
                </div>
                <div className={ArticleStyle.articleInfoPanelItem}>
                    <br></br>
                    <Button style={{ margin: '0.2rem' }} onClick={this.saveAticle}>存为草稿</Button>
                    <Button style={{ margin: '0.2rem' }} type="primary" onClick={this.pulishArticle}>{s1}</Button>
                    {exitButton}
                </div>
            </div>
        )
    }
}

/**
 * 标签设置
 */
class TagsSettingPanel extends React.Component {

    constructor(props) {
        super(props)
        this.onChange = this.onChange.bind(this);
    }


    onChange(value) {
        this.props.onTagChange(value);
    }

    render() {
        return (
            <div className={ArticleStyle.articleInfoPanelItem}>
                <p><b>标签</b></p>
                <Select
                    value={this.props.tagsValue}

                    mode="tags" style={{ width: '100%' }} placeholder="输入标签(回车确定)" onChange={this.onChange}>

                </Select>
            </div>
        )
    }
}

/**
 * 文章密码框
 */
class AcessPassPanel extends React.Component {

    constructor(props) {
        super(props);
        this.onAcessPassChange = this.onAcessPassChange.bind(this);
    }

    onAcessPassChange(e) {

        this.props.onAcessPassChange(e.target.value)
    }

    render() {
        return (
            <div className={ArticleStyle.articleInfoPanelItem}>
                <p><b>访问密码</b>(留空则不需要访问密码)</p>
                <Input
                    maxLength={32}
                    value={this.props.passValue}
                    onChange={this.onAcessPassChange}
                    placeholder="输入访问密码"
                />
            </div>
        )
    }
}

/**
 * 分类选择框
 */
class CategoryChosePanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categorys: new Array()
        }
        this.onChange = this.onChange.bind(this);

    }

    componentWillMount() {

        axios.get(host + '/admin/api/manager/category/getCategoryOptions').then((res) => {
            this.setState({
                categorys: res.data
            })
        });
    }




    onChange(value) {
        this.props.onCategoryChange(value);
    }
    render() {

        return (
            <div className={ArticleStyle.articleInfoPanelItem}>
                <p><b>分类</b></p>
                <Cascader
                    placeholder='选择文章分类'
                    value={this.props.categoryValue}
                    options={this.state.categorys}
                    onChange={this.onChange}
                    changeOnSelect
                />

            </div>
        )
    }
}






export { EditPanel }
