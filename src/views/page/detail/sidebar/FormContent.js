import { Form, Input,DatePicker , Select, Row, Col, Button,  } from 'antd';
import React,{Component} from 'react';
import moment from 'moment';
import {Link} from 'react-router-dom';
import '../css/form.css';

import PaypalBtn from 'react-paypal-checkout';
const FormItem = Form.Item;
const Option = Select.Option;

const range=(start, end)=> {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
}

class BookCar extends Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    dateRental:null,
    dateReturn:null,
    numDayRental:0,
    err:'Số ngày mượn phải lớn hơn 1 ngày',
    city:null,

  };

  componentWillMount(){
    this.setState({
      dateRental:this.props.dateRental,
      dateReturn:this.props.dateReturn,
      city: this.props.city
    });
    this.getDateRental(new Date(this.props.dateReturn), new Date(this.props.dateRental));
  }

  onChangeDateRental=(value, dateString)=> {
    // console.log('Selected Time: ', value);
    // console.log('Formatted Selected Time: ', dateString);
    this.setState({dateRental: dateString});
  }

  getDateRental=(dateEnd, dateStart)=>{
    let error='';
    let yearStart = dateStart.getFullYear();
    let yearEnd = dateEnd.getFullYear();
    let year= yearEnd- yearStart;
    let monthEnd = (year*12 )+ dateEnd.getMonth();
    let monthStart = dateStart.getMonth();
    let month = monthEnd- monthStart;
    if(month>1){
      error ='Số ngày mượn phải nhỏ hơn 1 tháng';
      this.setState({numDayRental: day, err: error });
      return  error;
    } 
    
    let arr = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let dayEnd = ((month) * arr[monthStart]) + dateEnd.getDate();
    let dayStart = dateStart.getDate();
    let day= dayEnd- dayStart;
    if(day>1){
      this.setState({numDayRental: day, err: 'OK' });
    }else{
      this.setState({err:'Phải mượn xe lớn hơn 1 ngày'});
    }
    return error;
  }
  
  onChangeDateReturn=(value, dateString)=> {
    // console.log('Selected Time: ', value);
    // console.log('Formatted Selected Time: ', dateString);
    const numDayRental = new Date(dateString).getDate() - new Date(this.state.dateRental).getDate();
    this.setState({dateReturn: dateString, numDayRental: numDayRental });
    this.getDateRental(new Date(dateString), new Date(this.state.dateRental));

  }
  
  onOk=(value)=> {
    // console.log('onOk: ', value);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }
  
  disabledDate=(current) =>{
    return current && current < moment().endOf('day');
  }
  
   disabledDateTime=() =>{
    return {
      disabledHours: () => range(0, 24).splice(4, 20),
      disabledMinutes: () => range(30, 60),
      disabledSeconds: () => [55, 56],
    };
  }
  
   disabledRangeTime=(_, type)=> {
    if (type === 'start') {
      return {
        disabledHours: () => range(0, 60).splice(4, 20),
        disabledMinutes: () => range(30, 60),
        disabledSeconds: () => [55, 56],
      };
    }
    return {
      disabledHours: () => range(0, 60).splice(20, 4),
      disabledMinutes: () => range(0, 31),
      disabledSeconds: () => [55, 56],
    };
  }

  render() {
    // const { getFieldDecorator } = this.props.form;
    const onSuccess = (payment) => {
			console.log("The payment was succeeded!", payment);
		}		

		const onCancel = (data) => {
			console.log('The payment was cancelled!', data);
		}	

		const onError = (err) => {
			console.log("Error!", err);		
		}			

		let env = 'sandbox'; // you can set here to 'production' for production
		let currency = 'USD'; // or you can set this value from your props or state  
		let total = this.state.numDayRental* this.props.itemCar.price;  // same as above, this is the total amount (based on currency) to be 
		let locale = 'en_US'; 
		let style = {
			'label':'pay', 
			'tagline': false, 
			'size':'medium', 
			'shape':'pill', 
			'color':'gold'
		};

		const client = {
      sandbox:    'AY1jSZZWe9ubj79SyF4ixwYn32ExUwpeBwUBGiqjcTF3vCdQN3VPOZ7l4GF7SsBYifOWxo4x0RlceB11',
      production: 'EPOgRKs0mDvWhvRXnGFsAcqp3ny-hYeYoSPQPxIYKvc1kGKqgCpV0xI2c7bs0qU8okWyyqbl7ajjH43z',
		}
    const { formLayout } = this.state;
    const formItemLayout = formLayout === 'horizontal' ? {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
      } : null;
    const rowStyleOrder={
        display:'flex',
        flexDirection:'row',
        // alignItems:'left',
        justifyContent:'space-between'
    }
    const {dateReturn, dateRental, city} = this.state;
    const {itemCar} = this.props;
    return (
      <Row className="form_content">
          <Col md={24} >
            <Form layout={null} onSubmit={this.handleSubmit}>
                <FormItem
                    {...formItemLayout}
                    label="Hình thức nhận xe"
                    >
                    <Select
                        // value={state.currency}
                        // size={size}
                        defaultValue="AT_PRODUCER"
                        style={{ width: '100%' }}
                        // onChange={this.handleCurrencyChange}
                        >
                            <Option value="AT_HOME">Nhận xe tại nhà</Option>
                            <Option value="AT_PRODUCER">Nhận xe tại đại lý</Option>
                    </Select>
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Chọn ngày thuê "
                    >
                      <DatePicker
                        // showTime
                        format="YYYY-MM-DD"
                        placeholder="Select Time"
                        disabledDate={this.disabledDate}
                        disabledTime={this.disabledRangeTime}
                        onChange={this.onChangeDateRental}
                        // onOk={this.onOk}
                        style={{width:'100%'}}
                        defaultValue={moment(dateRental, 'YYYY-MM-DD')}
                        />
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Chọn ngày trả"
                    >
                      <DatePicker
                        // showTime
                        format="YYYY-MM-DD"
                        placeholder="Select Time"
                        disabledDate={this.disabledDate}
                        disabledTime={this.disabledRangeTime}
                        onChange={this.onChangeDateReturn}
                        // onOk={this.onOk}
                        defaultValue={moment(dateReturn, 'YYYY-MM-DD')}
                        style={{width:'100%'}}
                        />
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Mã giảm giá: "
                    >
                      <Input style={{width:'100%'}} placeholder="Nhập mã giảm giá" />
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Giới hạn quảng đường: "
                    >
                      <p className="text">Tối đa 250km/ngày, phụ trội 3.000 đ/km</p>
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Chi tiết giá: "
                    >
                      <Row style={rowStyleOrder} className="row-info-order">
                          <Col span={12} ><span>Đơn giá ngày</span></Col>
                          <Col span={12} ><span className="span-info-order">{itemCar.price}</span></Col>
                      </Row>
                      <Row style={rowStyleOrder} className="row-info-order">
                          <Col span={12}><span>Ngày</span></Col>
                          <Col span={12}><span className="span-info-order">{this.state.numDayRental} Ngày</span></Col>
                      </Row>
                      <hr/>
                      <Row style={rowStyleOrder} className="row-info-order">
                          <Col span={12}><span>TỔNG</span></Col>
                          <Col span={12}><span className="span-info-order">{this.state.numDayRental* itemCar.price}</span></Col>
                      </Row>

                </FormItem>
                <FormItem style={{float:'right',width:'100%'}}>
                    <Row >
                {
                  (this.state.err==='OK')?
                    <Col md={24}>
                     <PaypalBtn 
                        env={env} 
                        client={client} 
                        currency={currency} 
                        total={total} 
                        locale={locale} 
                        style={style}
                        onError={onError} 
                        onSuccess={onSuccess} 
                        onCancel={onCancel}
                      />
                      <Link to="/final">
                        <Button style={{width:'100%'}} type="primary" htmlType="submit">Hoàn tất</Button>
                      </Link>
                    </Col>:
                    <Col><span style={{color: 'red'}}>{this.state.err}</span></Col>


                }
                       
                  </Row>
                </FormItem>
            </Form>
          </Col>
      </Row>
    );
  }
}

const QuickBook = Form.create()(BookCar );
export default QuickBook;