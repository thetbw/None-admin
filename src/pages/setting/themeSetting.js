import {Typography, Tabs, Button, Icon, Input, message} from 'antd';
import * as React from "react";

const {Title, Text} = Typography;


import QueueAnim from 'rc-queue-anim';

const axios = require('axios').default;
import host from '../../host'


export default class ThemeSettingPanel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            themes: new Array()
        }
    }

    componentWillMount() {
        this.loadData()
    }

    loadData = () => {
        axios.get(host + '/admin/api/setting/theme/getThemes')
            .then(res => {
                this.setState({
                    themes: res.data
                })
            })
    }

    handleThemeChange = (themeName) => {
        let form = new FormData();
        form.append('theme_name', themeName)
        axios.post(host + '/admin/api/setting/theme/setTheme', form)
            .then(res => {
                message.info('切换成功');
                this.loadData();
            }).catch(error => {
            message.error("主题切换失败");
        })
    }

    render() {
        const themeList = this.state.themes.map((value, index) => {
            return (<ThemePanel
                key={value.themeName}
                name={value.themeName}
                version={value.themeVersion}
                author={value.themeAuthor}
                authorLink={value.themeAuthorLink}
                description={value.themeDescription}
                themeLink={value.themeLink}
                filePath={value.themeFilePath}
                themePreviewImagePath={value.themePreviewImagePath}
                idEnabled={value.idEnabled}
                onThemeChange={this.handleThemeChange}
            />)
        })
        return (
            <div>
                <Title level={4}>主题设置</Title>
                <div style={{marginTop: '1rem', padding: '0.5rem'}}>
                    {themeList}
                </div>
            </div>
        )
    }

}


class ThemePanel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showInfo: false
        }

    }


    render() {
        const button = this.props.idEnabled ?
            (<Button type='primary' size={'small'}
                     style={{position: "absolute", right: '2px', display: 'inline-flex'}} onClick={() => {
                message.info('当前就是这个主题啦');
            }}>正在使用</Button>) :
            (<Button size={'small'} style={{position: "absolute", right: '2px', display: 'inline-flex'}}
                     onClick={() => {
                         this.props.onThemeChange(this.props.filePath)
                     }
                     }>设为主题</Button>);

        const info = this.state.showInfo ?
            (<div key='info' style={{
                position: "absolute",
                top: '0px',
                left: '0px',
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(255,255,255,0.95)'
            }}>
                <Button size='small' style={{position: "absolute", top: '2px', right: '2px'}} onClick={() => {
                    this.setState({showInfo: false})
                }}><Icon type='caret-down'/></Button>
                <div style={{cursor: 'pointer', height: '100%', overflow: 'auto'}} onClick={() => {
                    this.setState({showInfo: false})
                }}>
                    <Title level={4} style={{marginBottom: '0.1em'}}> <a
                        href={this.props.themeLink}>{this.props.name}</a>:</Title>
                    <p style={{marginBottom: '0em', textIndent: '0.5rem'}}><b>version:</b>{this.props.version} </p>
                    <p style={{marginBottom: '0em', textIndent: '0.5rem'}}><b>author:</b><a
                        href={this.props.authorLink}>{this.props.author}</a></p>
                    <p style={{marginBottom: '0em', textIndent: '0.5rem'}}><b>description:</b></p>
                    <p style={{
                        textIndent: '1rem',
                        wordBreak: "break-word",
                        width: '100%'
                    }}> {this.props.description}</p>
                </div>

            </div>) : null;
        return (
            <div style={{
                width: '250px',
                height: '180px',
                display: 'inline-block',
                backgroundColor: 'rgba(0,0,0,0.09)',
                margin: '0.3rem',
                boxShadow: '2px 2px 5px 2px ',
                position: "relative"
            }}>
                <div style={{display: 'flex', alignItems: "center", justifyItems: "center", height: '30px'}}>
                    <Text strong style={{marginLeft: '0.3rem'}}>{this.props.name}</Text>
                    {button}
                </div>
                <div style={{
                    width: '250px',
                    height: '150px',
                    backgroundColor: '#00ff00',
                    cursor: 'pointer',
                    position: "absolute",
                    bottom: '0px'
                }}
                     onClick={() => {
                         this.setState({showInfo: true})
                     }}>
                    <img style={{height: '100%', width: '100%'}} src={this.props.themePreviewImagePath}/>
                </div>
                <QueueAnim type={['bottom', 'bottom']}>
                    {info}
                </QueueAnim>


            </div>
        )
    }
}