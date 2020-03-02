import { Card, Progress, Row, Col } from 'antd';
const axios = require('axios').default;
import host from '../host'


export default () => {
  return (
    <div>
      <BlogInfoPanel></BlogInfoPanel>
      <Row>
        <Col md={8} style={{ padding: '1rem' }}><NearArtcile></NearArtcile></Col>
        <Col md={8} style={{ padding: '1rem' }}><NearComment></NearComment></Col>
        <Col md={8} style={{ padding: '1rem' }}><OfficialMassage></OfficialMassage></Col>
      </Row>
    </div>
  );
}

/**
 * 
 */
class BlogInfoPanel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      article_count: '0',
      comment_count: '0',
      browsed_count: '0'
    }
  }
  componentWillMount() {
    this.update();
  }

  update=()=> {
    axios.get(host+'/admin/api/overview/getGeneralInfo').then((res) => {
        console.log(res)
        this.setState(res.data);
    });
  }

  render() {

    return (
      <div>
        <h1>网站概要:</h1>
        
        <Row>
          <Col md={4} sm={8}><Card title='文章' style={{ margin: '0.5rem' }}><span style={{ fontSize: '3rem' }}>
            {this.state.article_count}
          </span></Card></Col>
          <Col md={4} sm={8}><Card title='评论' style={{ margin: '0.5rem' }}><span style={{ fontSize: '3rem' }}>
            {this.state.comment_count}
          </span></Card></Col>
          <Col md={4} sm={8}><Card title='浏览量' style={{ margin: '0.5rem' }}><span style={{ fontSize: '3rem' }}>
            {this.state.browsed_count}
          </span></Card></Col>
        </Row>
      </div>
    );

  }
}



class NearArtcile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      articles: null
    }
  }

  componentWillMount() {
    axios.get(host+'/admin/api/overview/getNearArticles').then((res) => {
      this.setState({
        articles: res.data.pageItems
      })
    })
  }

  render() {
    const articles=this.state.articles;
    if (articles != null&&articles.length!=0) {
      const articleList = new Array();
      articles.map((article,index) => {
          articleList.push( <li key={index}><a href={host+"/article/"+article.article_id} target='_blank'>{article.article_title}</a></li>);
      });
      return (
        <div>
          <h1>最近文章</h1>
          <ul>
            {articleList}
          </ul>
        </div>
      )
    } else {
      return (
        <div>
          <h1>最近文章</h1>
          还没有文章
        </div>
      )
    }
  }
}


class NearComment extends React.Component {

  constructor(props){
      super(props);
      this.state={
          data:[]
      }
  }


  componentWillMount(){
      axios.get(host+'/admin/api/overview/getNearComments').then((res)=>{
        this.setState({
          data:res.data
        });
      });
  }


  render() {
    const commentList = new Array();
    const comments = this.state.data.pageItems;
    if(comments==null|| comments.length==0){
      return (
        <div>
          <h1>最近评论</h1>
          <span style={{marginRight:'2rem'}}></span>还没有评论
        </div>
      )
    }
    comments.map((comment,index)=>{
      commentList.push(<li key={index}><a href="#">{comment.comment_body}</a></li>)
    })

    return (
      <div style={{overflow:'hidden'}}>
        <h1>最近评论</h1>
        <ul>
          {commentList}
        </ul>
      </div>
    )
  }
}

class OfficialMassage extends React.Component {

  render() {
    return (
      <div>
        <h1>官方日志</h1>
        
      </div>
    )
  }
}
