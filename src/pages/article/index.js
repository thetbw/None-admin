import { FinishPanel } from './finishPage';
import {EditPanel} from './editPage'


export default class ArticlePanel extends React.Component {
 
    constructor(props){
        super(props);
        this.switch2edit=this.switch2edit.bind(this);
        this.switch2finsh =this.switch2finsh.bind(this);
        this.state={
            nowPage:<EditPanel switch2finsh={this.switch2finsh} ></EditPanel>
        }
        
    };

    switch2edit(){
        this.setState({
            nowPage:<EditPanel switch2finsh={this.switch2finsh}></EditPanel>
        })
    };

    switch2finsh(){
        this.setState({
            nowPage:<FinishPanel switch2edit={this.switch2edit}></FinishPanel>
        })
    };

    render() {
        return (
            <div>
                {this.state.nowPage}
            </div>
        )
    }
}