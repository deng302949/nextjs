import { useObserver } from "mobx-react-lite";
import { Form, Input, Button, Row, Col } from "antd";
const FormItem = Form.Item;

export default Form.create({})(props =>
  useObserver(() => {
    const form = props.form;

    return (
      <Form>
        <Row>
          <Col span={8}>
            <FormItem
              required={true}
              label="账户号 accountCode"
              {...{
                labelCol: { span: 8 },
                wrapperCol: { span: 16 }
              }}
            >
              {form.getFieldDecorator('accountCode')(<Input />)}
            </FormItem>
          </Col>
          <Col span={14} style={{ marginLeft: '20px' }}>
            <Button type="primary" htmlType="submit">
              Search
            </Button>
            <Button style={{ marginLeft: 8 }}>
              Clear
            </Button>
          </Col>
        </Row>
      </Form>
    );
  })
);
