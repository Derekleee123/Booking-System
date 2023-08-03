import React, { useState } from "react";
import { Select, Form, InputNumber, message } from "antd";
import "./booking.css";

const getOptions = (total) => {
  let result = [];
  for (let i = 0; i <= total; i++) {
    result.push({
      value: i,
      label: i.toString(),
    });
  }
  return result;
};

function Booking() {
  const optionMaximum = 20;
  const optionContent = getOptions(optionMaximum);
  const [optionListNumber, setOptionListNumber] = useState(1);
  const [ageStart, setAgeStart] = useState("");
  const [ageEnd, setAgeEnd] = useState("");
  const [inputForm] = Form.useForm();
  const [optionForm] = Form.useForm();

  const addOptions = (e) => {
    e.preventDefault();
    setOptionListNumber((priceSetNumber) => priceSetNumber + 1);
  };

  const removeOptions = (e) => {
    e.preventDefault();
    setOptionListNumber((priceSetNumber) => priceSetNumber - 1);
  };

  const getListByCount = (optionContent, count, removeOptions) => {
    let optionListNumber = [];
    for (let i = 0; i < count; i++) {
      optionListNumber.push(i);
    }

    const checkAge = (_, value) => {
      //   optionForm.validateFields([option]);
      //   const age = optionForm.getFieldValue(option);
      

      console.log(ageStart);
      if (ageStart < 15) {
        return Promise.resolve();
      } else {
        return Promise.reject("錯誤");
      }
    };

    const checkPrice = (input) => {
      inputForm.validateFields([input]);
    };

    const result = optionListNumber.map((value) => {
      return (
        <div key={value}>
          <div className="flex-between">
            <div className="option-title">價格設定 - {value + 1}</div>
            {value !== 0 && (
              <a
                href=""
                className="remove-setting flex-between"
                onClick={removeOptions}
              >
                <span className="material-symbols-outlined">close</span> 移除
              </a>
            )}
          </div>

          <div className="flex-between">
            <div className="option-border">
              <div>年齡</div>
              <Form form={optionForm}>
                <div className="option-area">
                  <Form.Item
                    name={`age_option_start_${value}`}
                    rules={[
                      {
                        validator: checkAge,
                      },
                    ]}
                  >
                    <Select
                      size="large"
                      style={{ width: 150 }}
                      options={optionContent}
                      onChange={() =>
                        setAgeStart(
                          optionForm.getFieldValue(`age_option_start_${value}`)
                        )
                      }
                    />
                  </Form.Item>
                  <div className="between-text flex-center">～</div>
                  <Form.Item
                    name={`age_option_end_${value}`}
                    rules={[
                      {
                        validator: checkAge,
                      },
                    ]}
                  >
                    <Select
                      size="large"
                      style={{ width: 150 }}
                      options={optionContent}
                      onChange={() =>
                        setAgeStart(
                          optionForm.getFieldValue(`age_option_end_${value}`)
                        )
                      }
                    />
                  </Form.Item>
                </div>
              </Form>
            </div>

            <div className="option-border">
              <div>入住費用(每人每晚)</div>
              <div className="flex-between option-area">
                <Form form={inputForm}>
                  <Form.Item
                    name={`number_input_${value}`}
                    rules={[
                      {
                        required: true,
                        message: "不可以為空白",
                      },
                    ]}
                  >
                    <InputNumber
                      size="large"
                      addonBefore="TWD"
                      style={{ width: 350 }}
                      onBlur={() => checkPrice(`number_input_${value}`)}
                      formatter={(value) =>
                        value.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                    />
                  </Form.Item>
                </Form>
              </div>

              <div className="text-right">輸入0表示免費</div>
            </div>
          </div>
          <hr />
        </div>
      );
    });

    return result;
  };

  return (
    <div className="frame">
      <a href="" className="add-setting flex-between" onClick={addOptions}>
        <span className="material-symbols-outlined">add</span> 新增價格設定
      </a>
      {getListByCount(optionContent, optionListNumber, removeOptions)}
    </div>
  );
}

export default Booking;
