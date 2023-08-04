import React, { useEffect, useState } from "react";
import { Select, Form, InputNumber } from "antd";
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
  const [listNumber, setListNumber] = useState(1);
  const [listContent, setListContent] = useState([]);
  const [optionContent, setOptionContent] = useState(getOptions(optionMaximum));
  const [ageStart, setAgeStart] = useState([]);
  const [ageEnd, setAgeEnd] = useState([]);
  const [removeIndex, setRemoveIndex] = useState("");
  const [inputForm] = Form.useForm();
  const [optionForm] = Form.useForm();

  useEffect(() => {
    if (removeIndex) {
      const filterList = listContent.filter((v) => {
        return v.index !== removeIndex;
      });
      setListContent(filterList);
    } else {
      console.log(ageStart);
      let option = JSON.parse(JSON.stringify(listContent));
      for (let i = 0; i < listNumber; i++) {
        option[i] = {
          index: i,
          ageStart: ageStart[i] ?? "",
          ageEnd: ageEnd[i] ?? "",
          price: inputForm.getFieldValue([`number_input_${i}`]) ?? "",
        };
      }

      setListContent(option);
    }
  }, [listNumber, optionContent, removeIndex]);

  // 新增或移除表單時, 需重設選單的年齡
  useEffect(() => {
    for (let i = 0; i < listContent.length; i++) {
      optionForm.setFieldValue({
        [`age_option_start_${i}`]: listContent[i].ageStart,
        [`age_option_end_${i}`]: listContent[i].ageEnd,
      });
    }
  }, [listContent]);

  // 處理disabled的選項
  useEffect(() => {
    let option = JSON.parse(JSON.stringify(optionContent));
    const isUsedArray = ageStart.concat(ageEnd);

    for (const element of isUsedArray) {
      if (element) {
        option[element].disabled = true;
      }
    }
    setOptionContent(option);
  }, [ageStart, ageEnd]);

  const addOptions = (e) => {
    e.preventDefault();
    setListNumber((priceSetNumber) => priceSetNumber + 1);
    setRemoveIndex("");
  };

  const removeOptions = (e) => {
    e.preventDefault();

    const listIndex = parseInt(e.target.dataset.listIndex);
    setRemoveIndex(listIndex);

    const ageFrom = JSON.parse(JSON.stringify(ageStart));
    delete ageFrom[listIndex];
    setAgeStart(ageFrom);

    const ageTo = JSON.parse(JSON.stringify(ageEnd));
    delete ageTo[listIndex];
    setAgeEnd(ageTo);

    setListNumber((priceSetNumber) => priceSetNumber - 1);
  };

  const getListByCount = (optionContent, count, removeOptions) => {
    const checkAge = (_, value) => {
      //   optionForm.validateFields([option]);
      //   const age = optionForm.getFieldValue(option);
    };

    const checkPrice = (input) => {
      inputForm.validateFields([input]);
    };

    const handleAgeChange = (from, index) => {
      // 檢查上一個清單的費用
      checkPrice(`number_input_${index - 1}`);

      if (from === "start") {
        let temp = [...ageStart];
        temp[index] = optionForm.getFieldValue(`age_option_start_${index}`);
        setAgeStart(temp);
      } else if (from === "end") {
        let temp = [...ageEnd];
        temp[index] = optionForm.getFieldValue(`age_option_end_${index}`);
        setAgeEnd(temp);
      }
    };

    const result = listContent.map((v) => {
      return (
        <div key={v.index}>
          <div className="flex-between">
            <div className="option-title">價格設定 - {v.index + 1}</div>
            {v.index !== 0 && (
              <a
                href=""
                className="remove-setting flex-between"
                onClick={removeOptions}
                data-list-index={v.index}
              >
                <span
                  className="material-symbols-outlined"
                  data-list-index={v.index}
                >
                  close
                </span>{" "}
                移除
              </a>
            )}
          </div>

          <div className="flex-between">
            <div className="option-border">
              <div>年齡</div>
              <Form form={optionForm}>
                <div className="option-area">
                  <Form.Item
                    name={`age_option_start_${v.index}`}
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
                      onChange={() => handleAgeChange("start", v.index)}
                    />
                  </Form.Item>
                  <div className="between-text flex-center">～</div>
                  <Form.Item
                    name={`age_option_end_${v.index}`}
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
                      onChange={() => handleAgeChange("end", v.index)}
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
                    name={`number_input_${v.index}`}
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
                      min={0}
                      style={{ width: 350 }}
                      onBlur={() => checkPrice(`number_input_${v.index}`)}
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
      {getListByCount(optionContent, listNumber, removeOptions)}
    </div>
  );
}

export default Booking;
