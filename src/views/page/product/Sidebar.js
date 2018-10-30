import React, {Component} from 'react';
import { Layout, Menu, Slider, Switch,Icon,Row,Col } from 'antd';
import QuickBook from 'views/page/home/QuickBook';
const {  Sider,  } = Layout;
class SidebarContent extends Component{
    constructor(props){
        super(props)
        this.state={
            priceStart:0,
            priceEnd:1000000,
        }
    }
    filterPrice=(val)=>{
        this.setState({priceStart:val[0]*1000,priceEnd:val[1]*1000})
    }
    render(){
        const rowstyle={
            display:'flex',
            flexDirection:'column',
            justifyContent:'center',
            alignItems:'center',
        }
        return (
            <Sider
              trigger={null}
              collapsible
              collapsed={this.props.collapsed}
            >
                <Row style={rowstyle}>
                    <Col span={18}>
                        <QuickBook/>
                    </Col>
                    <Col span={18}>
                        <Slider onChange={this.filterPrice} range defaultValue={[this.state.priceStart, this.state.priceEnd]} disabled={false} />
                        <span>Tầm giá từ {this.state.priceStart} đến {this.state.priceEnd}</span>
                    </Col>
                </Row>
            </Sider>
        )
    }
}
export default SidebarContent;