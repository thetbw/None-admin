import {Input,Button,Icon,Tooltip } from 'antd'
import React from 'react';


class EditableLabel extends React.Component {
    constructor(props) {
        super(props)
        this.isChange=false
        this.state = {
            editing: false,
            text:props.text?props.text:'null'
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            text:nextProps.text?nextProps.text:'null'
        })
    }

    handleLabelClick=()=>{
        this.setState({
            editing:!this.state.editing
        })
    }

    handleChange=(e)=>{
        this.isChange=true;
        this.setState({
            text:e.target.value
        })
    }

    handleInputComplete=()=>{
        if (this.isChange) {
            this.props.onInputComplete && this.props.onInputComplete(this.state.text)
        }
        this.setState({
            editing:false
        })
    }

    render() {
        const {text,editing} = this.state;
        let label =(editing
            ? (<Input value={text}  onChange={this.handleChange} onBlur={this.handleInputComplete} onPressEnter={this.handleInputComplete} size={'small'} maxLength={32} style={{maxWidth:'200px'}} />)
            : (<Button  onClick={this.handleLabelClick} size={'small'} >{text}</Button>));
        return (
            <span>
                {label}
            </span>
        )
    }
}

class SettingItem  extends React.Component{

    render() {
        const {label,tip,inline} = this.props
        const tipItem = tip?<Tooltip title={tip}><Icon type="question-circle" theme="filled" style={{fontSize:'12px'}} /></Tooltip>:null
        return (inline?
                    (<tr><td><b style={{marginRight:'1rem'}}>{label} {tipItem}</b>  </td><td> {this.props.children} </td></tr>):
                    (<div style={{marginTop:'0.3rem',marginBottom:'0.5rem'}}><p><b>{label}</b> {tipItem}</p> {this.props.children}</div>))




    }
}

export { EditableLabel,SettingItem}
