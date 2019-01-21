import React,{Component} from 'react';
import {Row, Col, Button, Icon, Popover, Avatar, Select, notification,   } from 'antd';
import './index.css';
import FunctionbarContent from './function/index';
import PanelWrapper from 'containers/wrapper/Panel.style';
import TableContent from 'components/ptp__table/index';
// import TableContent from 'components/table/MyTable';
import * as Role_User from 'settings/role';
// import {demoData} from './list-Partner-dumy';
import DrawerContent from 'components/Drawer/Drawer';
import FormPartner from './action/add/FormPartner'; 
import FormEditPartner from './action/edit/edit'; 

import { withRouter, } from 'react-router-dom';
import { connect } from 'react-redux';
import {showNotification} from 'components/notification/Notification';
import {reqLoadDataPaging, reqSearchPartner, reqCountData, 
    reqFindPartner, reqDeletePartner, reqAddPartner, reqUpdatePartner} from 'redux/partner/actions';
import * as CONST_VARIABLE from 'utils/const/index';

class PartnerManagement extends Component{
    state={
        pageSize:5,
        pageIndex:1,
        fullScreenMode:false,
        
        visibledAdd:false,
        visibledEdit:false,

        filteredInfo: null,
        sortedInfo: null, 
        selectedRowKeys: [],
        pagination:null,
        recordSelected:null,
        data:[],
        idEdit:null
    }

    handleFullScreenMode=(val)=> {
        this.setState(() => {
            return {
                fullScreenMode: val
            };
        });
    }
        
    showDrawerAdd=()=>{ this.setState({visibledAdd:true}) }
    onCloseAdd = () => { this.setState({ visibledAdd: false, }) };

    showDrawerEdit=(id)=>{ 
        const accesstoken = sessionStorage.getItem(CONST_VARIABLE.ACCESS_TOKEN);
        this.props.handleFindPartner(id, accesstoken);
        this.setState({visibledEdit:true, idEdit: id});
     }
    onCloseEdit = () => { this.setState({ visibledEdit: false, }) };


