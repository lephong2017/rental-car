import React ,{Component} from 'react';
import { Layout ,Row,Col } from 'antd';
import SidebarContent from 'views/page/detail/sidebar/Sidebar';
import HeaderContent from 'views/layout/Header';
import FooterContent from 'views/layout/Footer';
// import FunctionFilter from 'containers/filterbar/FunctionFilter';
import StepContent from 'containers/step/Step';
import InfoCarContent from './content';
// import PaginationContent from 'components/pagination/Pagination'
import 'containers/filterbar/function.css';
import './css/sidebar.css';
import './css/index.css';
const { Header, Content,Footer } = Layout;
class ContentApp extends Component{
    state={
        collapsed: false, 
    }
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }
      render() {
        return (
            <Layout>
                <Header className="header_content">
                    <HeaderContent/>
                </Header>
                <Content>
                    <div className="step_content">
                        <StepContent step={2}/>
                    </div>
                    <Layout>
                        <Row className="resposive_content_detail_car" gutter={8} >
                            <Col md={18}>
                                <Row style={{display:'flex',flexDirection:'column'}}>
                                    <Col md={24}>
                                        <Content style={{ padding: '12px 0', background: '#fff' }}>
                                            <Row>
                                                <Col md={24} sm={24}>
                                                    <InfoCarContent/>
                                                </Col>
                                            </Row>
                                        </Content>
                                    </Col>
                                </Row>
                            </Col>
                            <Col md={6} className="sidebar_content" >
                                 <SidebarContent  />
                            </Col>
                        </Row>

                    </Layout>
                </Content>
                <Footer>
                    <FooterContent/>
                </Footer>
            </Layout>
          
        );
    }
}
export default ContentApp;