    onSelectChange = (selectedRowKeys) => {
        //console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }

    handleChange = (pagination, filters, sorter) => {
        this.setState({
            filteredInfo: filters,
            sortedInfo: sorter,
            pagination: pagination
        });

    }

    onRowSelect = (record) => {
        this.setState({recordSelected:record});
    }

    clearFilters = (attr, name) => {
        const filteredInfo = this.state.filteredInfo;
        let arrayVal = filteredInfo[attr.val];
        let ind = arrayVal.indexOf(name);
        arrayVal.splice(ind, 1);
        let attrFilter ={
            [attr.val]: arrayVal
        }
        const obj= {...filteredInfo, ...attrFilter};
        this.setState({ filteredInfo: obj });
    }

    clearSorted = () => {
        this.setState({ sortedInfo: null, });
    }
    handleChangeSelectInRow =(value) => {
        //console.log("change value in rrow: ");
        //console.log(value, this.state.recordSelected);
    }
    
    handleOnSearch= (val) =>{
        //console.log(this.state.pagination);
        var accesstoken = sessionStorage.getItem(CONST_VARIABLE.ACCESS_TOKEN);
        // console.log(val);
        if(val!==''){
            // this.props.countAllPartner(accesstoken);    
            this.props.handleSearchPartner(val, this.state.pageIndex, this.state.pageSize, accesstoken);
       
        }else{
            const {pageIndex, pageSize}= this.state;
            this.props.loadDataPaging(pageIndex, pageSize,  accesstoken);
            this.props.countAllPartner(accesstoken);    

        }
    }


    componentWillMount(){
        var accesstoken = sessionStorage.getItem(CONST_VARIABLE.ACCESS_TOKEN);
        const {pageIndex, pageSize}= this.state;
        this.props.loadDataPaging(pageIndex, pageSize,  accesstoken);
        this.props.countAllPartner(accesstoken);
    }

    componentDidMount(){
        var accesstoken = sessionStorage.getItem(CONST_VARIABLE.ACCESS_TOKEN);
        const {pageIndex, pageSize}= this.state;
        this.props.loadDataPaging(pageIndex, pageSize,  accesstoken);
        this.props.countAllPartner(accesstoken);
    }

    handleSubmit=(obj)=>{
        var accesstoken = sessionStorage.getItem(CONST_VARIABLE.ACCESS_TOKEN);
        this.props.handleAddPartner(obj, accesstoken);
        this.onCloseAdd();
        showNotification("Thêm thành công", "Bạn vừa thực hiện thêm một partner!!!", "topRight", "success");
    }

    handleDelete=(id)=>{
        var accesstoken = sessionStorage.getItem(CONST_VARIABLE.ACCESS_TOKEN);
        this.props.handleDeletePartner(id, accesstoken);
        showNotification("Xóa thành công", "Bạn vừa thực hiện xóa một partner!!!", "topRight", "success");
    }

    handleSubmitEdit=(id, obj)=>{
        var accesstoken = sessionStorage.getItem(CONST_VARIABLE.ACCESS_TOKEN);
        this.props.handleUpdatePartner(id, obj, accesstoken);
        this.onCloseEdit();
        this.setState({id:null});
        showNotification("Sửa thành công", "Bạn vừa thực hiện cập nhật thông tin một partner!!!", "topRight", "success");
    }

    disableADD = () =>{
        const role = sessionStorage.getItem(CONST_VARIABLE.ROLE_ACCOUNT);
        var listRole = [];
        if(role === 'MANAGER') {
            listRole= Role_User.findRoleManager('PARTNER');
        }
        return listRole.includes(Role_User.ADD);
    }
    disableEdit = () =>{
        const role = sessionStorage.getItem(CONST_VARIABLE.ROLE_ACCOUNT);
        var listRole = [];
        if(role === 'MANAGER') {
            listRole= Role_User.findRoleManager('PARTNER');
        }
        return listRole.includes(Role_User.EDIT);
    }
    disableDelele = () =>{
        const role = sessionStorage.getItem(CONST_VARIABLE.ROLE_ACCOUNT);
        var listRole = [];
        if(role === 'MANAGER') {
            listRole= Role_User.findRoleManager('PARTNER');
        }
        return listRole.includes(Role_User.DELETE);
    }
   
    render(){
        const disableAdd = this.disableADD()?false:true;
        const disableDelete = this.disableDelele()?false:true;
        const disableEdit = this.disableEdit()?false:true;

        let { sortedInfo, filteredInfo } = this.state;
        sortedInfo = sortedInfo || {};
        filteredInfo = filteredInfo || {};
        const info = {
            sorted: sortedInfo,
            filtered: filteredInfo
        }

        const columns = [
            {
                title: 'Tên công ty',
                dataIndex: 'nameCompany',
                key: 'nameCompany',
                sorter: (a, b) => a.nameCompany.length - b.nameCompany.length,
                sortOrder: sortedInfo.columnKey === 'nameCompany' && sortedInfo.order,
            }, 
            {
                title: 'Email',
                dataIndex: 'email',
                key: 'email',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => a.email - b.email,
                sortOrder: sortedInfo.columnKey === 'email' && sortedInfo.order,
            }, 
            {
                title: 'Số điện thoại',
                dataIndex: 'phoneNumber',
                key: 'phoneNumber',
            }, 
            {
                title: 'Thanh toán',
                dataIndex: 'partnerPayment',
                key: 'partnerPayment',
            }, 
            {
                title: 'Action',
                align:'center',
                render:(text, record, index)=>{
                    return(
                        <div>
                            <Button 
                                disabled={disableEdit}
                                onClick={()=>this.showDrawerEdit(text)} 
                                className='btn btn-table' 
                                icon='edit'>
                            </Button>
                            <Button 
                                disabled={disableDelete} 
                                onClick={()=>this.handleDelete(text)} 
                                className='btn btn-table' 
                                icon='delete'>
                            </Button>
                        </div>
                    );
                },
                dataIndex: 'id',
                key:'id',
                width : 100
               
            },
       ];
        
        const config ={
            table:{
                // bordered: true
            },
            pagination:{
                defaultPageSize:5,
                total: this.props.numberPartner
            },
        }
        const event={
            table:{
                onChange:this.handleChange,
                clearSorted: this.clearSorted,
                clearFiltered: this.clearFilters,
                onRow: this.onRowSelect,
                onSearch: this.handleOnSearch
            },
            pagination:{
                onChange:
                    (page, pageSize)=>{
                        const accesstoken= sessionStorage.getItem(CONST_VARIABLE.ACCESS_TOKEN);
                        this.props.loadDataPaging(page, pageSize, accesstoken);
                    },
                onShowSizeChange:
                    (page, pageSize)=>{
                        const accesstoken= sessionStorage.getItem(CONST_VARIABLE.ACCESS_TOKEN);
                        this.props.loadDataPaging(page, pageSize, accesstoken);
                    }
            }
        }
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            hideDefaultSelections: true,
            selections: [{
                key: 'all-data',
                text: 'Select All Data',
                onSelect: () => {
                this.setState({
                    selectedRowKeys: [...Array(46).keys()], // 0...45
                });
                },
            }, {
                key: 'odd',
                text: 'Select Odd Row',
                onSelect: (changableRowKeys) => {
                let newSelectedRowKeys = [];
                newSelectedRowKeys = changableRowKeys.filter((key, index) => {
                    if (index % 2 !== 0) {
                    return false;
                    }
                    return true;
                });
                this.setState({ selectedRowKeys: newSelectedRowKeys });
                },
            }, {
                key: 'even',
                text: 'Select Even Row',
                onSelect: (changableRowKeys) => {
                let newSelectedRowKeys = [];
                newSelectedRowKeys = changableRowKeys.filter((key, index) => {
                    if (index % 2 !== 0) {
                    return true;
                    }
                    return false;
                });
                this.setState({ selectedRowKeys: newSelectedRowKeys });
                },
            }],
            // onSelection: this.onSelection,
        };


        var listPropForDrawer={
            styleProps:{
              title:"Nhập thông tin!",
              width:420,
              height:'100%',
              maskStyle:{
                  color:'red'
              },
              mask:true,
              maskClosable:true,
              style:{
                  backgroundColor:'#fafafa'
              },
              className:"ok",
              zIndex:1,
              placement:"right",
              closable:this.state.visibledAdd,
              destroyOnClose:false,
            },
            onClose:this.onCloseAdd,
            visible:this.state.visibledAdd,
            hasButtonFooter:false,
            componentWillShow:(key)=> <FormPartner
                    key={'FormPartner'}
                    onSubmitAdd={this.handleSubmit}
                />,
        }
        var listPropForDrawerEdit={
            styleProps:{
              title:"Nhập thông tin sửa đổi!",
              width:420,
              height:'100%',
              maskStyle:{
                  color:'red'
              },
              mask:true,
              maskClosable:true,
              style:{
                  backgroundColor:'#fafafa'
              },
              className:"ok",
              zIndex:1,
              placement:"right",
              closable:this.state.visibledEdit,
              destroyOnClose:false,
            },
            onClose:this.onCloseEdit,
            visible:this.state.visibledEdit,
            hasButtonFooter:false,
            componentWillShow:(key)=> <FormEditPartner 
                key={'FormEditPartner'}
                id={this.state.idEdit} 
                partner={this.props.itemPartner}
                onSubmitEdit={this.handleSubmitEdit}
            />,
        }
        return (
            <Row className="content_manager_wrapper" style={{height:'100%'}}>
                {
                (this.props.partner.length > 0)?
                <PanelWrapper className={this.state.fullScreenMode ? "full-screen-mode" : ""}>
                    <FunctionbarContent disabled={disableAdd} showDrawerAdd={this.showDrawerAdd} handleFullScreenMode={this.handleFullScreenMode}/>
                    <Col md={24} className="table-wrapper">
                        <TableContent
                            rowSelection={rowSelection}
                            data={this.props.partner} 
                            columns={columns} 
                            config={config} 
                            event={event}
                            info={info}
                        />
                    </Col>
                    <DrawerContent 
                        key={'addPartner'}
                        styleProps={listPropForDrawer.styleProps} 
                        visible={listPropForDrawer.visible} 
                        onClose={listPropForDrawer.onClose}
                        hasButtonFooter={listPropForDrawer.hasButtonFooter}    
                        componentWillShow={listPropForDrawer.componentWillShow}
                    />
                    <DrawerContent 
                        key={'editPartner'}
                        styleProps={listPropForDrawerEdit.styleProps} 
                        visible={listPropForDrawerEdit.visible} 
                        onClose={listPropForDrawerEdit.onClose}
                        hasButtonFooter={listPropForDrawerEdit.hasButtonFooter}    
                        componentWillShow={listPropForDrawerEdit.componentWillShow}
                    />
                </PanelWrapper>
                :
                <div style={{
                    color: 'red',
                    padding: '10px',
                    margin: '10px',
                    }}>
                    Tài khoản của bạn không đủ quyền truy cập vào trang này!!!
                </div>
                }

            </Row>
        );
    }
}
const mapStateToProps = state => {
    return {
        partner: state.partner,
        itemPartner: state.itemPartner,
        numberPartner: state.numberDataPartner
    }
}
const mapDispatchToProps = (dispatch, props) => {
    return {
        handleAddPartner: (object, accesstoken)=>{
            dispatch(reqAddPartner(object, accesstoken));
        },
        handleFindPartner: (id, accesstoken)=>{
            dispatch(reqFindPartner(id, accesstoken));
        },
        handleUpdatePartner: (id, object, accesstoken)=>{
            dispatch(reqUpdatePartner(id, object, accesstoken));
        },
        handleDeletePartner: (id, accesstoken)=>{
            dispatch(reqDeletePartner(id, accesstoken));
        },
        loadDataPaging: (pageIndex, pageSize, accesstoken)=>{
            dispatch(reqLoadDataPaging(pageIndex, pageSize, accesstoken));
        },
        countAllPartner: ( accesstoken)=>{
            dispatch(reqCountData( accesstoken));
        },
        handleSearchPartner: (keyword, pageIndex, pageSize, accesstoken)=>{
            dispatch(reqSearchPartner(keyword, pageIndex, pageSize, accesstoken))
        }

    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PartnerManagement));